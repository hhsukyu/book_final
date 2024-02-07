import {
  BadRequestException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt } from '../entity/receipt.entity';
import { Store } from '../entity/store.entity';
import { User } from '../entity/user.entity';
import { StoreReview } from '../entity/storeReview.entity';
import { UserService } from '../user/user.service';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { CreateStoreReviewDto } from '../store-review/dto/create-store-review.dto';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { WebClient } from '@slack/web-api';

@Injectable()
export class ReceiptService {
  private readonly client: ImageAnnotatorClient;
  private readonly storage: Storage;
  private readonly bucket: string;
  private readonly web: WebClient;

  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepository: Repository<Receipt>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    @InjectRepository(StoreReview)
    private storeReviewRepository: Repository<StoreReview>,
    private readonly configService: ConfigService,
  ) {
    (this.client = new ImageAnnotatorClient({
      keyFilename: 'google_ocr_key.json',
    })),
      (this.storage = new Storage({
        projectId: `${this.configService.get('receipt_projectId')}`,
        keyFilename: `${this.configService.get('receit_keyfile')}`,
      }));
    this.bucket = `${this.configService.get('receipt_BUCKET_NAME')}`;
    this.web = new WebClient(`${this.configService.get('slack_token')}`);
  }

  // 영수증 인증
  async analyzeFile(file: Express.Multer.File, userId: number, url: string) {
    await this.checkUser(userId);
    if (!file) {
      throw new BadRequestException('영수증 파일이 없습니다.');
    }

    const fileName = `${url}`;
    const [result] = await this.client.textDetection(fileName);
    const detections = result.textAnnotations;
    const keywords = [
      '부가세',
      '금액',
      '품명',
      '합계',
      '카드',
      '현금',
      '주문',
      '번호',
      '사업자번호',
      '점',
    ];

    // string으로 텍스트 추출
    const receiptInfo = detections.map((text) => text.description).join();
    console.log(receiptInfo);
    const receiptInfo1 = detections.map((text) => text.description);
    console.log(receiptInfo1);

    const keywordResult = keywords.map((keyword) =>
      receiptInfo.includes(keyword),
    );

    // keyword와 영수증정보에서 일치하는 개수
    const keywordTrueCount = keywordResult.filter(
      (value) => value === true,
    ).length;

    if (keywordTrueCount < 7) {
      throw new BadRequestException('영수증이 아닙니다.');
    }

    const matchedStore = await this.verifyStoreNameAndAddress(receiptInfo);
    await this.verifyReceipt(receiptInfo);

    // OCR 결과를 데이터베이스에 저장
    return await this.receiptRepository.save({
      data: receiptInfo,
      store: { id: matchedStore },
      user: { id: userId },
      receipt_img: url,
    });
  }

  // 영수증 리뷰 작성
  async createReceiptReview(
    file: Express.Multer.File,
    userId: number,
    createStoreReviewDto: CreateStoreReviewDto,
    url: string,
  ) {
    const receipt = await this.analyzeFile(file, userId, url);
    if (receipt.status === 0) {
      const storeReview = await this.storeReviewRepository.save({
        ...createStoreReviewDto,
        user_id: userId,
        store_id: receipt.store.id,
        is_receipt: false,
        receipt_id: receipt.id,
      });
      // return storeReview;
      return { message: '영수증을 검토중입니다.' };
    }
  }

  // 유저 체크
  async checkUser(userId: number) {
    const user = await this.userService.findUserById(userId);
    if (user.role !== 0) {
      throw new BadRequestException('손님만 가능합니다.');
    }
  }

  // 이미지 업로드 구글 스토리지
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = Date.now() + file.originalname;
    const bucket = this.storage.bucket(this.bucket);
    const blob = bucket.file(fileName.replace(/ /g, '_'));
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      public: true,
    });
    blobStream.end(file.buffer);

    console.log(blobStream.on);
    return new Promise((resolve, reject) => {
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      });

      blobStream.on('error', (err) => {
        reject(err);
      });
    });
  }

  // 슬랙으로 보내기
  async sendMessage() {
    // See: https://api.slack.com/methods/chat.postMessage
    const res = await this.web.chat.postMessage({
      channel: `${this.configService.get('slack_conversationId')}`,
      text: 'Hello there',
    });

    // `res` contains information about the posted message
    console.log('Message sent: ', res.ts);
  }

  // 추출한 정보를 바탕으로 가게 검증
  async verifyStoreNameAndAddress(receiptInfo: string) {
    const stores = await this.storeRepository.find();
    const storeName = stores.map((store) => store.store_name);
    const storeAddress = stores.map((store) => store.store_address);

    const compareStoreName = storeName.some((name) =>
      receiptInfo.includes(name),
    );
    const compareStoreAddress = storeAddress.some((address) =>
      receiptInfo.includes(address),
    );
    if (!compareStoreName || !compareStoreAddress) {
      throw new BadRequestException(
        '영수증에 일치하는 가게를 찾을 수 없습니다.',
      );
    }

    const matchedStore = stores.filter(
      (store) =>
        receiptInfo.includes(store.store_name) &&
        receiptInfo.includes(store.store_address),
    );
    return matchedStore[0].id;
  }

  // 영수증 중복 체크
  async verifyReceipt(receiptInfo: string) {
    const receiptData = await this.receiptRepository.find({
      where: { data: receiptInfo },
    });
    if (receiptData.length > 0) {
      throw new ConflictException('이미 인증된 영수증 입니다.');
    }
  }
}
