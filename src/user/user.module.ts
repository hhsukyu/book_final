import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/entity/store.entity';
import { BookReview } from 'src/entity/bookreview.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Store, BookReview]),
    forwardRef(() => AuthModule),
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
