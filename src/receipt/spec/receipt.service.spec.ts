import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptService } from '../receipt.service';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
describe('ReceiptService', () => {
  let service: ReceiptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    service = module.get<ReceiptService>(ReceiptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
