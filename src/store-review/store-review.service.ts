import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStoreReviewDto } from './dto/create-store-review.dto';
import { UpdateStoreReviewDto } from './dto/update-store-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../entity/store.entity';
import { User } from '../entity/user.entity';
import { StoreReview } from '../entity/storeReview.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StoreReviewService {
  constructor(
    @InjectRepository(StoreReview)
    private storeReviewRepository: Repository<StoreReview>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) {}

  //리뷰 생성
  async createStoreReview(
    storeId: number,
    userId: number,
    createStoreReviewDto: CreateStoreReviewDto,
  ) {
    const user = await this.userService.findUserById(userId);
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });

    if (user.role !== 0) {
      throw new BadRequestException('사장님은 일반 리뷰를 등록할 수 없습니다.');
    }

    const review = await this.storeReviewRepository.save({
      ...createStoreReviewDto,
      user_id: userId,
      store_id: storeId, //DB: 변수
    });

    return review;
  }

  //모든 리뷰 조회
  async findReviewList(storeid: number) {
    const store = await this.storeRepository.findOne({
      where: { id: storeid },
    });
    const reviewlist = store.store_reviews;
    console.log(reviewlist); //코드 체크
    return reviewlist;
  }

  //단일 리뷰 조회
  async findOneReview(storeid: number, reviewid: number) {
    const review = await this.storeReviewRepository.findOne({
      where: { store_id: storeid, id: reviewid },
    });
    console.log(review);
    return review;
  }

  //리뷰 수정
  async editOneReview(
    storeid: number,
    reviewid: number,
    userid: number,
    updateStoreReviewDto: UpdateStoreReviewDto,
  ) {
    const review = await this.storeReviewRepository.findOne({
      where: { store_id: storeid, id: reviewid },
    });

    if (userid !== review.user_id) {
      throw new BadRequestException('작성자만 리뷰를 수정할 수 있습니다.');
    }
    await this.storeReviewRepository.update(
      {
        id: reviewid,
      },
      {
        ...updateStoreReviewDto,
      },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} storeReview`;
  }
}
