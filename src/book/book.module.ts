import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Book } from 'src/entity/book.entity';
import { StoreBook } from 'src/entity/store-book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entity/user.entity';
import { MyPage } from 'src/entity/my-page.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, StoreBook, User, MyPage])],
  controllers: [BookController],
  providers: [BookService, UserService],
})
export class BookModule {}
