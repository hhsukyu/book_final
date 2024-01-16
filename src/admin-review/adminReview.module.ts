import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminReview } from 'src/entity/adminReview.entity';
import { AdminReviewService } from './adminReview.service';
import { AdminReviewController } from './adminReview.controller';
import { Store } from '../entity/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminReview, Store])],
  providers: [AdminReviewService],
  controllers: [AdminReviewController],
})
export class AdminReviewModule {}
