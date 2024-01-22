import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReceiptAuth } from '../entity/receiptAuth.entity';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReceiptAuthService {
  private readonly client: ImageAnnotatorClient;

  constructor(
    @InjectRepository(ReceiptAuth)
    private readonly receiptAuthRepository: Repository<ReceiptAuth>,
    private readonly configService: ConfigService,
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

    // 텍스트 추출
    const detections = result.textAnnotations;
    console.log('Text:');
    detections.every((text) => console.log(text.description));

    const keywords = ['합계', '부과세', '금액', '품명'];
    const keywordResult = detections.forEach((result) =>
      keywords.some((keyword) => result.description.includes(keyword)),
    );
    console.log(keywordResult);

    // // OCR 결과를 데이터베이스에 저장
  }
}
