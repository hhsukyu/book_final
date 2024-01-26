import { Injectable, MessageEvent } from '@nestjs/common';
import { Observable, Subject, filter, map } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from 'src/entity/notification.entity';
import { User } from 'src/entity/user.entity';

@Injectable()
export class SseService {
  private users$: Subject<User> = new Subject();

  private observer = this.users$.asObservable();

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  sendClientAlarm(userId: number): Observable<any> {
    return this.observer.pipe(
      filter((user) => user.id === userId),
      map(async (user) => {
        // 데이터베이스에서 userId에 해당하는 알림 메시지 조회
        const notifications = await this.notificationRepository.find({
          where: { id: user.id },
        });

        // 조회된 알림 메시지를 반환
        return {
          data: {
            notifications,
          },
        } as MessageEvent;
      }),
    );
  }
}
