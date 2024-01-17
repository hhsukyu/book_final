import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NaverAdminStrategy extends PassportStrategy(
  Strategy,
  'naver-admin',
) {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('NAVER_CLIENT_ID'),
      clientSecret: configService.get<string>('NAVER_CLIENT_SECRET'),
      callbackURL: configService.get<string>('NAVER_ADMIN_REDIRECT_URI'),
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    const userEmail = profile._json.email;
    const userNick = profile._json.nickname;
    const userProfileImage = profile._json.profile_image;
    const userProvider = profile.provider;
    const userProfile = {
      userEmail,
      userNick,
      userProvider,
      userProfileImage,
    };

    return { accessToken, userProfile };
  }
}
