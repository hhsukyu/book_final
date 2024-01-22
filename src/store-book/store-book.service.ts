import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreBook } from 'src/entity/store-book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StorebookService {
  constructor(
    @InjectRepository(StoreBook)
    private storebookRepository: Repository<StoreBook>,
  ) {}

  async getBooksInStore() {
    const booksInStore = await this.storebookRepository.find({});

    return booksInStore;
  }
}
