import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class SseService {
  private clients = new Map<number, Subject<any>>();

  addClient(userId: number): Observable<any> {
    const client = new Subject<any>();
    this.clients.set(userId, client);
    console.log(`클라이언트가 등록되었습니다. UserID: ${userId}`);
    return client.asObservable();
  }

  removeClient(userId: number): void {
    this.clients.delete(userId);
  }

  emitNotification(userId: number, message: string): void {
    console.log(userId, '-', message);
    const client = this.clients.get(userId);
    console.log('SSE:', client);
    if (client) {
      client.next({ message });
    }
  }
}
