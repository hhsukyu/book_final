import { Test, TestingModule } from '@nestjs/testing';
import { StoreReviewService } from '../store-review.service';
import { UserService } from '../../user/user.service';

describe('StoreReviewService', () => {
  let service: StoreReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreReviewService],
      providers: [
        StoreReviewService,
        UserService,
        { provide: 'StoreReviewRepository', useValue: {} },
        { provide: 'UserRepository', useValue: {} },
      ],
    }).compile();

    service = module.get<StoreReviewService>(StoreReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
