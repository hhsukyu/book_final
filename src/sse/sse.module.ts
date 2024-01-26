import { Module } from '@nestjs/common';
import { SseService } from './sse.service';
import { SseController } from './sse.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/entity/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  exports: [SseService],
  controllers: [SseController],
  providers: [SseService],
})
export class SseModule {}
