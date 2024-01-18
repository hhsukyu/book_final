import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminReview } from 'src/entity/adminReview.entity';
import { AdminReviewService } from './adminReview.service';
import { AdminReviewController } from './adminReview.controller';
import { User } from '../entity/user.entity';
import { Store } from '../entity/store.entity';
import { UserService } from '../user/user.service';
// import { StoreReview } from '../entity/storeReview.entity';

// imports 부분에  StoreReview 넣어주세요! 현재 storeReview가 없어서 제거했습니다!
@Module({
  imports: [TypeOrmModule.forFeature([AdminReview, User, Store])],
  providers: [AdminReviewService, UserService],
  controllers: [AdminReviewController],
})
export class AdminReviewModule {}
