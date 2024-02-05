import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/entity/store.entity';
import { BookReview } from '../entity/bookreview.entity';
import { MenuService } from '../menu/menu.service';
import { Menu } from '../entity/menu.entity';
import { MyPage } from 'src/entity/my-page.entity';
import { MyPageService } from 'src/my-page/my-page.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Store, BookReview, Menu, MyPage]),
    forwardRef(() => AuthModule),
  ],
  exports: [UserService, MenuService],
  controllers: [UserController],
  providers: [UserService, MenuService, MyPageService],
})
export class UserModule {}
