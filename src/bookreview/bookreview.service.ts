import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBookReviewDto } from './dto/create-bookreview.dto';
import { UpdateBookReviewDto } from './dto/update-bookreview.dto';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { BookReview } from 'src/entity/bookreview.entity';
import { Book } from 'src/entity/book.entity';

@Injectable()
export class BookReviewService {
  constructor(
    @InjectRepository(BookReview)
    private readonly bookReviewRepository: Repository<BookReview>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    book_id: number,
    userId: number,
    createBookReviewDto: CreateBookReviewDto,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const book = await this.bookRepository.findOne({ where: { id: book_id } });

    if (!user || !book) {
      throw new BadRequestException('책이나 사용자를 찾을 수 없습니다.');
    }

    console.log('user', user);
    console.log('book', book);

    const bookReview = await this.bookReviewRepository.save({
      ...createBookReviewDto,
      user: user,
      book: book,
    });
    console.log('bookReview', bookReview);
    return bookReview;
  }

  //해당북 리뷰전체조회
  async findAll(book_id: number) {
    const bookreviews = await this.bookReviewRepository.find({
      relations: ['user', 'book'],
      where: { book: { id: book_id } },
    });
    console.log('bookreviews', bookreviews);
    return bookreviews;
  }

  //리뷰상세조회
  async findOne(book_id: number, reviewId: number) {
    // console.log('book_id', book_id);
    // console.log('reviewId', reviewId);
    const bookreview = await this.bookReviewRepository.findOne({
      relations: ['user', 'book'],
      where: { book: { id: book_id }, id: reviewId },
    });
    // console.log('리뷰있는지 확인------------', bookreview);
    if (!bookreview) throw new NotFoundException('존재하지 않는 리뷰입니다.');
    return bookreview;
  }

  async updateBookReview(
    reviewId: number,
    book_id: number,
    userId: number, //이글을쓴사람만 수정할수있도록, 아니면 오류반환
    updateBookReviewDto: UpdateBookReviewDto,
  ) {
    //해당 리뷰가 있는지 검증
    const bookreview = await this.findOne(book_id, reviewId);
    console.log('업데이트쪽에 리뷰상세조회 넘어오는지확인', bookreview);

    //해당리뷰의 글쓴이 조회
    const reviewWriter = bookreview.user.id;
    console.log(reviewWriter);

    //해당리뷰가 현재 로그인 사용자가 쓴것인지 확인
    if (userId !== reviewWriter)
      throw new UnauthorizedException('당신이 쓴글이 아닙니다!!!!');

    // DTO에서 제공된 필드로 리뷰 업데이트
    Object.assign(bookreview, updateBookReviewDto);

    // 변경사항 저장
    const updatedBookReview = await this.bookReviewRepository.save(bookreview);

    return { message: '북리뷰 정보가 수정되었습니다.', updatedBookReview };
  }

  async deleteBookReview(book_id: number, reviewId: number, userId: number) {
    //해당 리뷰가 있는지 검증
    const bookreview = await this.findOne(book_id, reviewId);
    console.log('업데이트쪽에 리뷰상세조회 넘어오는지확인', bookreview);

    //해당리뷰의 글쓴이 조회
    const reviewWriter = bookreview.user.id;
    console.log(reviewWriter);

    //해당리뷰가 현재 로그인 사용자가 쓴것인지 확인
    if (userId !== reviewWriter)
      throw new UnauthorizedException('당신이 쓴글이 아닙니다!!!!');

    await this.bookReviewRepository.delete({ id: reviewId });

    return { message: '북리뷰 정보가 삭제되었습니다.', bookreview };
  }
}
