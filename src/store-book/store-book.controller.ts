import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { StorebookService } from './store-book.service';
import { CreateStoreBookDto } from './dto/create-storebook.dto';
import { UserId } from 'src/auth/decorators/userId.decorator';

@Controller('storebook')
export class StorebookController {
  constructor(private readonly storebookService: StorebookService) {}

  @Post('/:storeid/:bookid')
  async createStoreBook(
    @Param('storeid') storeid: number,
    @Param('bookid') bookid: number,
    @Body() createStoreBookDto: CreateStoreBookDto,
  ) {
    console.log('storeid', storeid, 'bookid', bookid);
    return await this.storebookService.createStoreBook(
      storeid,
      bookid,
      createStoreBookDto,
    );
  }

  @Get('')
  async getBooksInStore() {
    return await this.storebookService.getBooksInStore();
  }

  @Delete('/:bookid')
  async deleteBook(@Param('bookid') bookid: number, @UserId() userid: number) {
    return await this.storebookService.deleteBook(bookid, userid);
  }
}
