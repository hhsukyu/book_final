// book.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/entity/book.entity';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async getBookByIsbn(isbn: number) {}

  async createBook(createBookDto: CreateBookDto) {
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

  // async getBookById(id: number) {
  //   const book = await this.bookRepository.findOne({
  //     where: { id: id },
  //   });

  //   return book;
  // }

  // async updateBook(bookid: number, updateBookDto: UpdateBookDto) {
  //   const book = await this.bookRepository.findOne({
  //     where: { id: bookid },
  //   });
  //   if (!book) {
  //     throw new NotFoundException('존재하지 않는 도서입니다.');
  //   }

  //   await this.bookRepository.update(
  //     {
  //       id: bookid,
  //     },
  //     { ...updateBookDto },
  //   );

  //   return { message: '도서 정보가 수정되었습니다.' };
  // }

  // async deleteBook(bookid: number) {
  //   await this.bookRepository.delete({ id: bookid });

  //   return { message: '도서 정보가 삭제되었습니다.' };
  // }
}
