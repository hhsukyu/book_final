import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptController } from '../receipt.controller';
import { ReceiptService } from '../receipt.service';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
describe('ReceiptController', () => {
  let controller: ReceiptController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceiptController],
      providers: [
        ReceiptService,
        UserService,
        ConfigService,
        {
          provide: 'ReceiptRepository',
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
    controller = module.get<ReceiptController>(ReceiptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
