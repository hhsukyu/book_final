import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { accessTokenGuard } from 'src/auth/guard/access-token.guard';
import { UserId } from 'src/auth/decorators/userId.decorator';

import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  //알림 조회
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Get()
  readNotification(@UserId() userId: number) {
    return this.notificationService.readNotification(+userId);
  }

  //알림 삭제
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Delete(':notificationId')
  deleteNotification(
    @Param('notificationId') id: string,
    @UserId() userId: number,
  ) {
    return this.notificationService.deleteNotification(+id, userId);
  }
}
