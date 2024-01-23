import { Module } from '@nestjs/common';
import { StorebookController } from './store-book.controller';
import { StorebookService } from './store-book.service';
import { StoreBook } from '../entity/store-book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../entity/book.entity';
import { Store } from '../entity/store.entity';
import { BookService } from '../book/book.service';
import { StoreService } from '../store/store.service';
import { UserService } from '../user/user.service';
import { User } from '../entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreBook, Book, Store, User])],
  controllers: [StorebookController],
  providers: [StorebookService, BookService, StoreService, UserService],
})
export class StorebookModule {}
