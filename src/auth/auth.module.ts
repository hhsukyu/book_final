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

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
  ],
  exports: [
    accessTokenGuard,
    accessTokenStrategy,
    refreshTokenGuard,
    refreshTokenStrategy,
    JwtModule,
    PassportModule,
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
  ],
})
export class AuthModule {}
