import { Test, TestingModule } from '@nestjs/testing';
import { BookReviewController } from '../bookreview.controller';
import { BookReviewService } from '../bookreview.service';

describe('BookreviewController', () => {
  let controller: BookReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookReviewController],
      providers: [BookReviewService],
    }).compile();

    controller = module.get<BookReviewController>(BookReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
