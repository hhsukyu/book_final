import { Controller, Get, Sse, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { SseService } from './sse.service';
import { Observable } from 'rxjs';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse('notifications/user/:userId')
  sse(
    @Req() req: Request,
    @Param('userId') userId: number,
  ): Observable<MessageEvent> {
    req.on('close', () => {
      console.log(`${userId} 사용자가 접속을 종료했습니다.`);
    });

    return this.sseService.getUserNotifications(+userId);
  }
}
