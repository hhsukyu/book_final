// book.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { BookService } from './book.service';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getBooks(
    @Query('pageNo') pageNo: string,
    @Query('viewItemCnt') viewItemCnt: string,
  ) {
    const books = await this.bookService.findBooks(pageNo, viewItemCnt);
    return { books };
  }
}
