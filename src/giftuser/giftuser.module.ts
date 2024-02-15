import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { userGift } from 'src/entity/usergift.entity';
import { GiftuserController } from './giftuser.controller';
import { GiftuserService } from './giftuser.service';
import { UserService } from 'src/user/user.service';
import { MyPageService } from 'src/my-page/my-page.service';
import { MyPage } from 'src/entity/my-page.entity';

@Module({
  imports: [TypeOrmModule.forFeature([userGift, User, MyPage])],
  controllers: [GiftuserController],
  providers: [GiftuserService, UserService, MyPageService],
})
export class GiftuserModule {}
