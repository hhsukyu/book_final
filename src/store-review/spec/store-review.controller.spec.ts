import { Test, TestingModule } from '@nestjs/testing';
import { StoreReviewController } from '../store-review.controller';
import { StoreReviewService } from '../store-review.service';
import { UserService } from '../../user/user.service';
import { StoreService } from '../../store/store.service';
import { ConfigService } from '@nestjs/config';

describe('StoreReviewController', () => {
  let controller: StoreReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreReviewController],
      providers: [
        StoreReviewService,
        UserService,
        StoreService,
        ConfigService,
        { provide: 'StoreReviewRepository', useValue: {} },
        { provide: 'UserRepository', useValue: {} },
        { provide: 'StoreRepository', useValue: {} },
      ],
    }).compile();

    controller = module.get<StoreReviewController>(StoreReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
