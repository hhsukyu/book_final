import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Book } from 'src/entity/book.entity';
import { StoreBook } from 'src/entity/store-book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { User } from '../entity/user.entity';
import { RedisService } from '../configs/redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoreBook, User, Book])],
  controllers: [BookController],
  providers: [BookService, UserService, RedisService],
})
export class BookModule {}
