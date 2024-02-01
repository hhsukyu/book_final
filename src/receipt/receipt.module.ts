import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';
import { Receipt } from '../entity/receipt.entity';
import { Store } from '../entity/store.entity';
import { User } from '../entity/user.entity';
import { UserService } from '../user/user.service';
import { StoreReview } from '../entity/storeReview.entity';
import { MyPage } from 'src/entity/my-page.entity';
import { MyPageService } from 'src/my-page/my-page.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Receipt, Store, User, StoreReview, MyPage]),
  ],
  providers: [ReceiptService, UserService, MyPageService],
  controllers: [ReceiptController],
})
export class ReceiptModule {}
