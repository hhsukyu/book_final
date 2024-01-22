import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { SignupUserDto } from './dto/signup-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { refreshTokenGuard } from './guard/refresh-token.guard';
import { accessTokenGuard } from './guard/access-token.guard';
import { Request } from 'express';
import { SignupAdminDto } from './dto/signup-admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { SendVerificationCodeDto } from './dto/send-verification-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { UpdatePasswordDto } from './dto/update-password.dto copy';
import { UserId } from './decorators/userId.decorator';
import { ApiService } from 'src/api/api.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly apiService: ApiService,
    private readonly configService: ConfigService,
  ) {}

  //만화 규장 API 데이터 실험
  @Get('book')
  book() {
    return this.apiService.bookupdate();
  }

  @Post('signup')
  signup(@Body() singupUserDto: SignupUserDto) {
    return this.authService.signup(singupUserDto);
  }

  @Post('signup/admin')
  adminsignup(@Body() signupadminDto: SignupAdminDto) {
    return this.authService.adminsignup(signupadminDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiBearerAuth('refreshToken')
  @UseGuards(refreshTokenGuard)
  @Post('refresh')
  refresh(@Req() req: Request) {
    const userId: number = (req.user as any).userId;

    if (!userId) {
      throw new UnauthorizedException('로그인 오류입니다.');
    }

    return this.authService.refresh(userId);
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    const userId: number = (req.user as any).userId;

    if (!userId) {
      throw new UnauthorizedException('로그인 오류입니다.');
    }

    return this.authService.logout(userId);
  }

  //네이버 일반사용자 소셜로그인
  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverLogin(): Promise<void> {}

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverLoginCallback(@Req() req, @Res() res) {
    return await this.authService.naverLoginCallback({ req, res });
  }

  //네이버 지점업주 소셜로그인
  @Get('naver-admin')
  @UseGuards(AuthGuard('naver-admin'))
  async naverAdminLogin(): Promise<void> {}

  @Get('naver/admin/callback')
  @UseGuards(AuthGuard('naver-admin'))
  async naverAdminLoginCallback(@Req() req, @Res() res) {
    return await this.authService.naverAdminLoginCallback({ req, res });
  }

  //카카오 일반사용자 소셜로그인
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin(): Promise<void> {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginCallback(@Req() req, @Res() res) {
    return await this.authService.kakaoLoginCallback({ req, res });
  }

  //카카오 지점업주 소셜로그인
  @Get('kakao-admin')
  @UseGuards(AuthGuard('kakao-admin'))
  async kakaoAdminLogin(): Promise<void> {}

  @Get('kakao/admin/callback')
  @UseGuards(AuthGuard('kakao-admin'))
  async kakaoAdminLoginCallback(@Req() req, @Res() res) {
    return await this.authService.kakaoAdminLoginCallback({ req, res });
  }

  //비밀번호 찾기-이메일 인증번호 전송
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Post('/send-verification')
  async sendVerificationCode(
    @Body() sendVerificationCodeDto: SendVerificationCodeDto,
  ) {
    await this.authService.sendVerificationCode(sendVerificationCodeDto.email);
  }
  //비밀번호 찾기-인증번호 확인
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Post('/verify-code')
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    await this.authService.verifyCode(verifyCodeDto.code, verifyCodeDto.email);
  }
  //비밀번호 찾기-비밀번호 재설정
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Put('/update-password')
  async updatePassword(
    @UserId() userId: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    await this.authService.updatePassword(userId, updatePasswordDto);
  }
}
