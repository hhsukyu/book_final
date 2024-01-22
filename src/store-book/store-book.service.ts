import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookService } from 'src/book/book.service';
import { StoreBook } from 'src/entity/store-book.entity';
import { StoreService } from 'src/store/store.service';
import { Repository } from 'typeorm';
import { CreateStoreBookDto } from './dto/create-storebook.dto';

@Injectable()
export class StorebookService {
  constructor(
    @InjectRepository(StoreBook)
    private storeBookRepository: Repository<StoreBook>,
    private readonly bookService: BookService,
    private readonly storeService: StoreService,
  ) {}
  async createStoreBook(createStoreBookDto: CreateStoreBookDto) {
    const { book_id, store_id, rent, setisbn } = createStoreBookDto;

    const book = await this.bookService.getBookById(book_id);
    if (!book) {
      throw new NotFoundException('존재하지 않는 도서입니다.');
    }

    const store = await this.storeService.findMystoreByid(store_id);
    if (!store) {
      throw new NotFoundException('존재하지 않는 지점입니다.');
    }

    const storeBook = await this.storeBookRepository.create({
      book_id,
      store_id,
      rent,
      setisbn,
    });

    return await this.storeBookRepository.save(storeBook);
  }

  async getBooksInStore() {
    const booksInStore = await this.storeBookRepository.find({});

    return booksInStore;
  }
}
