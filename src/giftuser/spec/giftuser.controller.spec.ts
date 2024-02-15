import { Test, TestingModule } from '@nestjs/testing';
import { GiftuserController } from '../giftuser.controller';

describe('GiftuserController', () => {
  let controller: GiftuserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiftuserController],
    }).compile();

    controller = module.get<GiftuserController>(GiftuserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
