import { Test, TestingModule } from '@nestjs/testing';
import { BookReviewService } from '../bookreview.service';

describe('BookreviewService', () => {
  let service: BookReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookReviewService],
    }).compile();

    service = module.get<BookReviewService>(BookReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
