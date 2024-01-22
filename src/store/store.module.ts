import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Store } from '../entity/store.entity';
import { UserService } from '../user/user.service';
import { Menu } from 'src/entity/menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Store, Menu])],
  providers: [StoreService, UserService],
  controllers: [StoreController],
})
export class StoreModule {}
