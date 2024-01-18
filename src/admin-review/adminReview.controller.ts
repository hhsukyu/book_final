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
  @Get(':storeReviewId/adminReview')
  async findAdminReviewsByReview(
    @Param('storeId') storeId: number,
    @Param('storeReviewId') storeReviewId: number,
  ) {
    return await this.adminReviewService.findAdminReviewsByReview(
      storeId,
      storeReviewId,
    );
  }

  // 가게에 대한 리뷰 답글 조회
  @Get('adminReview')
  async findAdminReviewsByStore(@Param('storeId') storeId: number) {
    return await this.adminReviewService.findAdminReviewsByStore(storeId);
  }

  // 리뷰 답글 작성
  @UseGuards(accessTokenGuard)
  @Post(':storeReviewId/adminReview')
  async createAdminReview(
    @Param('storeId') storeId: number,
    @Param('storeReviewId') storeReviewId: number,
    @UserId() userId: number,
    @Body() createAdminReviewDto: CreateAdminReviewDto,
  ) {
    return await this.adminReviewService.createAdminReview(
      storeId,
      storeReviewId,
      userId,
      createAdminReviewDto,
    );
  }

  // 리뷰 답글 수정
  @UseGuards(accessTokenGuard)
  @Put(':storeReviewId/adminReview/:id')
  async updateAdminReview(
    @Param('storeId') storeId: number,
    @Param('storeReviewId') storeReviewId: number,
    @Param('id') id: number,
    @UserId() userId: number,
    @Body() updateAdminReviewDto: UpdateAdminReviewDto,
  ) {
    return await this.adminReviewService.updateAdminReview(
      storeId,
      storeReviewId,
      id,
      userId,
      updateAdminReviewDto,
    );
  }

  // 리뷰 답글 삭제
  @UseGuards(accessTokenGuard)
  @Delete(':storeReviewId/adminReview/:id')
  async deleteAdminReview(
    @Param('storeId') storeId: number,
    @Param('storeReviewId') storeReviewId: number,
    @Param('id') id: number,
    @UserId() userId: number,
  ) {
    return await this.adminReviewService.deleteAdminReview(
      storeId,
      storeReviewId,
      id,
      userId,
    );
  }
}
