import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookService } from 'src/book/book.service';
import { StoreBook } from 'src/entity/store-book.entity';
import { StoreService } from 'src/store/store.service';
import { Repository } from 'typeorm';
import { CreateStoreBookDto } from './dto/create-storebook.dto';
import { Store } from 'src/entity/store.entity';
import { Book } from 'src/entity/book.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StorebookService {
  constructor(
    @InjectRepository(StoreBook)
    private storeBookRepository: Repository<StoreBook>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,

    private readonly bookService: BookService,
    private readonly storeService: StoreService,
    private readonly userService: UserService,
  ) {}
  async createStoreBook(
    storeid: number,
    bookid: number,
    createStoreBookDto: CreateStoreBookDto,
  ) {
    const book = await this.bookRepository.findOne({
      where: { id: bookid },
    });
    const store = await this.storeRepository.findOne({
      where: { id: storeid },
    });

    if (!book || !store) {
      throw new BadRequestException('도서 또는 지점을 찾을 수 없습니다.');
    }

    // const storebook = await this.storeBookRepository.findOne({
    //   book,
    //   store,
    //   createStoreBookDto,
    // });

    const storebook = await this.storeBookRepository.save({
      book_id: bookid,
      store_id: storeid,
      ...createStoreBookDto,
    });
    console.log('storebook', storebook);
    return storebook;
  }

  //   const { book_id, store_id, rent, setisbn } = createStoreBookDto;

  //   const book = await this.bookService.getBookById(book_id);
  //   if (!book) {
  //     throw new NotFoundException('존재하지 않는 도서입니다.');
  //   }

  //   const store = await this.storeService.findMystoreByid(store_id);
  //   if (!store) {
  //     throw new NotFoundException('존재하지 않는 지점입니다.');
  //   }

  //   const storeBook = await this.storeBookRepository.create({
  //     book_id,
  //     store_id,
  //     rent,
  //     setisbn,
  //   });

  //   return await this.storeBookRepository.save(storeBook);
  // }

  async getBooksInStore() {
    const booksInStore = await this.storeBookRepository.find({});

    return booksInStore;
  }

  // 도서 삭제
  async deleteBook(bookid: number, userid: number) {
    const user = await this.userService.findUserById(userid);
    const book = await this.bookRepository.findOne({
      where: { id: bookid },
    });

    if (!book) {
      throw new NotFoundException('존재하지 않는 도서입니다.');
    }

    const storeBook = await this.storeBookRepository.findOne({
      where: { book: { id: bookid } },
      relations: { store: true },
    });
    console.log('storeBook', storeBook);
    if (
      !storeBook ||
      user.stores.every((store) => store.id !== storeBook.store.id)
    ) {
      throw new BadRequestException('지점 사장님만 삭제가 가능합니다.');
    }

    await this.storeBookRepository.delete({ id: bookid });

    return { message: '도서 정보가 삭제되었습니다.' };
  }
}
