import { Controller, Param, Sse } from '@nestjs/common';
import { SseService } from './sse.service';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse(':userId')
  sendClientNotification(@Param('userId') userId: string) {
    return this.sseService.sendClientNotification(+userId);
  }
}
