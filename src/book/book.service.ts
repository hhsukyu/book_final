// book.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/entity/book.entity';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { UserService } from 'src/user/user.service';
import { RedisService } from '../configs/redis/redis.service';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    // @InjectRepository(StoreBook)
    // private storeBookRepository: Repository<StoreBook>,
    private readonly userService: UserService,
    // private readonly storeBookService: StorebookService,

    private readonly redisService: RedisService,
  ) {}

  async maingetBooks() {
    const books = await this.bookRepository
      .createQueryBuilder()
      .orderBy('RAND()') // 랜덤하게 정렬
      .take(30) // 상위 20개만 가져오기
      .getMany();

    return books;
  }

  //도서 생성
  async createBook(createBookDto: CreateBookDto, userid: number) {
    const user = await this.userService.findUserById(userid);

    if (user.role === 0) {
      throw new BadRequestException('지점 사장만 도서 생성이 가능합니다.');
    }

    const existingBook = await this.bookRepository.findOne({
      where: { isbn: createBookDto.isbn },
    });
    if (existingBook) {
      throw new ConflictException('이미 존재하는 도서입니다.');
    }
    const book = await this.bookRepository.save(createBookDto);
    return book;
  }

  async getBooks() {
    const books = await this.bookRepository.find({});

    return books;
  }

  async wishlistbook(booktitle: string) {
    console.log(booktitle);
    const book = this.bookRepository.find({ select: ['id', 'title'] });

    const result = (await book).filter((book) =>
      book.title.includes(booktitle),
    );
    return result;
  }

  async searchbook(booktitle: string) {
    const cachedResult = await this.redisService.getBookInfo(booktitle);

    if (cachedResult || cachedResult !== null) {
      console.log(cachedResult);
      return cachedResult;
    }

    const book = this.bookRepository.find({
      select: ['id', 'title', 'book_image'],
    });

    const searchResult = (await book).filter((book) =>
      book.title.includes(booktitle),
    );

    console.log('데이터에서 불러오기');
    console.log(searchResult);

    await this.redisService.setBookInfo(
      booktitle,
      JSON.stringify(searchResult),
    );

    return searchResult;
  }

  //도서 상세조회
  async getBookById(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id: id },
    });

    return book;
  }

  //도서 수정
  async updateBook(
    bookid: number,
    updateBookDto: UpdateBookDto,
    userid: number,
  ) {
    const user = await this.userService.findUserById(userid);
    // const storebook = await this.storeBookService;
    const book = await this.bookRepository.findOne({
      where: { id: bookid },
    });
    if (!book) {
      throw new NotFoundException('존재하지 않는 도서입니다.');
    }

    // if (user.stores.every((s) => s.id !== store.id)) {
    //   throw new BadRequestException('지점 사장님만 수정이 가능합니다.');
    // }
    await this.bookRepository.update(
      {
        id: bookid,
      },
      { ...updateBookDto },
    );

    //   return { message: '도서 정보가 수정되었습니다.' };
    // }
  }
}
