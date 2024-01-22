import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';

@Injectable()
export class ApiService {
  constructor(
    // @InjectRepository(Book)
    // private bookRepository: Repository<Book>
    private readonly configService: ConfigService,
  ) {}

  async bookupdate() {
    const key = await this.configService.get('book_api');

    let pageNo = 1;
    const pageSize = 100;

    while (true) {
      const response = await axios.get(
        `https://www.kmas.or.kr/openapi/search/rgDtaMasterList`,
        {
          params: {
            prvKey: key,
            listSeCd: '2',
            pageNo: pageNo,
            viewItemCnt: pageSize,
          },
        },
      );

      const books = response.data.itemList;
      if (books.length === 0) {
        // 더 이상 처리할 데이터가 없으므로 반복문을 종료합니다.
        break;
      }

      for (const book of books) {
        console.log(book.title);
        // 데이터베이스를 조회하여 동일한 책 정보가 이미 저장되어 있는지 확인합니다.
        const existingBook = await this.bookRepository.findOne(book.bookId);
        // 동일한 책 정보가 이미 저장되어 있다면, 이번 책 정보를 저장하지 않고 다음 책 정보로 넘어갑니다.
        if (existingBook) {
          continue;
        }
        // 데이터베이스에 책 정보를 저장합니다.
        // await this.bookRepository.save(book);
      }

      // 다음 페이지를 처리하기 위해 페이지 번호를 증가시킵니다.
      pageNo++;
    }
  }
}
