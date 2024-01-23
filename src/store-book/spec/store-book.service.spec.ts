import { Test, TestingModule } from '@nestjs/testing';
import { StorebookService } from '../store-book.service';

describe('StorebookService', () => {
  let service: StorebookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorebookService],
    }).compile();

    service = module.get<StorebookService>(StorebookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
