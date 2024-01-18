import { Test, TestingModule } from '@nestjs/testing';
import { AdminReviewController } from '../adminReview.controller';
import { AdminReviewService } from '../adminReview.service';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
describe('AdminReviewController', () => {
  let controller: AdminReviewController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminReviewController],
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
    controller = module.get<AdminReviewController>(AdminReviewController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
