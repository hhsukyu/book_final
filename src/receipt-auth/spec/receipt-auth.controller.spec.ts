import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptAuthController } from '../receipt-auth.controller';

describe('ReceiptAuthController', () => {
  let controller: ReceiptAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceiptAuthController],
    }).compile();

    controller = module.get<ReceiptAuthController>(ReceiptAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
