import { Test, TestingModule } from '@nestjs/testing';
import { ApplyOwnerController } from '../apply-owner.controller';

describe('ApplyOwnerController', () => {
  let controller: ApplyOwnerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplyOwnerController],
    }).compile();

    controller = module.get<ApplyOwnerController>(ApplyOwnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
