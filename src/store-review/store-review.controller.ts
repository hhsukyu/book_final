import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { StoreReviewService } from './store-review.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { accessTokenGuard } from '..//auth/guard/access-token.guard';
import { UserId } from '../auth/decorators/userId.decorator';
import { CreateStoreReviewDto } from './dto/create-store-review.dto';
import { UpdateStoreReviewDto } from './dto/update-store-review.dto';

@Controller('reviews/:store_id')
export class StoreReviewController {
  constructor(private readonly storeReviewService: StoreReviewService) {}

  //리뷰 등록
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Post('')
  async createStoreReview(
    @Param('store_id') store_id: number,
    @UserId() user_id: number,
    @Body() createStoreReviewDto: CreateStoreReviewDto,
  ) {
    return await this.storeReviewService.createStoreReview(
      store_id,
      user_id,
      createStoreReviewDto,
    );
  }

  //모든 리뷰 조회
  @Get('')
  async findReviewList(@Param('storeId') storeId: number) {
    return await this.storeReviewService.findReviewList(storeId);
  }

  @Get('/reviewid/:reviewid')
  async findOneReview(
    @Param('storeId') storeId: number,
    @Param('reviewId') reviewId: number,
  ) {
    return await this.storeReviewService.findOneReview(storeId, reviewId);
  }

  //리뷰 수정
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Put('/reviewid/:reviewid')
  async editOneReview(
    @Param('storeId') storeId: number,
    @Param('reviewId') reviewId: number,
    @UserId() user_id: number,
    @Body() updateStoreReviewDto: UpdateStoreReviewDto,
  ) {
    return await this.storeReviewService.editOneReview(
      storeId,
      reviewId,
      user_id,
      updateStoreReviewDto,
    );
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Delete('/reviewid/:reviewid')
  async deleteOneReview(
    @Param('storeId') storeId: number,
    @Param('reviewId') reviewId: number,
    @UserId() user_id: number,
  ) {
    return await this.storeReviewService.deleteOneReview(
      storeId,
      reviewId,
      user_id,
    );
  }
}
