import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminReview } from 'src/entity/adminReview.entity';
import { AdminReviewService } from './adminReview.service';
import { AdminReviewController } from './adminReview.controller';
import { User } from '../entity/user.entity';
import { Store } from '../entity/store.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminReview, User, Store])],
  providers: [AdminReviewService, UserService],
  controllers: [AdminReviewController],
})
export class AdminReviewModule {}
