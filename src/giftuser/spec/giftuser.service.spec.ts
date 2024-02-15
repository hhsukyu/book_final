import { Test, TestingModule } from '@nestjs/testing';
import { GiftuserService } from '../giftuser.service';

describe('GiftuserService', () => {
  let service: GiftuserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GiftuserService],
    }).compile();

    service = module.get<GiftuserService>(GiftuserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
