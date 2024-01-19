import { Test, TestingModule } from '@nestjs/testing';
import { MyPageController } from '../my-page.controller';
import { MyPageService } from '../my-page.service';

describe('MyPageController', () => {
  let controller: MyPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyPageController],
      providers: [MyPageService],
    }).compile();

    controller = module.get<MyPageController>(MyPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
