import { Module } from '@nestjs/common';
import { ApplyOwnerService } from './apply-owner.service';
import { ApplyOwnerController } from './apply-owner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { ApplyOwner } from 'src/entity/applyOwner.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { MyPage } from 'src/entity/my-page.entity';
import { MyPageService } from 'src/my-page/my-page.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplyOwner, MyPage, User]),
    UserModule,
    AuthModule,
  ],
  providers: [ApplyOwnerService, MyPageService],
  controllers: [ApplyOwnerController],
})
export class ApplyOwnerModule {}
