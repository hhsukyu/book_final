import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RedisClientType, createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.client = createClient({
      url: `redis://${this.configService.get(
        'REDIS_USERNAME',
      )}:${this.configService.get('REDIS_PASSWORD')}@${this.configService.get(
        'REDIS_HOST',
      )}:${this.configService.get('REDIS_PORT')}/0`,
    });

    this.client.on('error', (error) => console.error(`Redis Error: ${error}`));

    await this.client.connect();
    console.log('Connected to Redis');
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  // async setRefreshToken(userId: string, token: string): Promise<void> {
  //   await this.client.set(`refresh_token:${userId}`, token, {
  //     EX: 60 * 60 * 24 * 7,
  //   });
  // }

  // async getRefreshToken(userId: string): Promise<string | null> {
  //   return await this.client.get(`refresh_token:${userId}`);
  // }

  // async removeRefreshToken(userId: string): Promise<void> {
  //   await this.client.del(`refresh_token:${userId}`);
  // }

  async setVerificationCode(email: string, code: string): Promise<void> {
    await this.client.set(`verification_code:${email}`, code, { EX: 60 * 3 });
  }

  async getVerificationCode(email: string): Promise<string | null> {
    return await this.client.get(`verification_code:${email}`);
  }

  async getBookInfo(bookTitle: string): Promise<string | null> {
    const cachedResult = await this.client.get(bookTitle);
    return cachedResult && cachedResult !== '[]'
      ? JSON.parse(cachedResult)
      : null;
  }

  async setBookInfo(bookTitle: string, bookInfo: string): Promise<void> {
    await this.client.set(bookTitle, bookInfo, { EX: 60 * 2 });
  }

  async setUserIdCode(userId: string, code: string): Promise<void> {
    await this.client.set(userId, code, { EX: 60 * 1 });
  }
}
