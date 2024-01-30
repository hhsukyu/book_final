// book.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';

import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { accessTokenGuard } from 'src/auth/guard/access-token.guard';
import { UserId } from 'src/auth/decorators/userId.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

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

  // 도서 생성 CSV
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload menu with image.',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The image file to upload..',
        },
      },
    },
  })
  @Post('/file')
  @UseInterceptors(FileInterceptor('file'))
  async createBookByCsv(
    @UploadedFile() file: Express.Multer.File,
    @UserId() userid: number,
  ) {
    return await this.bookService.createBookByCsv(file, userid);
  }
}
