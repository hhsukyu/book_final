import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminReview } from 'src/entity/adminReview.entity';
import { Store } from 'src/entity/store.entity';
// import { StoreReview } from 'src/entity';
import { CreateAdminReviewDto } from './dto/create-adminReview.dto';
import { UpdateAdminReviewDto } from './dto/update-adminReview.dto';

@Injectable()
export class AdminReviewService {
  constructor(
    @InjectRepository(AdminReview)
    private readonly adminReviewRepository: Repository<AdminReview>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    // @InjectRepository(Store)
    // private storeReviewRepository: Repository<StoreReview>,
  ) {}

  // 리뷰에 대한 답글 전체 조회
  async findAllAdminReviews(storeId: number, reviewId: number) {
    await this.verifyStoreId(storeId);
    // await this.verifyStoreIdAndReviewId(storeId, reviewId);
    return await this.adminReviewRepository.find({
      where: { reviewId: reviewId },
    });
  }

  // 리뷰 답글 작성
  async createAdminReview(
    storeId: number,
    reviewId: number,
    createAdminReviewDto: CreateAdminReviewDto,
  ) {
    await this.verifyStoreId(storeId);
    // await this.verifyStoreIdAndReviewId(storeId, reviewId);
    const AdminReview = this.adminReviewRepository.create({
      storeId,
      reviewId,
      content: createAdminReviewDto.content,
    });
    return await this.adminReviewRepository.save(AdminReview);
  }

  // 리뷰 답글 수정
  async updateAdminReview(
    storeId: number,
    reviewId: number,
    id: number,
    updateAdminReviewDto: UpdateAdminReviewDto,
  ) {
    await this.verifyStoreId(storeId);
    // await this.verifyStoreIdAndReviewId(storeId, reviewId);
    await this.verifyReviewIdAndId(reviewId, id);
    await this.adminReviewRepository.update(id, updateAdminReviewDto);
    return { message: 'OK' };
  }

  // 리뷰 답글 삭제
  async deleteAdminReview(storeId: number, reviewId: number, id: number) {
    await this.verifyStoreId(storeId);
    // await this.verifyStoreIdAndReviewId(storeId, reviewId);
    await this.verifyReviewIdAndId(reviewId, id);
    await this.adminReviewRepository.delete(id);
    return { message: 'OK' };
  }

  //storeId 검증을 통한 지점 찾기
  async verifyStoreId(storeId: number) {
    const existStoreId = await this.storeRepository.findOne({
      where: { id: storeId },
    });
    if (!existStoreId) {
      throw new NotFoundException('지점을 찾을 수 없습니다.');
    }
    return existStoreId;
  }

  // storeId와 reviewId 검증을 통한 가게리뷰 찾기
  // async verifyStoreIdAndReviewId(storeId: number, reviewId: number) {
  //   const existStoreIdAndReviewId = await this.storeReviewRepository.findOne({
  //     where: { storeId, reviewId },
  //   });
  //   if (!existStoreIdAndReviewId) {
  //     throw new NotFoundException('가게리뷰를 찾을 수 없습니다.');
  //   }
  //   return existStoreIdAndReviewId;
  // }

  // reviewId 와 id 검증을 통한 리뷰 답글 찾기
  async verifyReviewIdAndId(reviewId: number, id: number) {
    const existReviewIdAndId = await this.adminReviewRepository.findOne({
      where: { reviewId, id },
    });
    if (!existReviewIdAndId) {
      throw new NotFoundException('리뷰 답글을 찾을 수 없습니다.');
    }
    return existReviewIdAndId;
  }
}
