import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Store } from '../entity/store.entity';
import { UserService } from '../user/user.service';
import { StoreBook } from 'src/entity/store-book.entity';
import { Menu } from 'src/entity/menu.entity';
import { MyPage } from 'src/entity/my-page.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Store, StoreBook, Menu, MyPage])],
  providers: [StoreService, UserService],
  controllers: [StoreController],
})
export class StoreModule {}
