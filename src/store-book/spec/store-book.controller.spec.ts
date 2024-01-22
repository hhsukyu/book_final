import { Test, TestingModule } from '@nestjs/testing';
import { StorebookController } from '../store-book.controller';

describe('StorebookController', () => {
  let controller: StorebookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorebookController],
    }).compile();

    controller = module.get<StorebookController>(StorebookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
