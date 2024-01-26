import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BookReviewService } from './bookreview.service';
import { CreateBookReviewDto } from './dto/create-bookreview.dto';
import { UpdateBookReviewDto } from './dto/update-bookreview.dto';
import { accessTokenGuard } from 'src/auth/guard/access-token.guard';
import { UserId } from 'src/auth/decorators/userId.decorator';

@Controller('books/:bookId/reviews')
export class BookReviewController {
  constructor(private readonly bookReviewService: BookReviewService) {}

  @UseGuards(accessTokenGuard)
  @Post()

  //리뷰작성
  create(
    @Param('bookId') book_id: number,
    @UserId() userId: number,
    @Body() createBookReviewDto: CreateBookReviewDto,
  ) {
    return this.bookReviewService.create(book_id, userId, createBookReviewDto);
  }

  //특정책 전체조회
  @Get()
  findAll(@Param('bookId') book_id: number = 1) {
    // 1로 현재 디폴트를 준 상태
    return this.bookReviewService.findAll(book_id);
  }

  //특정책 특정리뷰조회
  @Get(':id')
  findOne(@Param('bookId') book_id: number, @Param('id') id: number) {
    return this.bookReviewService.findOne(book_id, id);
  }

  @UseGuards(accessTokenGuard)
  @Put(':id')
  update(
    @Param('bookId') book_id: number,
    @Param('id') id: number,
    @UserId() userId: number,
    @Body() updateBookReviewDto: UpdateBookReviewDto,
  ) {
    return this.bookReviewService.updateBookReview(
      book_id,
      id,
      userId,
      updateBookReviewDto,
    );
  }

  @UseGuards(accessTokenGuard)
  @Delete(':id')
  remove(
    @Param('bookId') book_id: number,
    @Param('id') id: number,
    @UserId() userId: number,
  ) {
    return this.bookReviewService.deleteBookReview(book_id, id, userId);
  }
}
