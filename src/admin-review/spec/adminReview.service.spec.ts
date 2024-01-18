import { Test, TestingModule } from '@nestjs/testing';
import { AdminReviewService } from '../adminReview.service';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
describe('AdminReviewService', () => {
  let service: AdminReviewService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminReviewService,
        UserService,
        ConfigService,
        {
          provide: 'AdminReviewRepository',
          useValue: {},
        },
        {
          provide: 'StoreRepository',
          useValue: {},
        },
        {
          provide: 'StoreReviewRepository',
          useValue: {},
        },
        {
          provide: 'UserRepository',
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<AdminReviewService>(AdminReviewService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
