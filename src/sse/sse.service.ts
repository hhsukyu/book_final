import { Injectable } from '@nestjs/common';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SseService {
  // 모든 알림 메시지를 "새로운 알림이 도착했습니다"로 변경
  private notifications = [
    {
      id: 1,
      message: '환영합니다',
    },
    { id: 2, message: '식사는 하셨나요?.' },
    { id: 3, message: '공부를 키워드로 만화를 검색해보세요.' },
    {
      id: 4,
      message: '예전에 몰래 드래곤볼 보다가 엄마한테 혼났던 기억이 나네요',
    },
    {
      id: 5,
      message: '그럼 전 이만~',
    },
    // 이후 알림 데이터 추가 가능. 여기에 더 많은 알림을 추가할 수 있지만, 모든 메시지는 같습니다.
  ];

  getUserNotifications(userId: number): Observable<any> {
    return interval(5000).pipe(
      // 3초마다 이벤트 발생
      map((i) => {
        // 여기서는 모든 알림이 같으므로, notificationIndex를 사용하지 않고 직접 메시지를 반환합니다.
        const notification = this.notifications[i]; // 첫 번째 메시지 사용
        return {
          data: `안녕하세요 user${userId}님!: ${notification.message}\n\n`,
        };
      }),
    );
  }
}

//알림이 등록되는 코드에 sse를 호출하는 방식으로 어떤가??
