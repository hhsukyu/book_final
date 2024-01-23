// book.controller.ts
import {
  Body,
  Controller,
  Delete,
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
import { UserId } from 'src/auth/decorators/userId.decorator';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  //도서 생성
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Post('')
  async createBook(
    @Body() createBookDto: CreateBookDto,
    @UserId() userid: number,
  ) {
    return await this.bookService.createBook(createBookDto, userid);
  }


  //도서 조회
  @Get('main')
  async maingetBooks() {
    return await this.bookService.maingetBooks();
  }


  //도서 조회
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Get('')
  async getBooks() {
    return await this.bookService.getBooks();
  }

  //도서 상세조회
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Get('/:bookid')
  async getBookById(@Param('bookid') id: number) {
    return await this.bookService.getBookById(id);
  }
  //도서 수정
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Put('/:bookid')
  async updateBook(
    @Body() updateBookDto: UpdateBookDto,
    @Param('bookid') bookid: number,
    @UserId() userid: number,
  ) {
    return await this.bookService.updateBook(bookid, updateBookDto, userid);
  }
}
