import { Module } from '@nestjs/common';
import { MyPageService } from './my-page.service';
import { MyPageController } from './my-page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyPage } from '../entity/my-page.entity';
import { User } from '../entity/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([MyPage, User])],
  exports: [MyPageService],
  providers: [MyPageService, UserService],
  controllers: [MyPageController],
})
export class MyPageModule {}
