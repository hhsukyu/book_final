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
import { MyPage } from 'src/entity/my-page.entity';
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/entity/notification.entity';
import { SseService } from 'src/sse/sse.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StoreBook,
      Book,
      Store,
      User,
      MyPage,
      Notification,
    ]),
  ],
  controllers: [StorebookController],
  providers: [
    StorebookService,
    BookService,
    StoreService,
    UserService,
    NotificationService,
    SseService,
  ],
})
export class StorebookModule {}
