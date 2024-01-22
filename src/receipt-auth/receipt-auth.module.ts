import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReceiptAuthController } from './receipt-auth.controller';
import { ReceiptAuth } from '../entity/receiptAuth.entity';
import { Store } from '../entity/store.entity';
import { ReceiptAuthService } from './receipt-auth.service';
@Module({
  imports: [TypeOrmModule.forFeature([ReceiptAuth, Store])],
  providers: [ReceiptAuthService],
  controllers: [ReceiptAuthController],
})
export class ReceiptAuthModule {}
