// book.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';

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

  @Get('genre')
  async generelist(@Query('bookgenre') bookgenre: string) {
    return await this.bookService.genrebook(bookgenre);
  }

  //wishlist 도서 검색
  @Get('wishlist')
  async wishlist(@Query('booktitle') booktitle: string) {
    return await this.bookService.wishlistbook(booktitle);
  }

  //도서 검색
  @Get('search')
  async searchBook(@Query('booktitle') booktitle: string) {
    return await this.bookService.searchbook(booktitle);
  }

  //지점도서 검색
  @Get('searchStoreBook')
  async searchStoreBook(
    @Query('storeId') storeid: number,
    @Query('bookTitle') booktitle: string,
  ) {
    try {
      const searchResult = await this.bookService.searchStoreBook(
        storeid,
        booktitle,
      );
      return { success: true, data: searchResult };
    } catch (error) {
      return { success: false, message: error.message };
    }
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

  //위시리스트 추가 도서이름 확인
  @Get('/wishlist/:bookid')
  async getbooktitlebyid(@Param('bookid') bookid: number) {
    return await this.bookService.getBooktitleById(bookid);
  }

  //도서 상세조회
  // @ApiBearerAuth('accessToken')
  // @UseGuards(accessTokenGuard)
  @Get('/:bookid')
  async getBookById(@Param('bookid') id: number) {
    return await this.bookService.getBookById(id);
  }
  // //도서 수정
  // @ApiBearerAuth('accessToken')
  // @UseGuards(accessTokenGuard)
  // @Put('/:bookid')
  // async updateBook(
  //   @Body() updateBookDto: UpdateBookDto,
  //   @Param('bookid') bookid: number,
  //   @UserId() userid: number,
  // ) {
  //   return await this.bookService.updateBook(bookid, updateBookDto, userid);
  // }
}
