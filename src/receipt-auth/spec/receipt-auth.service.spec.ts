import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptAuthService } from '../receipt-auth.service';

describe('ReceiptAuthService', () => {
  let service: ReceiptAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiptAuthService],
    }).compile();

    service = module.get<ReceiptAuthService>(ReceiptAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
