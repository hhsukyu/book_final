import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../entity/book.entity';
import { ApiService } from './api.service';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
