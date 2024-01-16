import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminReview } from 'src/entity/adminReview.entity';
import { Store } from 'src/entity/store.entity';
import { User } from '../entity/user.entity';
// import { StoreReview } from 'src/entity';
import { CreateAdminReviewDto } from './dto/create-adminReview.dto';
import { UpdateAdminReviewDto } from './dto/update-adminReview.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminReviewService {
  constructor(
    @InjectRepository(AdminReview)
    private readonly adminReviewRepository: Repository<AdminReview>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    // @InjectRepository(Store)
    // private storeReviewRepository: Repository<StoreReview>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) {}

  // 특정 리뷰에 대한 답글 전체 조회
  async findAdminReviewsByReview(storeId: number, reviewId: number) {
    await this.verifyStoreByStoreId(storeId);
    // await this.verifyStoreIdAndReviewId(storeId, reviewId);
    return await this.adminReviewRepository.find({
      where: { reviewId: reviewId },
    });
  }

  // 가게에 대한 리뷰 답글 조회
  async findAdminReviewsByStore(storeId: number) {
    // 리뷰 밑에 리뷰 답글 조회 되도록 할 예정?
    return await this.adminReviewRepository.find({
      where: { storeId: storeId },
    });
  }

  // 리뷰 답글 작성
  async createAdminReview(
    storeId: number,
    reviewId: number,
    userId: number,
    createAdminReviewDto: CreateAdminReviewDto,
  ) {
    await this.checkUser(userId, storeId);
    // await this.verifyStoreIdAndReviewId(storeId, reviewId);
    const existAdminReviewCount = await this.adminReviewRepository.count({
      where: { reviewId },
    });
    if (existAdminReviewCount > 0) {
      throw new BadRequestException('이미 리뷰에 대한 답글이 존재합니다.');
    }
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
    userId: number,
    updateAdminReviewDto: UpdateAdminReviewDto,
  ) {
    await this.checkUser(userId, storeId);
    await this.verifyStoreByStoreId(storeId);
    // await this.verifyStoreIdAndReviewId(storeId, reviewId);
    await this.verifyReviewIdAndId(reviewId, id);
    await this.adminReviewRepository.update(id, { ...updateAdminReviewDto });
    return { message: 'OK' };
  }

  // 리뷰 답글 삭제
  async deleteAdminReview(
    storeId: number,
    reviewId: number,
    id: number,
    userId: number,
  ) {
    await this.checkUser(userId, storeId);
    await this.verifyStoreByStoreId(storeId);
    // await this.verifyStoreIdAndReviewId(storeId, reviewId);
    await this.verifyReviewIdAndId(reviewId, id);
    await this.adminReviewRepository.delete(id);
    return { message: 'OK' };
  }

  // 유저(소유주) 검증
  async checkUser(userId: number, storeId: number) {
    const user = await this.verifyUserByUserId(userId);
    const store = await this.verifyStoreByStoreId(storeId);
    if (user.id !== store.admin.id) {
      throw new BadRequestException('소유주만 가능합니다.');
    }
  }

  // userId 검증을 통한 user 찾기
  async verifyUserByUserId(userId: number) {
    return await this.userService.findUserById(userId);
  }

  //storeId 검증을 통한 지점 찾기
  async verifyStoreByStoreId(storeId: number) {
    const existStoreId = await this.storeRepository.findOne({
      where: { id: storeId },
      relations: { admin: true },
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
