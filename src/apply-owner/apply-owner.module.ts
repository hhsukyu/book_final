import { Module } from '@nestjs/common';
import { ApplyOwnerService } from './apply-owner.service';
import { ApplyOwnerController } from './apply-owner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { ApplyOwner } from 'src/entity/applyOwner.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { MyPage } from 'src/entity/my-page.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ApplyOwner, MyPage])],
  providers: [ApplyOwnerService, UserService, AuthService],
  controllers: [ApplyOwnerController],
})
export class ApplyOwnerModule {}
