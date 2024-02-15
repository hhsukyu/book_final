import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gift } from 'src/entity/gift.entity';
import { User } from 'src/entity/user.entity';
import { GiftController } from './gift.controller';
import { GiftService } from './gift.service';
import { UserService } from 'src/user/user.service';
import { MyPage } from 'src/entity/my-page.entity';
import { MyPageService } from 'src/my-page/my-page.service';

@Module({
  imports: [TypeOrmModule.forFeature([Gift, User, MyPage])],
  controllers: [GiftController],
  providers: [GiftService, UserService, MyPageService],
})
export class GiftModule {}
