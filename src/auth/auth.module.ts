import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { accessTokenGuard } from './guard/access-token.guard';
import { accessTokenStrategy } from './strategy/access-token.strategy';
import { refreshTokenGuard } from './guard/refresh-token.guard';
import { refreshTokenStrategy } from './strategy/refresh-token.strategy';
import { JwtModule } from '@nestjs/jwt';
import { NaverStrategy } from './strategy/naver.strategy';
import { NaverAuthGuard } from './guard/naver-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { NaverAdminStrategy } from './strategy/naver-admin.strategy';
import { KakaoStrategy } from './strategy/kakao.strategy';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';
import { KakaoAdminStrategy } from './strategy/kakao-admin.strategy';
import { RedisModule } from 'src/configs/redis/redis.module';
import { EmailService } from 'src/configs/mailer/email.service';

import { Book } from '../entity/book.entity';
import { MyPage } from 'src/entity/my-page.entity';
import { MyPageService } from 'src/my-page/my-page.service';
import { MyPageModule } from 'src/my-page/my-page.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Book, MyPage]),
    JwtModule,
    MyPageModule,
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    RedisModule,
    // SessionModule.forRoot({
    //   session: { secret: 'your-secret-key' },
    // }),
  ],
  exports: [
    accessTokenGuard,
    accessTokenStrategy,
    refreshTokenGuard,
    refreshTokenStrategy,
    JwtModule,
    PassportModule,
    AuthService,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    accessTokenGuard,
    accessTokenStrategy,
    refreshTokenGuard,
    refreshTokenStrategy,
    NaverStrategy,
    NaverAdminStrategy,
    NaverAuthGuard,
    KakaoStrategy,
    KakaoAdminStrategy,
    KakaoAuthGuard,
    EmailService,
  ],
})
export class AuthModule {}
