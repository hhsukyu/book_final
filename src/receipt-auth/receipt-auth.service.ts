import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReceiptAuth } from '../entity/receiptAuth.entity';
import { Store } from '../entity/store.entity';
import { ImageAnnotatorClient } from '@google-cloud/vision';

@Injectable()
export class ReceiptAuthService {
  private readonly client: ImageAnnotatorClient;

  constructor(
    @InjectRepository(ReceiptAuth)
    private readonly receiptAuthRepository: Repository<ReceiptAuth>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {
    this.client = new ImageAnnotatorClient({
      keyFilename: 'google_ocr_key.json',
    });
  }

  async analyzeFile(file: Express.Multer.File) {
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

    // OCR 결과를 데이터베이스에 저장
    await this.receiptAuthRepository.save({
      data: receiptInfo,
      store: { id: matchedStore },
    });
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
}
