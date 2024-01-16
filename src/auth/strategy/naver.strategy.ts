import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('NAVER_CLIENT_ID'),
      clientSecret: configService.get<string>('NAVER_CLIENT_SECRET'),
      callbackURL: configService.get<string>('NAVER_REDIRECT_URI'),
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    const user_email = profile._json.email;
    const user_nick = profile._json.nickname;
    const user_mobile = profile._json.mobile;
    const user_profile_image = profile._json.profile_image;
    const user_provider = profile.provider;
    const user_profile = {
      user_email,
      user_nick,
      user_provider,
      user_mobile,
      user_profile_image,
    };
    return user_profile;
  }
}
