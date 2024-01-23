import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entity/notification.entity';
import { User } from '../entity/user.entity';
import * as redis from 'redis';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(notificationData: {
    message: string;
    userIds: number[]; // 알림을 받을 사용자 ID 목록
  }): Promise<Notification[]> {
    const { message, userIds } = notificationData;

    // userIds 목록에 대한 알림 생성
    const notifications: Notification[] = [];

    for (const userId of userIds) {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        console.log('사용자없음', user);
        continue;
      }

      const notification = new Notification();
      notification.message = message;
      notification.user = user;

      const createdNotification =
        await this.notificationRepository.save(notification);

      // 레디스를 통해 알림 발송

      const client = redis.createClient();

      await redis.lpush(
        `notifications:${userId}`,
        JSON.stringify(notification),
      );
      notifications.push(createdNotification);
    }

    return notifications;
  }
}
