// book.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { accessTokenGuard } from 'src/auth/guard/access-token.guard';

@ApiBearerAuth('accessToken')
@UseGuards(accessTokenGuard)
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  //도서 생성
  @Post('')
  async createBook(@Body() createBookDto: CreateBookDto) {
    return await this.bookService.createBook(createBookDto);
  }
  //도서 조회
  @Get('')
  async getBooks() {
    return await this.bookService.getBooks();
  }

  // //도서 상세조회
  // @Get('/:bookid')
  // async getBookById(@Param('bookid') id: number) {
  //   return await this.bookService.getBookById(id);
  // }
  // //도서 수정
  // @Put('/:bookid')
  // async updateBook(
  //   @Param('bookid') bookid: number,
  //   @Body() updateBookDto: UpdateBookDto,
  // ) {
  //   return await this.bookService.updateBook(bookid, updateBookDto);
  // }
  // //도서 삭제
  // @Put('/:bookid')
  // async deleteBook(@Param('bookid') bookid: number) {
  //   return await this.bookService.deleteBook(bookid);
  // }
}
