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
import { UpdateReceiptDto } from '../receipt/dto/update-receipt.dto';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { WebClient } from '@slack/web-api';
import * as crypto from 'crypto';

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
      keyFilename: `${this.configService.get('receit_keyfile')}`,
    })),
      (this.storage = new Storage({
        projectId: `${this.configService.get('receipt_projectId')}`,
        keyFilename: `${this.configService.get('receit_keyfile')}`,
      }));
    this.bucket = `${this.configService.get('receipt_BUCKET_NAME')}`;
    this.web = new WebClient(`${this.configService.get('slack_token')}`);
  }

  // 영수증 리뷰 작성
  async createReceiptReview(
    file: Express.Multer.File,
    userId: number,
    storeId: number,
    createStoreReviewDto: CreateStoreReviewDto,
    url: string,
  ) {
    const receipt = await this.analyzeFile(file, userId, storeId, url);
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

  // 전체 영수증 조회
  async findReceipts(userId: number) {
    await this.checkSiteAdmin(userId);
    return await this.receiptRepository.find({
      relations: ['store_reviews', 'store'],
    });
  }

  // 특정 영수증 조회
  async findOneReceipts(userId: number, id: number) {
    await this.checkSiteAdmin(userId);
    const receipt = await this.receiptRepository.find({
      where: { id: id },
      relations: ['store_reviews', 'store'],
    });
    if (receipt.length === 0) {
      throw new BadRequestException('영수증이 존재하지 않습니다.');
    }
    return receipt;
  }

  // 영수증 상태 수정
  async updateReceipts(
    userId: number,
    id: number,
    updateReceiptDto: UpdateReceiptDto,
  ) {
    await this.checkSiteAdmin(userId);
    const receipt = await this.receiptRepository.save({
      id,
      ...updateReceiptDto,
    });
    const storeReviewByReceipt = await this.storeReviewRepository.findOne({
      where: { receipt_id: id },
    });
    if (receipt.status === 1) {
      await this.storeReviewRepository.update(
        { id: storeReviewByReceipt.id },
        { is_receipt: true },
      );
      return { message: 'OK' };
    } else if (receipt.status === 2) {
      await this.storeReviewRepository.update(
        { id: storeReviewByReceipt.id },
        { is_receipt: false },
      );
      return { message: 'OK' };
    }
  }

  // 영수증 인증
  async analyzeFile(
    file: Express.Multer.File,
    userId: number,
    storeId: number,
    url: string,
  ) {
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
    const keywordResult = keywords.map((keyword) =>
      receiptInfo.includes(keyword),
    );

    // keyword와 영수증정보에서 일치하는 개수
    const keywordTrueCount = keywordResult.filter(
      (value) => value === true,
    ).length;
    if (keywordTrueCount < 5) {
      throw new BadRequestException('영수증이 아닙니다.');
    }

    const matchedStore = await this.verifyStoreNameAndAddress(
      receiptInfo,
      storeId,
    );
    const receiptData = await this.receiptHash(receiptInfo);
    await this.verifyReceipt(receiptData);

    // OCR 결과를 데이터베이스에 저장
    const receipt = await this.receiptRepository.save({
      data: receiptData,
      store: { id: matchedStore },
      user: { id: userId },
      receipt_img: url,
    });
    const receiptId = receipt.id;
    await this.sendMessage(url, receiptId);

    return receipt;
  }

  // 유저 체크
  async checkUser(userId: number) {
    const user = await this.userService.findUserById(userId);
    if (user.role !== 0) {
      throw new BadRequestException('손님만 가능합니다.');
    }
  }

  // 관리자 체크
  async checkSiteAdmin(userId: number) {
    const user = await this.userService.findUserById(userId);
    if (user.role !== 2) {
      throw new BadRequestException('관리자만 가능합니다.');
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
  async sendMessage(url: string, receiptId: number) {
    const res = await this.web.chat.postMessage({
      channel: `${this.configService.get('slack_conversationId')}`,
      text: `영수증 ID: ${receiptId}, 영수증 사진: ${url}`,
    });
  }

  // 추출한 정보를 바탕으로 가게 검증
  async verifyStoreNameAndAddress(receiptInfo: string, storeId: number) {
    const store = await this.storeRepository.find({ where: { id: storeId } });

    const compareStoreName = store.every((store) =>
      receiptInfo.includes(store.store_name),
    );
    const compareStoreAddress = store.every((store) =>
      receiptInfo.includes(store.store_address),
    );
    if (!compareStoreName || !compareStoreAddress) {
      throw new BadRequestException(
        '영수증에 일치하는 가게를 찾을 수 없습니다.',
      );
    }

    const matchedStore = store.filter(
      (store) =>
        receiptInfo.includes(store.store_name) &&
        receiptInfo.includes(store.store_address),
    );
    return matchedStore[0].id;
  }

  // 영수증 중복 체크
  async verifyReceipt(receiptData: string) {
    const receipt = await this.receiptRepository.find({
      where: { data: receiptData },
    });

    if (receipt.length > 0) {
      throw new ConflictException('이미 인증된 영수증 입니다.');
    }
  }

  // 영수증 데이터 해시
  async receiptHash(receiptInfo: string) {
    return crypto.createHash('sha256').update(receiptInfo).digest('base64');
  }
}
