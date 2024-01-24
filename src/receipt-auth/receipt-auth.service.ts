import {
  BadRequestException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReceiptAuth } from '../entity/receiptAuth.entity';
import { Store } from '../entity/store.entity';
import { User } from '../entity/user.entity';
import { StoreReview } from '../entity/storeReview.entity';
import { UserService } from '../user/user.service';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { CreateStoreReviewDto } from '../store-review/dto/create-store-review.dto';

@Injectable()
export class ReceiptAuthService {
  private readonly client: ImageAnnotatorClient;

  constructor(
    @InjectRepository(ReceiptAuth)
    private readonly receiptAuthRepository: Repository<ReceiptAuth>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    @InjectRepository(StoreReview)
    private storeReviewRepository: Repository<StoreReview>,
  ) {
    this.client = new ImageAnnotatorClient({
      keyFilename: 'google_ocr_key.json',
    });
  }

  // 영수증 인증
  async analyzeFile(file: Express.Multer.File, userId: number) {
    await this.checkUser(userId);
    if (!file) {
      throw new BadRequestException('영수증 파일이 없습니다.');
    }
    // 이미지를 Google Cloud Vision API에 전송
    const [result] = await this.client.textDetection({
      image: {
        content: file.buffer.toString('base64'),
      },
    });
    const detections = result.textAnnotations;
    const keywords = ['합계', '부과세', '금액', '품명'];
    const keywordResult = detections.some((result) =>
      keywords.some((keyword) => result.description.includes(keyword)),
    );
    if (!keywordResult) {
      throw new BadRequestException('영수증이 아닙니다.');
    }
    // string으로 텍스트 추출
    const receiptInfo = detections.map((text) => text.description).join();
    const matchedStore = await this.verifyStoreNameAndAddress(receiptInfo);
    await this.verifyReceipt(receiptInfo);

    // OCR 결과를 데이터베이스에 저장
    return await this.receiptAuthRepository.save({
      data: receiptInfo,
      store: { id: matchedStore },
      user: { id: userId },
    });
  }

  // 영수증 리뷰 작성
  async createReceiptReview(
    file: Express.Multer.File,
    userId: number,
    createStoreReviewDto: CreateStoreReviewDto,
  ) {
    const receipt = await this.analyzeFile(file, userId);
    const storeReview = await this.storeReviewRepository.save({
      ...createStoreReviewDto,
      user_id: userId,
      store_id: receipt.store.id,
      is_receipt: true,
      receipt_id: receipt.id,
    });
    return storeReview;
  }

  // 유저 체크
  async checkUser(userId: number) {
    const user = await this.userService.findUserById(userId);
    if (user.role !== 0) {
      throw new BadRequestException('손님만 가능합니다.');
    }
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
    const receiptData = await this.receiptAuthRepository.find({
      where: { data: receiptInfo },
    });
    if (receiptData.length > 0) {
      throw new ConflictException('이미 인증된 영수증 입니다.');
    }
  }
}
