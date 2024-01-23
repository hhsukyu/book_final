// book.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/entity/book.entity';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async getBookByIsbn(isbn: number) {}

  async createBook(createBookDto: CreateBookDto) {
    // const existingBook = await this.bookRepository.findOne({})
    const book = await this.bookRepository.save(createBookDto);
    return book;
  }

  async maingetBooks() {
    const books = await this.bookRepository
      .createQueryBuilder()
      .orderBy('RAND()') // 랜덤하게 정렬
      .take(20) // 상위 20개만 가져오기
      .getMany();

    return books;
  }

  async getBooks() {
    const books = await this.bookRepository.find({});

    return books;
  }

  async getBookById(bookid: number) {
    const book = await this.bookRepository.findOne({ where: { id: bookid } });

    return book;
  }

  // async updateBook(bookid: number) {
  //   await this.bookRepository.update({updat})
  // }
}
