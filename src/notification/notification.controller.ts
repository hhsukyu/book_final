// notification.controller.ts
import {
  Body,
  Controller,
  Delete,
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
  async allNoti(
    @UserId() userId: number,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    const allNoti = await this.notificationsService.allNoti(
      userId,
      createNotificationDto,
    );
    return allNoti;
  }

  /// 지점알림(완료)
  @UseGuards(accessTokenGuard)
  @Post('/store/:storeId')
  async storeNoti(
    @UserId() fromUserId: number,
    @Param('storeId') storeId: number,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    return await this.notificationsService.storeNoti(
      fromUserId,
      storeId,
      createNotificationDto,
    );
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

  //알림 전체 조회(완료)
  @Get()
  async findAll() {
    return this.notificationsService.findAll();
  }

  //알림 사용자별조회(완료)
  @Get('/user/:userId')
  async findByUser(@Param('userId') userId: number) {
    return this.notificationsService.findByUser(userId);
  }

  //알림 스토어별 조회
  @Get('/store/:storeId')
  async findByStore(@Param('storeId') storeId: number) {
    return this.notificationsService.findByStore(storeId);
  }

  //알림 삭제
  @UseGuards(accessTokenGuard)
  @Delete(':notificationId')
  async delete(@Param('notificationId') notificationId: number) {
    return this.notificationsService.delete(notificationId);
  }
}
