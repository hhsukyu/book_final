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
import { parse } from 'papaparse';
import { StoreBook } from 'src/entity/storeBook.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(StoreBook)
    private storeBookRepository: Repository<StoreBook>,
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

  //도서 장르별
  async genrebook(bookgenre: string) {
    console.log(bookgenre);
    const book = this.bookRepository.find({
      where: { genre: bookgenre },
      select: ['id', 'book_image', 'title', 'genre'],
    });

    return book;
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
  //도서 검색하기
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

  //지점도서 검색
  async searchStoreBook(storeid: number, booktitle: string): Promise<Book[]> {
    const storeBooks = await this.storeBookRepository
      .createQueryBuilder('storeBook')
      .innerJoinAndSelect('storeBook.book', 'book')
      .where('storeBook.store.id = :storeid', { storeid })
      .andWhere('book.title LIKE :booktitle', { booktitle: `%${booktitle}%` })
      .getMany();

    return storeBooks.map((storeBook) => storeBook.book);
  }

  //도서 상세조회
  async getBookById(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id: id },
    });

    return book;
  }

  //도서 상세조회
  async getBooktitleById(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id: id },
      select: ['title', 'id'],
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

  // 도서 생성 CSV
  async createBookByCsv(file: Express.Multer.File, userid: number) {
    const user = await this.userService.findUserById(userid);
    if (user.role === 0) {
      throw new BadRequestException('지점 사장만 도서 생성이 가능합니다.');
    }

    if (!file.originalname.endsWith('.csv')) {
      throw new BadRequestException('CSV 파일만 업로드 가능합니다.');
    }
    const csvContent = file.buffer.toString();

    let parseResult;
    try {
      parseResult = parse(csvContent, {
        header: true,
        skipEmptyLines: true,
      });
    } catch (error) {
      throw new BadRequestException('CSV 파싱에 실패했습니다.');
    }

    const booksData = parseResult.data as any[];
    const keywordGenre = ['액션', '무협', '코믹', '드라마', '순정', '판타지'];
    const keywordFnshYn = ['Y', 'N'];

    // 조건에 일치하는 값만 가져오기
    const filterBooksData = booksData.filter(
      (bookData) =>
        keywordGenre.includes(bookData.genre) &&
        keywordFnshYn.includes(bookData.fnshYn),
    );

    //csv 파일 내에서 title 중복 확인
    let isDuplicateTitle = false;
    filterBooksData.forEach((bookData, index) => {
      filterBooksData.slice(index + 1).forEach((otherBookData) => {
        if (otherBookData.title === bookData.title) {
          return (isDuplicateTitle = true);
        }
      });
    });

    for (const bookData of filterBooksData) {
      if (
        isDuplicateTitle ||
        !bookData.title ||
        !bookData.book_desc ||
        !bookData.writer ||
        !bookData.illustrator ||
        !bookData.publisher ||
        !bookData.publication_date ||
        !bookData.genre ||
        !bookData.fnshYn ||
        !bookData.book_image
      ) {
        throw new BadRequestException(
          'CSV 파일에 입력되지 않은 컬럼이 있거나 중복된 title이 존재합니다.',
        );
      }

      // 책 제목 중복확인
      const existingBook = await this.bookRepository.findOne({
        where: { title: bookData.tile },
      });
      if (existingBook) {
        throw new ConflictException('이미 존재하는 도서입니다.');
      }
    }

    const createBookDtos = filterBooksData.map((bookData) => ({
      title: bookData.title,
      book_desc: bookData.book_desc,
      writer: bookData.writer,
      illustrator: bookData.illustrator,
      publisher: bookData.publisher,
      publication_date: bookData.publication_date,
      genre: bookData.genre,
      fnshYn: bookData.fnshYn,
      book_image: bookData.book_image,
    }));

    await this.bookRepository.save(createBookDtos);
  }
}
