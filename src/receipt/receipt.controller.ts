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
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('receipts')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload menu with image.',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The image file to upload..',
        },
        content: {
          type: 'string',
          description: 'The content of the storeReview.',
        },
        rating: {
          type: 'string',
          description: 'The rating of the storeReview.',
        },
      },
    },
  })
  @Post('review')
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
