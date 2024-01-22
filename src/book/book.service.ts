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

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    private readonly userService: UserService,
  ) {}

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

  //도서 조회
  async getBooks() {
    const books = await this.bookRepository.find({});

    return books;
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

    const book = await this.bookRepository.findOne({
      where: { id: bookid },
    });
    if (!book) {
      throw new NotFoundException('존재하지 않는 도서입니다.');
    }

    await this.bookRepository.update(
      {
        id: bookid,
      },
      { ...updateBookDto },
    );

    return { message: '도서 정보가 수정되었습니다.' };
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
    });

    if (
      !storeBook ||
      user.stores.every((store) => store.id !== storeBook.store.id)
    ) {
      throw new BadRequestException('지점 사장님만 삭제가 가능합니다.');
    }

    await this.bookRepository.delete({ id: bookid });

    return { message: '도서 정보가 삭제되었습니다.' };
  }
}
