// book.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/entity/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async findBooks(pageNo: string, viewItemCnt: string) {
    // 목록 구분코드를 2번(도서)로 고정
    const listSeCd = '2';

    // 도서 조회 로직 구현
    const books = await this.bookRepository.find({
      take: +viewItemCnt,
      skip: +pageNo * +viewItemCnt,
      where: {
        listSeCd: listSeCd,
        // 다른 필요한 조건 추가 가능
      },
    });

    return books;
  }
}
