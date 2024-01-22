import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReceiptAuthController } from './receipt-auth.controller';
import { ReceiptAuth } from '../entity/receiptAuth.entity';
import { ReceiptAuthService } from './receipt-auth.service';
@Module({
  imports: [TypeOrmModule.forFeature([ReceiptAuth])],
  providers: [ReceiptAuthService],
  controllers: [ReceiptAuthController],
})
export class ReceiptAuthModule {}
