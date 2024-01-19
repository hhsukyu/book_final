import { Test, TestingModule } from '@nestjs/testing';
import { StoreReviewService } from '../store-review.service';
import { UserService } from '../../user/user.service';
import { StoreService } from '../../store/store.service';

describe('StoreReviewService', () => {
  let service: StoreReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreReviewService],
      providers: [
        StoreReviewService,
        UserService,
        StoreService,
        { provide: 'StoreReviewRepository', useValue: {} },
        { provide: 'UserRepository', useValue: {} },
        { provide: 'StoreRepository', useValue: {} },
      ],
    }).compile();

    service = module.get<StoreReviewService>(StoreReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
