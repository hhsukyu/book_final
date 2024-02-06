// notification.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationService } from './notification.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { accessTokenGuard } from 'src/auth/guard/access-token.guard';
import { UserId } from 'src/auth/decorators/userId.decorator';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationsService: NotificationService) {}

  //전체알림(완료)
  @UseGuards(accessTokenGuard)
  @Post()
  async create(
    @UserId() userId: number,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    const allNoti = await this.notificationsService.allNoti(
      userId,
      createNotificationDto,
    );
    return allNoti;
  }

  //알림수정(완료)
  @Patch(':notificationId')
  updatePartial(
    @Param('notificationId') notificationId: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.updatePartial(
      notificationId,
      updateNotificationDto,
    );
  }

  //알림 전체 조회
  @Get()
  async findAll() {
    return this.notificationsService.findAll();
  }

  //알림 사용자별조회
  @Get('/user/:userId')
  async findByUser(@Param('userId') userId: number) {
    return this.notificationsService.findByUser(userId);
  }

  //알림 스토어별 조회
}
