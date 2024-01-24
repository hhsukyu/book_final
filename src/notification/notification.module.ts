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

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User, Book, MyPage])],
  exports: [NotificationService],
  controllers: [NotificationController],
  providers: [NotificationService, UserService, BookService, MyPageService],
})
export class NotificationModule {}
