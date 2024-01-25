import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { SseService } from './sse.service';
import { Response } from 'express';
import { Subscription } from 'rxjs';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Get(':userId')
  async listenToNotifications(
    @Param('userId') userId: number,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientObservable = this.sseService.addClient(userId);
    const clientSubscription: Subscription = clientObservable.subscribe(
      (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      },
    );

    res.on('close', () => {
      this.sseService.removeClient(userId);
      clientSubscription.unsubscribe();
    });
  }
}
