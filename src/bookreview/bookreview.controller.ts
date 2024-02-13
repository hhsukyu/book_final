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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('책리뷰')
@Controller('bookreview')
export class BookReviewController {
  constructor(private readonly bookReviewService: BookReviewService) {}

  @UseGuards(accessTokenGuard)
  @Post('/:bookId')
  async create(
    @Param('bookId') bookId: number,
    @UserId() userId: number,
    @Body() createBookReviewDto: CreateBookReviewDto,
  ) {
    console.log(bookId);
    const addBookReview = await this.bookReviewService.create(
      bookId,
      userId,
      createBookReviewDto,
    );
    console.log('addBookReview', addBookReview);
    return addBookReview;
  }

  //특정책 전체조회
  @Get('/:bookId')
  async findAll(@Param('bookId') book_id: number) {
    return await this.bookReviewService.findAll(book_id);
  }

  //특정책 특정리뷰조회
  @Get('/:bookId/:reviewId')
  findOne(
    @Param('bookId') book_id: number,
    @Param('reviewId') reviewId: number,
  ) {
    return this.bookReviewService.findOne(book_id, reviewId);
  }

  //북리뷰 수정
  @UseGuards(accessTokenGuard)
  @Put('/:bookId/:reviewId')
  update(
    @Param('bookId') book_id: number,
    @Param('reviewId') reviewId: number,
    @UserId() userId: number,
    @Body() updateBookReviewDto: UpdateBookReviewDto,
  ) {
    return this.bookReviewService.updateBookReview(
      reviewId,
      book_id,
      userId,
      updateBookReviewDto,
    );
  }

  @UseGuards(accessTokenGuard)
  @Delete('/:bookId/:reviewId')
  remove(
    @Param('bookId') book_id: number,
    @Param('reviewId') reviewId: number,
    @UserId() userId: number,
  ) {
    return this.bookReviewService.deleteBookReview(book_id, reviewId, userId);
  }
}
