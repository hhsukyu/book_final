import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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

  @Put('/:bookid')
  async updateStoreBook(
    @Param('bookid') bookid: number,
    @UserId() userid: number,
    @Body() updateStoreBookDto: UpdateStoreBookDto,
  ) {
    return await this.storebookService.updateStoreBook(
      bookid,
      userid,
      updateStoreBookDto,
    );
  }

  @Delete('/:storebookid')
  async deleteStoreBook(
    @Param('bookid') bookid: number,
    @UserId() userid: number,
  ) {
    return await this.storebookService.deleteStoreBook(bookid, userid);
  }
}
