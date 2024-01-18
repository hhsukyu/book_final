import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminReview } from '../entity/adminReview.entity';
import { CreateAdminReviewDto } from './dto/create-adminReview.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../entity/store.entity';
// import { StoreReview } from '../entity/storeReview.entity';
import { UpdateAdminReviewDto } from './dto/update-adminReview.dto';
import { User } from '../entity/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminReviewService {
  constructor(
    @InjectRepository(AdminReview)
    private adminReviewRepository: Repository<AdminReview>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    // @InjectRepository(StoreReview)
    // private readonly storeReviewRepository: Repository<StoreReview>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) {}

  // 특정 리뷰에 대한 답글 전체 조회
  async findAdminReviewsByReview(storeId: number, storeReviewId: number) {
    await this.verifyStore(storeId);
    // await this.verifyStoreReview(storeId, storeReviewId);
    const adminReview = await this.adminReviewRepository.find({
      where: { storeId, storeReviewId },
    });
    if (adminReview.length === 0) {
      throw new BadRequestException('리뷰에 대한 답글이 존재하지 않습니다.');
    }
    return adminReview;
  }

  // 가게에 대한 리뷰 답글 조회
  async findAdminReviewsByStore(storeId: number) {
    const adminReview = await this.adminReviewRepository.find({
      where: { storeId: storeId },
    });
    if (adminReview.length === 0) {
      throw new BadRequestException('리뷰에 대한 답글이 존재하지 않습니다.');
    }
    return adminReview;
  }

  // 리뷰 답글 작성
  async createAdminReview(
    storeId: number,
    storeReviewId: number,
    userId: number,
    createAdminReviewDto: CreateAdminReviewDto,
  ) {
    await this.checkUser(userId, storeId);
    // await this.verifyStoreReview(storeId, storeReviewId);
    const adminReviewCount = await this.adminReviewRepository.count({
      where: { storeId, storeReviewId },
    });
    if (adminReviewCount > 0) {
      throw new BadRequestException('이미 리뷰에 대한 답글이 존재합니다.');
    }
    const AdminReview = this.adminReviewRepository.create({
      storeId,
      storeReviewId,
      content: createAdminReviewDto.content,
    });
    return await this.adminReviewRepository.save(AdminReview);
  }

  // 리뷰 답글 수정
  async updateAdminReview(
    storeId: number,
    storeReviewId: number,
    id: number,
    userId: number,
    updateAdminReviewDto: UpdateAdminReviewDto,
  ) {
    await this.checkUser(userId, storeId);
    await this.verifyStore(storeId);
    // await this.verifyStoreReview(storeId, storeReviewId);
    await this.verifyReviewIdAndId(storeReviewId, id);
    await this.adminReviewRepository.update(id, { ...updateAdminReviewDto });
    return { message: 'OK' };
  }

  // 리뷰 답글 삭제
  async deleteAdminReview(
    storeId: number,
    storeReviewId: number,
    id: number,
    userId: number,
  ) {
    await this.checkUser(userId, storeId);
    await this.verifyStore(storeId);
    // await this.verifyStoreReview(storeId, storeReviewId);
    await this.verifyReviewIdAndId(storeReviewId, id);
    await this.adminReviewRepository.delete(id);
    return { message: 'OK' };
  }

  //storeId 검증을 통한 지점 찾기
  async verifyStore(storeId: number) {
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });
    if (!store) {
      throw new NotFoundException('지점을 찾을 수 없습니다.');
    }
    return store;
  }

  // 유저(소유주) 검증
  async checkUser(userId: number, storeId: number) {
    const user = await this.userService.findUserById(userId);
    const store = await this.verifyStore(storeId);
    if (user.stores.every((s) => s.id !== store.id)) {
      throw new BadRequestException('소유주만 가능합니다.');
    }
  }

  // storeId와 reviewId 검증을 통한 가게리뷰 찾기
  // async verifyStoreReview(storeId: number, storeReviewId: number) {
  //   const storeReview = await this.storeReviewRepository.find({
  //     where: { id: storeReviewId, store: { id: storeId } },
  //   });
  //   if (storeReview.length === 0) {
  //     throw new NotFoundException('가게리뷰를 찾을 수 없습니다.');
  //   }
  // }

  // reviewId 와 id 검증을 통한 리뷰 답글 찾기
  async verifyReviewIdAndId(storeReviewId: number, id: number) {
    const adminReview = await this.adminReviewRepository.find({
      where: { storeReviewId, id },
    });
    console.log(adminReview);
    if (adminReview.length === 0) {
      throw new NotFoundException('리뷰 답글을 찾을 수 없습니다.');
    }
    return adminReview;
  }
}
