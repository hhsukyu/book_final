import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import { MapController } from './map.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../entity/store.entity';
import { StoreService } from 'src/store/store.service';
import { UserService } from '../user/user.service';
import { User } from 'src/entity/user.entity';
import { MyPage } from 'src/entity/my-page.entity';
import { MyPageService } from 'src/my-page/my-page.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store, User, MyPage])],
  controllers: [MapController],
  providers: [MapService, StoreService, UserService, MyPageService],
})
export class MapModule {}
