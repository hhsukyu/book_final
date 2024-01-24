import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptAuthService } from './receipt-auth.service';
import { accessTokenGuard } from '../auth/guard/access-token.guard';
import { UserId } from '../auth/decorators/userId.decorator';
import { CreateStoreReviewDto } from '../store-review/dto/create-store-review.dto';

@UseGuards(accessTokenGuard)
@Controller('receiptAuth')
export class ReceiptAuthController {
  constructor(private readonly receiptAuthService: ReceiptAuthService) {}

  @Post('receiptReview')
  @UseInterceptors(FileInterceptor('file'))
  async postReceiptReview(
    @UploadedFile() file: Express.Multer.File,
    @UserId() userId: number,
    @Body() createStoreReviewDto: CreateStoreReviewDto,
  ) {
    return await this.receiptAuthService.createReceiptReview(
      file,
      userId,
      createStoreReviewDto,
    );
  }
}
