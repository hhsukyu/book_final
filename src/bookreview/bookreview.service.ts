import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBookReviewDto } from './dto/create-bookreview.dto';
import { UpdateBookReviewDto } from './dto/update-bookreview.dto';

@Injectable()
export class BookReviewService {
  private readonly bookReviews: Record<number, any> = {};

  create(
    bookId: number,
    userId: number,
    createBookReviewDto: CreateBookReviewDto,
  ) {
    // 로그인한 사용자의 userId를 이용하여 글 작성
    const id = Date.now();
    this.bookReviews[id] = { id, bookId, userId, ...createBookReviewDto };
    return this.bookReviews[id];
  }

  findAll(bookId: number) {
    // 책에 대한 모든 후기를 반환
    return Object.values(this.bookReviews).filter(
      (review) => review.bookId === bookId,
    );
  }

  findOne(bookId: number, id: number) {
    // 특정 후기를 반환하며, 해당 후기가 해당 책에 속한 것인지 확인
    const bookReview = this.bookReviews[id];
    if (!bookReview || bookReview.bookId !== bookId) {
      throw new NotFoundException('책 후기를 찾을 수 없습니다.');
    }
    return bookReview;
  }

  update(
    bookId: number,
    id: number,
    userId: number,
    updateBookReviewDto: UpdateBookReviewDto,
  ) {
    // 해당 글을 작성한 사용자만 수정 가능
    const bookReview = this.findOne(bookId, id);
    if (bookReview.userId !== userId) {
      throw new UnauthorizedException('글을 수정할 권한이 없습니다.');
    }
    this.bookReviews[id] = { ...bookReview, ...updateBookReviewDto };
    return this.bookReviews[id];
  }

  remove(bookId: number, id: number, userId: number) {
    // 해당 글을 작성한 사용자만 삭제 가능
    const bookReview = this.findOne(bookId, id);
    if (bookReview.userId !== userId) {
      throw new UnauthorizedException('글을 삭제할 권한이 없습니다.');
    }
    delete this.bookReviews[id];
    return bookReview;
  }
}
