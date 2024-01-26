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

@Injectable()
export class BookReviewService {
  constructor(
    @InjectRepository(BookReview)
    private readonly bookReviewRepository: Repository<BookReview>,
    @InjectRepository(User)
    private readonly userService: UserService,
  ) {}

  async create(
    book_id: number,
    userId: number,
    createBookReviewDto: CreateBookReviewDto,
  ) {
    const bookReview = await this.bookReviewRepository.save({
      ...createBookReviewDto,
      userId: userId,
      book_id,
    });
    return bookReview;
  }

  //해당북 리뷰전체조회
  async findAll(book_id: number) {
    const bookreviews = await this.bookReviewRepository.find({
      where: { book_id },
    });

    return bookreviews;
  }

  //리뷰상세조회
  async findOne(book_id: number, id: number) {
    const bookreview = await this.bookReviewRepository.findOne({
      where: { book_id, id },
    });
    return bookreview;
  }

  async updateBookReview(
    id: number,
    book_id: number,
    userId: number, //이글을쓴사람만 수정할수있도록, 아니면 오류반환
    updateBookReviewDto: UpdateBookReviewDto,
  ) {
    const bookreviews = await this.findreviewbyId(id);
    if (!bookreviews) {
      throw new BadRequestException('리뷰가 없습니다');
    }

    if (bookreviews.user_id !== userId) {
      throw new BadRequestException('작성자만 수정 가능합니다.');
    }

    const updatedReview = await this.bookReviewRepository.update(
      {
        book_id,
      },
      {
        ...updateBookReviewDto,
      },
    );
    return { updatedReview, message: '북리뷰 정보가 수정되었습니다.' };
  }

  async deleteBookReview(book_id: number, id: number, userId: number) {
    const review = await this.bookReviewRepository.findOne({
      where: { id },
    });

    if (!review) {
      throw new BadRequestException('리뷰가 없습니다');
    }

    if (review.user_id !== userId) {
      throw new BadRequestException('작성자만 삭제 가능합니다.');
    }

    const result = await this.bookReviewRepository.delete({ id });
    return result;
  }

  async findreviewbyId(id: number) {
    return await this.bookReviewRepository.findOne({
      where: { id },
    });
  }
}
