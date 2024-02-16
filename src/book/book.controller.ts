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

import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { accessTokenGuard } from 'src/auth/guard/access-token.guard';
import { UserId } from 'src/auth/decorators/userId.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('책')
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

  //리뷰 순위에 따른 도서 30개 조회
  @Get('rank')
  async getBooksByRank() {
    return await this.bookService.getBooksByRank();
  }

  //인기 검색어 조회
  @Get('getTopTenSearchTerms')
  async getTopTenSearchTerms() {
    return await this.bookService.getTopTenSearchTerms();
  }

  //도서 작가별 조회
  @Get('author')
  async getBooksByAuthor(@Query('author') author: string) {
    return await this.bookService.getBooksByAuthor(author);
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

  // 보유도서 생성 CSV
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
  @Post('/file/:storeid')
  @UseInterceptors(FileInterceptor('file'))
  async createBookByCsv(
    @UploadedFile() file: Express.Multer.File,
    @UserId() userid: number,
    @Param('storeid') storeid: number,
  ) {
    return await this.bookService.createBookByCsv(file, userid, storeid);
  }
}
