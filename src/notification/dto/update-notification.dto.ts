// update-notification.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { NotificationType } from 'src/entity/notification.entity';

export class UpdateNotificationDto {
  @IsOptional()
  @IsEnum(NotificationType)
  sort?: NotificationType; // '전체알림','입고알림','지점공지',

  @IsOptional()
  @IsString()
  message?: string;
}
