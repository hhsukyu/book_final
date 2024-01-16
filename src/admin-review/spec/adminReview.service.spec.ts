import { Test, TestingModule } from '@nestjs/testing';
import { AdminReviewService } from '../adminReview.service';

describe('AdminReviewService', () => {
  let service: AdminReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminReviewService],
    }).compile();

    service = module.get<AdminReviewService>(AdminReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
