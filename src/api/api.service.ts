import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Book } from '../entity/book.entity';
import { Repository } from 'typeorm';
import { Page } from '../entity/bookUpdate.entity';

@Injectable()
export class ApiService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,

    private readonly configService: ConfigService,
  ) {}

  async bookupdate() {
    const key = await this.configService.get('book_api');

    // 페이지 번호를 불러옵니다.
    let page = await this.pageRepository.findOne({ where: { id: 1 } });
    if (!page) {
      // 페이지 정보가 데이터베이스에 없으면 새로 만듭니다.
      page = this.pageRepository.create();
      await this.pageRepository.save(page);
    }

    let pageNo = page.pageNo;

    while (true) {
      const response = await axios.get(
        `https://www.kmas.or.kr/openapi/search/rgDtaMasterList`,
        {
          params: {
            prvKey: key,
            listSeCd: '2',
            pageNo: pageNo,
            viewItemCnt: 100,
          },
        },
      );

      const books = await response.data.itemList;

      if (books.length === 0) {
        break;
      }
      console.log(books.length);
      console.log('---------------------------------------');

      for (const book of books) {
        console.log(book.title);
        const existingBook = await this.bookRepository.findOne({
          where: { title: book.title },
        });

        if (existingBook === null) {
          const newBook = {
            title: book.title || '제목 없음',
            illustrator: book.pictrWritrNm || '미상',
            writer: book.sntncWritrNm || '미상',
            publisher: book.plscmpnIdNm || '미상',
            publication_date: book.pblicteDe || '0000-00-00',
            book_desc: book.outline || '설명 없음',
            genre: book.mainGenreCdNm || '미상',
            isbn: book.isbn || '000-0-00-000000-0',
            setisbn: book.setIsbn || '000-0-00-000000-0',
            fnshYn: book.fnshYn || 'N',
            book_image: book.imageDownloadUrl || '이미지 없음',
          };

          await this.bookRepository.save(newBook);
          console.log('데이터 저장 성공');
        } else {
          console.log('존재');
        }
      }

      pageNo = pageNo + 100;

      // 페이지 번호를 업데이트합니다.
      page.pageNo = pageNo;
      await this.pageRepository.save(page);
    }
  }
}
