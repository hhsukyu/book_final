import {
  Controller,
  Param,
  Body,
  Post,
  Get,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateAdminReviewDto } from './dto/create-adminReview.dto';
import { UpdateAdminReviewDto } from './dto/update-adminReview.dto';
import { AdminReviewService } from './adminReview.service';
import { accessTokenGuard } from '../auth/guard/access-token.guard';
import { UserId } from '../auth/decorators/userId.decorator';

@Controller('reviews/:storeId')
export class AdminReviewController {
  constructor(private readonly adminReviewService: AdminReviewService) {}

  // 특정 리뷰에 대한 리뷰 답글 조회
  @Get(':reviewId/adminReview')
  async findAdminReviewsByReview(
    @Param('storeId') storeId: number,
    @Param('reviewId') reviewId: number,
  ) {
    return await this.adminReviewService.findAdminReviewsByReview(
      storeId,
      reviewId,
    );
  }

  // 가게에 대한 리뷰 답글 조회
  @Get('adminReview')
  async findAdminReviewsByStore(@Param('storeId') storeId: number) {
    return await this.adminReviewService.findAdminReviewsByStore(storeId);
  }

  // 리뷰 답글 작성
  @UseGuards(accessTokenGuard)
  @Post(':reviewId/adminReview')
  async createAdminReview(
    @Param('storeId') storeId: number,
    @Param('reviewId') reviewId: number,
    @UserId() userId: number,
    @Body() createAdminReviewDto: CreateAdminReviewDto,
  ) {
    return await this.adminReviewService.createAdminReview(
      storeId,
      reviewId,
      userId,
      createAdminReviewDto,
    );
  }

  // 리뷰 답글 수정
  @UseGuards(accessTokenGuard)
  @Put(':reviewId/adminReview/:id')
  async updateAdminReview(
    @Param('storeId') storeId: number,
    @Param('reviewId') reviewId: number,
    @Param('id') id: number,
    @UserId() userId: number,
    @Body() updateAdminReviewDto: UpdateAdminReviewDto,
  ) {
    return await this.adminReviewService.updateAdminReview(
      storeId,
      reviewId,
      id,
      userId,
      updateAdminReviewDto,
    );
  }

  // 리뷰 답글 삭제
  @UseGuards(accessTokenGuard)
  @Delete(':reviewId/adminReview/:id')
  async deleteAdminReview(
    @Param('storeId') storeId: number,
    @Param('reviewId') reviewId: number,
    @Param('id') id: number,
    @UserId() userId: number,
  ) {
    return await this.adminReviewService.deleteAdminReview(
      storeId,
      reviewId,
      id,
      userId,
    );
  }
}
