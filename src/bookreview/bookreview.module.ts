import { Module } from '@nestjs/common';
import { BookreviewService } from './bookreview.service';
import { BookreviewController } from './bookreview.controller';

@Module({
  controllers: [BookreviewController],
  providers: [BookreviewService],
})
export class BookreviewModule {}
