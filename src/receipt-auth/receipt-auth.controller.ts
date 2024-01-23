import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptAuthService } from './receipt-auth.service';
import { accessTokenGuard } from '../auth/guard/access-token.guard';
import { UserId } from '../auth/decorators/userId.decorator';

@Controller('receiptAuth')
export class ReceiptAuthController {
  constructor(private readonly receiptAuthService: ReceiptAuthService) {}

  @UseGuards(accessTokenGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async postReceipt(
    @UploadedFile() file: Express.Multer.File,
    @UserId() userId: number,
  ) {
    return await this.receiptAuthService.analyzeFile(file, userId);
  }
}
