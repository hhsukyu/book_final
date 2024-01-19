import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('KAKAO_CLIENT_ID'),
      clientSecret: configService.get<string>('KAKAO_CLIENT_SECRET'),
      callbackURL: configService.get<string>('KAKAO_REDIRECT_URI'),
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    const userEmail = profile._json.kakao_account.email;
    const userNick = profile._json.kakao_profile_nickname;
    const userProfileImage = profile._json.kakao_profile_image;
    const userProvider = profile.provider;
    const userProfile = {
      userEmail,
      userNick,
      userProvider,
      userProfileImage,
    };
    console.log('userProfile', userProfile);
    return { accessToken, userProfile };
  }
}
