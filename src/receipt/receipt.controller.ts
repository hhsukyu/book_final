import {
  Controller,
  Post,
  Get,
  Patch,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Body,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptService } from './receipt.service';
import { accessTokenGuard } from '../auth/guard/access-token.guard';
import { UserId } from '../auth/decorators/userId.decorator';
import { CreateStoreReviewDto } from '../store-review/dto/create-store-review.dto';
import { UpdateReceiptDto } from '../receipt/dto/update-receipt.dto';
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
  @Post('review/:storeId')
  @UseInterceptors(FileInterceptor('file'))
  async postReceiptReview(
    @UploadedFile() file: Express.Multer.File,
    @UserId() userId: number,
    @Param('storeId') storeId: number,
    @Body() createStoreReviewDto: CreateStoreReviewDto,
  ) {
    const url = await this.receiptService.uploadFile(file);
    return await this.receiptService.createReceiptReview(
      file,
      userId,
      storeId,
      createStoreReviewDto,
      url,
    );
  }

  // 전체 영수증 조회
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Get()
  async getReceipts(@UserId() userId: number) {
    return await this.receiptService.findReceipts(userId);
  }

  // 특정 영수증 조회
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Get('/:id')
  async getOneReceipts(@UserId() userId: number, @Param('id') id: number) {
    return await this.receiptService.findOneReceipts(userId, id);
  }

  // 영수증 상태 수정
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Patch('/:id')
  async patchReceipt(
    @UserId() userId: number,
    @Param('id') id: number,
    @Body() updateReceiptDto: UpdateReceiptDto,
  ) {
    return await this.receiptService.updateReceipts(
      userId,
      id,
      updateReceiptDto,
    );
  }
}
