import { Module } from '@nestjs/common';
import { MyPageService } from './my-page.service';
import { MyPageController } from './my-page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyPage } from '../entity/my-page.entity';
import { User } from '../entity/user.entity';
import { Book } from 'src/entity/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MyPage, User])],
  providers: [MyPageService, MyPage],
  controllers: [MyPageController],
})
export class MyPageModule {}
