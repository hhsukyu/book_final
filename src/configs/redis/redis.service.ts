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

  async setVerificationCode(email: string, code: string): Promise<void> {
    const expirationTimeSeconds = this.configService.get<number>(
      'REDIS_EXPIRATION_TIME_SECONDS',
    );
    await this.client.set(`verification_code:${email}`, code, {
      EX: expirationTimeSeconds,
    });
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
    const expirationTimeSeconds = this.configService.get<number>(
      'REDIS_EXPIRATION_TIME_SECONDS',
    );
    await this.client.set(bookTitle, bookInfo, {
      EX: expirationTimeSeconds,
    });
  }

  async setCodeUserId(code: string, userId: number): Promise<void> {
    const expirationTimeSeconds = this.configService.get<number>(
      'REDIS_CODE_EXPIRATION_TIME_SECONDS',
    );
    await this.client.set(`verification_code:${code}`, userId, {
      EX: expirationTimeSeconds,
    });
  }

  async getUserIdByCode(code: string): Promise<number | null> {
    const userIdString = await this.client.get(`verification_code:${code}`);
    //데이터타입 일치시키기 위해 명시적으로 변환
    return userIdString ? parseInt(userIdString, 10) : null;
  }

  //검색어 Top10 설정
  async setRank(booktitle: string) {
    const bookScore = await this.client.zScore('rank', `book:${booktitle}`);
    console.log('bookScore', bookScore);
    await this.client.zAdd('rank', {
      score: bookScore + 1,
      value: `book:${booktitle}`,
    });
  }

  async getRank() {
    const result = await this.client.zRange('rank', 0, 9, { REV: true });
    return result;
  }
}
