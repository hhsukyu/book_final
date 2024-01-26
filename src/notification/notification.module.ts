import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Notification } from 'src/entity/notification.entity';
import { Book } from 'src/entity/book.entity';
import { BookService } from 'src/book/book.service';
import { MyPage } from 'src/entity/my-page.entity';
import { MyPageService } from 'src/my-page/my-page.service';
import { StoreBook } from 'src/entity/store-book.entity';
import { Store } from 'src/entity/store.entity';
import { StoreService } from 'src/store/store.service';
import { SseService } from 'src/sse/sse.service';
import { RedisService } from 'src/configs/redis/redis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      User,
      Book,
      MyPage,
      StoreBook,
      Store,
    ]),
  ],
  exports: [NotificationService],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    UserService,
    BookService,
    MyPageService,
    StoreService,
    SseService,
    RedisService,
  ],
})
export class NotificationModule {}
