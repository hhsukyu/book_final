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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { accessTokenGuard } from '../auth/guard/access-token.guard';
import { UserId } from '../auth/decorators/userId.decorator';
import { CreateStoreReviewDto } from './dto/create-store-review.dto';
import { UpdateStoreReviewDto } from './dto/update-store-review.dto';

@ApiTags('스토어 리뷰')
@Controller('reviews')
export class StoreReviewController {
  constructor(private readonly storeReviewService: StoreReviewService) {}

  //리뷰 등록
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Post('/:store_id')
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
  @Get('/:store_id')
  async findReviewList(@Param('store_id') store_id: number) {
    return await this.storeReviewService.findReviewList(store_id);
  }

  @Get('/:store_id/reviewid/:reviewid')
  async findOneReview(
    @Param('store_id') store_id: number,
    @Param('reviewid') reviewid: number,
  ) {
    return await this.storeReviewService.findOneReview(store_id, reviewid);
  }

  //리뷰 수정
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Put('/:store_id/reviewid/:reviewid')
  async editOneReview(
    @Param('store_id') store_id: number,
    @Param('reviewid') reviewid: number,
    @UserId() user_id: number,
    @Body() updateStoreReviewDto: UpdateStoreReviewDto,
  ) {
    return await this.storeReviewService.editOneReview(
      store_id,
      reviewid,
      user_id,
      updateStoreReviewDto,
    );
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Delete('/:store_id/reviewid/:reviewid')
  async deleteOneReview(
    @Param('store_id') store_id: number,
    @Param('reviewid') reviewid: number,
    @UserId() user_id: number,
  ) {
    return await this.storeReviewService.deleteOneReview(
      store_id,
      reviewid,
      user_id,
    );
  }
}
