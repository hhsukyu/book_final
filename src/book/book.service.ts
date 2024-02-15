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
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(StoreBook)
    private storeBookRepository: Repository<StoreBook>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    // private readonly storeBookService: StorebookService,

    private readonly redisService: RedisService,
  ) {}

  //도서조회
  async maingetBooks() {
    const books = await this.bookRepository
      .createQueryBuilder()
      .orderBy('RAND()') // 랜덤하게 정렬
      .take(30) // 상위 20개만 가져오기
      .getMany();

    return books;
  }

  //리뷰순 도서조회
  async getBooksByRank() {
    const books = await this.bookRepository
      .createQueryBuilder()
      .orderBy('reviewCount', 'DESC') //내림차순정렬
      .take(30) // 상위 30개만 가져오기
      .getMany();

    return books;
  }

  //도서 작가별조회
  async getBooksByAuthor(author: string) {
    const book = this.bookRepository.find({
      where: { writer: author },
      select: ['id', 'book_image', 'title', 'writer', 'genre'],
    });

    return book;
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
    await this.redisService.setRank(booktitle);
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

  //인기 검색어 조회
  async getTopTenSearchTerms() {
    const topten = await this.redisService.getRank();
    return topten;
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
  async createBookByCsv(
    file: Express.Multer.File,
    userid: number,
    storeid: number,
  ) {
    try {
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
      const keywordGenre = [
        '액션',
        '무협',
        '코믹',
        '드라마',
        '순정',
        '판타지',
        '미상',
      ];
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
      }

      // book repsoitory에서 모두 찾기
      const existingBook = await this.bookRepository.find();

      // book repository에서 title만 가져오기
      const filterTitle = existingBook.map((book) => book.title);

      // book repository에서 title 중복 데이터 빼고 가져오기
      const uniqueBooks = filterBooksData.filter(
        (book) => !filterTitle.includes(book.title),
      );

      // store book repository에서 모두 찾기
      const filterStoreBook = await this.storeBookRepository.find({
        where: { store_id: storeid },
        relations: { book: true },
      });

      // store book repository에서 title만 가져오기
      const filterStoreBookTitle = filterStoreBook.map(
        (book) => book.book.title,
      );

      // storebook repository에서 title 중복 데이터 빼고 가져오기
      const uniqueStoreBooks = filterBooksData.filter(
        (book) => !filterStoreBookTitle.includes(book.title),
      );

      if (uniqueStoreBooks.length === 0) {
        throw new BadRequestException('이미 등록된 데이터입니다.');
      }

      const userStore = await this.userService.findUserByIdWithStore(userid);
      if (userStore.stores.every((s) => s.id !== storeid)) {
        throw new BadRequestException('본인 보유하신 지점인지 확인해주세요.');
      }

      // storeBooks 데이터로 book 찾기
      for (const uniqueStoreBook of uniqueStoreBooks) {
        const findBooks = await this.bookRepository.find({
          where: {
            title: uniqueStoreBook.title,
            // book_desc: uniqueStoreBook.book_desc,
            writer: uniqueStoreBook.writer,
            // illustrator: uniqueStoreBook.illustrator,
            publisher: uniqueStoreBook.publisher,
            // publication_date: uniqueStoreBook.publication_date,
            // isbn: uniqueStoreBook.isbn,
            // genre: uniqueStoreBook.genre,
            // setisbn: uniqueStoreBook.setisbn,
            // fnshYn: uniqueStoreBook.fnshYn,
            // book_image: uniqueStoreBook.book_image,
          },
        });

        const findBooksIdAndSetisbn = findBooks.map((book) => ({
          id: book.id,
          setisbn: book.setisbn,
        }));

        for (const book of findBooksIdAndSetisbn) {
          const storeBooks = await this.storeBookRepository.save({
            store_id: storeid,
            book_id: book.id,
            setisbn: book.setisbn,
          });
          console.log('storeBooks', storeBooks);
          const notifyUser = await this.notificationService.createNotification(
            book.id,
            storeid,
          );
          console.log('notifyUserCSV한개한개', notifyUser);
        }
      }

      const createBookDtos = uniqueBooks.map((bookData) => ({
        title: bookData.title,
        book_desc: bookData.book_desc,
        writer: bookData.writer,
        illustrator: bookData.illustrator,
        publisher: bookData.publisher,
        publication_date: bookData.publication_date,
        isbn: bookData.isbn,
        genre: bookData.genre,
        setisbn: bookData.setisbn,
        fnshYn: bookData.fnshYn,
        book_image: bookData.book_image,
      }));

      const books = await this.bookRepository.save(createBookDtos);

      const booksIdAndSetisbn = books.map((book) => ({
        id: book.id,
        setisbn: book.setisbn,
      }));

      for (const book of booksIdAndSetisbn) {
        const storeBooks = await this.storeBookRepository.save({
          store_id: storeid,
          book_id: book.id,
          setisbn: book.setisbn,
        });
        console.log('storeBooksCSV한개한개', storeBooks);
        const notifyUser = await this.notificationService.createNotification(
          book.id,
          storeid,
        );
        console.log('notifyUserCSV한개한개', notifyUser);
      }

      return { message: 'OK' };
    } catch (error) {
      console.log(error);
    }
  }
}
