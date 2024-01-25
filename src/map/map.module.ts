import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import { MapController } from './map.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../entity/store.entity';
import { StoreService } from 'src/store/store.service';
import { UserService } from '../user/user.service';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, User])],
  controllers: [MapController],
  providers: [MapService, StoreService, UserService],
})
export class MapModule {}
