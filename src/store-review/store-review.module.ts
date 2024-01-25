import { Module } from '@nestjs/common';
import { StoreReviewService } from './store-review.service';
import { StoreReviewController } from './store-review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreReview } from 'src/entity/storeReview.entity';
import { User } from '../entity/user.entity';
import { Store } from '../entity/store.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoreReview, User, Store])],
  controllers: [StoreReviewController],
  providers: [StoreReviewService, UserService],
})
export class StoreReviewModule {}
