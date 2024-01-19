import { Test, TestingModule } from '@nestjs/testing';
import { StoreReviewController } from '../store-review.controller';
import { StoreReviewService } from '../store-review.service';
import { UserService } from '../../user/user.service';

describe('StoreReviewController', () => {
  let controller: StoreReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreReviewController],
      providers: [
        StoreReviewService,
        UserService,
        { provide: 'StoreReviewRepository', useValue: {} },
        { provide: 'UserRepository', useValue: {} },
      ],
    }).compile();

    controller = module.get<StoreReviewController>(StoreReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
