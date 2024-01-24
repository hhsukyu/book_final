import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptService } from './receipt.service';
import { accessTokenGuard } from '../auth/guard/access-token.guard';
import { UserId } from '../auth/decorators/userId.decorator';
import { CreateStoreReviewDto } from '../store-review/dto/create-store-review.dto';

@UseGuards(accessTokenGuard)
@Controller('receiptAuth')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post('receiptReview')
  @UseInterceptors(FileInterceptor('file'))
  async postReceiptReview(
    @UploadedFile() file: Express.Multer.File,
    @UserId() userId: number,
    @Body() createStoreReviewDto: CreateStoreReviewDto,
  ) {
    return await this.receiptService.createReceiptReview(
      file,
      userId,
      createStoreReviewDto,
    );
  }
}
