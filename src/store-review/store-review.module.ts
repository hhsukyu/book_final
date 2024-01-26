import { Module } from '@nestjs/common';
import { StoreReviewService } from './store-review.service';
import { StoreReviewController } from './store-review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreReview } from '../entity/storeReview.entity';
import { User } from '../entity/user.entity';
import { Store } from '../entity/store.entity';
import { UserService } from '../user/user.service';
import { MyPage } from 'src/entity/my-page.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreReview, User, Store, MyPage])],
  controllers: [StoreReviewController],
  providers: [StoreReviewService, UserService],
})
export class StoreReviewModule {}
