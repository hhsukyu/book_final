import { Test, TestingModule } from '@nestjs/testing';
import { StoreReviewController } from '../store-review.controller';
import { StoreReviewService } from '../store-review.service';

describe('StoreReviewController', () => {
  let controller: StoreReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreReviewController],
      providers: [StoreReviewService],
    }).compile();

    controller = module.get<StoreReviewController>(StoreReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
