// create-notification.dto.ts
import { IsNotEmpty } from 'class-validator';
import { NotificationType } from 'src/entity/notification.entity';

export class CreateNotificationDto {
  @IsNotEmpty()
  sort: NotificationType;

  @IsNotEmpty()
  message: string;
}
