import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Book } from 'src/entity/book.entity';
import { StoreBook } from 'src/entity/storeBook.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entity/user.entity';
import { MyPage } from 'src/entity/my-page.entity';
import { RedisService } from '../configs/redis/redis.service';
import { MyPageService } from 'src/my-page/my-page.service';
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/entity/notification.entity';
import { StoreService } from 'src/store/store.service';
import { SseService } from 'src/sse/sse.service';
import { Store } from 'src/entity/store.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Book,
      StoreBook,
      User,
      MyPage,
      Notification,
      Store,
    ]),
  ],
  controllers: [BookController],
  providers: [
    BookService,
    UserService,
    RedisService,
    MyPageService,
    NotificationService,
    StoreService,
    SseService,
  ],
})
export class BookModule {}
