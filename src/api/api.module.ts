import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../entity/book.entity';
import { ApiService } from './api.service';
import { Page } from '../entity/bookUpdate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Page, Book])],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
