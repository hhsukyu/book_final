import { Module } from '@nestjs/common';
import { BookReviewService } from './bookreview.service';
import { BookReviewController } from './bookreview.controller';

@Module({
  controllers: [BookReviewController],
  providers: [BookReviewService],
})
export class BookReviewModule {}
