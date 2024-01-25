import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookReviewService } from './bookreview.service';
import { CreateBookReviewDto } from './dto/create-bookreview.dto';
import { UpdateBookReviewDto } from './dto/update-bookreview.dto';
import { accessTokenGuard } from '../auth/guard/access-token.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('bookreview')
export class BookReviewController {
  constructor(private readonly bookReviewService: BookReviewService) {}

  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Post('/:bookId')
  create(
    @Param('bookId') bookId: number,
    @Request() req: any,
    @Body() createBookReviewDto: CreateBookReviewDto,
  ) {
    const userId = req.user.userId; //
    return this.bookReviewService.create(bookId, userId, createBookReviewDto);
  }

  @Get('/:bookid')
  findAll(@Param('bookId') bookId: number) {
    return this.bookReviewService.findAll(bookId);
  }

  @Get('/:bookId/reviews/:id')
  findOne(@Param('bookId') bookId: number, @Param('id') id: number) {
    return this.bookReviewService.findOne(bookId, id);
  }
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Put(':id')
  update(
    @Param('bookId') bookId: number,
    @Param('reviewid') id: number,
    @Request() req: any,
    @Body() updateBookReviewDto: UpdateBookReviewDto,
  ) {
    const userId = req.user.userId; // JWT AccessToken에서 userId 가져오기
    return this.bookReviewService.update(
      bookId,
      id,
      userId,
      updateBookReviewDto,
    );
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Delete(':id')
  remove(
    @Param('bookId') bookId: number,
    @Param('id') id: number,
    @Request() req: any,
  ) {
    const userId = req.user.userId; // JWT AccessToken에서 userId 가져오기
    return this.bookReviewService.remove(bookId, id, userId);
  }
}
