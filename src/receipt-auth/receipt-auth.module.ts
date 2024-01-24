import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReceiptAuthController } from './receipt-auth.controller';
import { ReceiptAuthService } from './receipt-auth.service';
import { ReceiptAuth } from '../entity/receiptAuth.entity';
import { Store } from '../entity/store.entity';
import { User } from '../entity/user.entity';
import { UserService } from '../user/user.service';
import { StoreReview } from '../entity/storeReview.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReceiptAuth, Store, User, StoreReview])],
  providers: [ReceiptAuthService, UserService],
  controllers: [ReceiptAuthController],
})
export class ReceiptAuthModule {}
