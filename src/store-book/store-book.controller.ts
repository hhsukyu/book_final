import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { StorebookService } from './store-book.service';
import { CreateStoreBookDto } from './dto/create-storebook.dto';
import { UserId } from 'src/auth/decorators/userId.decorator';
import { UpdateStoreBookDto } from './dto/update-storebook.dto';

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

  @Get('/:storebookid')
  async getStoreBookById(@Param('storebookid') storebookid: number) {
    return await this.storebookService.getStoreBookById(storebookid);
  }
  //해당지점의 도서 전체조회
  @Get('/:storeid')
  getStoreBooks(@Param('storeid') storeid: number) {
    return this.storebookService.getStoreBooks(storeid);
  }

  // @Get('/:storeid/storebooksearch')
  // async searchStorebooks(
  //   @Query('title') title: string,
  //   @Param('storeid') storeid: number,
  // ) {
  //   return await this.storebookService.searchStorebooks(title, storeid);
  // }

  @Put('/:storeid/:bookid')
  async updateStoreBook(
    @Param('bookid') bookid: number,
    @Param('storeid') storeid: number,
    @UserId() userid: number,
    @Body() updateStoreBookDto: UpdateStoreBookDto,
  ) {
    return await this.storebookService.updateStoreBook(
      bookid,
      userid,
      storeid,
      updateStoreBookDto,
    );
  }

  @Delete('/:storeid/:storebookid')
  async deleteStoreBook(
    @Param('storeid') storeid: number,
    @Param('bookid') bookid: number,
    @UserId() userid: number,
  ) {
    return await this.storebookService.deleteStoreBook(bookid, userid, storeid);
  }
}
