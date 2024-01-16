import {
  Controller,
  Param,
  Body,
  Post,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateAdminReviewDto } from './dto/create-adminReview.dto';
import { UpdateAdminReviewDto } from './dto/update-adminReview.dto';
import { AdminReviewService } from './adminReview.service';

// 별점 후기에 대한 리뷰 답글
@Controller('reviews/:storeId/:reviewId/adminReview')
export class AdminReviewController {
  constructor(private readonly adminReviewService: AdminReviewService) {}

  // 리뷰 답글 전체 조회
  @Get()
  async findAllAdminReviews(
    @Param('storeId') storeId: number,
    @Param('reviewId') reviewId: number,
  ) {
    return await this.adminReviewService.findAllAdminReviews(storeId, reviewId);
  }

  // 본인 리뷰 답글 조회

  // 리뷰 답글 작성
  @Post()
  async createAdminReview(
    @Param('storeId') storeId: number,
    @Param('reviewId') reviewId: number,
    @Body() createAdminReviewDto: CreateAdminReviewDto,
  ) {
    return await this.adminReviewService.createAdminReview(
      storeId,
      reviewId,
      createAdminReviewDto,
    );
  }

  // 리뷰 답글 수정
  @Put(':id')
  async updateAdminReview(
    @Param('storeId') storeId: number,
    @Param('reviewId') reviewId: number,
    @Param('id') id: number,
    @Body() updateAdminReviewDto: UpdateAdminReviewDto,
  ) {
    return await this.adminReviewService.updateAdminReview(
      storeId,
      reviewId,
      id,
      updateAdminReviewDto,
    );
  }

  // 리뷰 답글 삭제
  @Delete(':id')
  async deleteAdminReview(
    @Param('storeId') storeId: number,
    @Param('reviewId') reviewId: number,
    @Param('id') id: number,
  ) {
    return await this.adminReviewService.deleteAdminReview(
      storeId,
      reviewId,
      id,
    );
  }
}
