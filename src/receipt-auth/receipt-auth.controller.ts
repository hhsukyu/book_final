import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptAuthService } from './receipt-auth.service';

@Controller('receiptAuth')
export class ReceiptAuthController {
  constructor(private readonly receiptAuthService: ReceiptAuthService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async postReceipt(@UploadedFile() file: Express.Multer.File) {
    const result = await this.receiptAuthService.analyzeFile(file);

    return { result };
  }
}
