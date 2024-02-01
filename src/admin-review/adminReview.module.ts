import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminReview } from 'src/entity/adminReview.entity';
import { AdminReviewService } from './adminReview.service';
import { AdminReviewController } from './adminReview.controller';
import { User } from '../entity/user.entity';
import { Store } from '../entity/store.entity';
import { UserService } from '../user/user.service';
import { StoreReview } from '../entity/storeReview.entity';
import { MyPage } from 'src/entity/my-page.entity';
import { MyPageService } from 'src/my-page/my-page.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminReview, User, Store, StoreReview, MyPage]),
  ],
  providers: [AdminReviewService, UserService, MyPageService],
  controllers: [AdminReviewController],
})
export class AdminReviewModule {}
