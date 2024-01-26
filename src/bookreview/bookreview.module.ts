import { Module } from '@nestjs/common';
import { BookReviewService } from './bookreview.service';
import { BookReviewController } from './bookreview.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/entity/book.entity';
import { StoreBook } from 'src/entity/store-book.entity';
import { User } from 'src/entity/user.entity';
import { MyPage } from 'src/entity/my-page.entity';
import { BookReview } from 'src/entity/bookreview.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, StoreBook, User, MyPage, BookReview]),
  ],
  controllers: [BookReviewController],
  providers: [BookReviewService],
})
export class BookReviewModule {}
