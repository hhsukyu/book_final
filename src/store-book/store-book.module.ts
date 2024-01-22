import { Module } from '@nestjs/common';
import { StorebookController } from './store-book.controller';
import { StorebookService } from './store-book.service';
import { StoreBook } from 'src/entity/store-book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/entity/book.entity';
import { Store } from 'src/entity/store.entity';
import { BookService } from 'src/book/book.service';
import { StoreService } from 'src/store/store.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreBook, Book, Store, User])],
  controllers: [StorebookController],
  providers: [StorebookService, BookService, StoreService, UserService],
})
export class StorebookModule {}
