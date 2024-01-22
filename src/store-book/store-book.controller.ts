import { Body, Controller, Get } from '@nestjs/common';
import { StorebookService } from './store-book.service';
import { CreateStoreBookDto } from './dto/create-storebook.dto';

@Controller('storebook')
export class StorebookController {
  constructor(private readonly storebookService: StorebookService) {}

  @Post('')
  async createStoreBook(@Body() createStoreBookDto: CreateStoreBookDto) {
    return await this.storebookService.createStoreBook(createStoreBookDto);
  }

  @Get('')
  async getBooksInStore() {
    return await this.storebookService.getBooksInStore();
  }
}
