import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupAdminDto } from './dto/signup-admin.dto';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /// 유저 회원가입
  async signup(singupUserDto: SignupUserDto) {
    const { checkPassword, ...createUserDto } = singupUserDto;

    if (createUserDto.password !== checkPassword) {
      throw new BadRequestException(
        '비밀번호와 확인 비밀번호가 일치하지 않습니다.',
      );
    }

    const saltRounds = +this.configService.get<number>('SALT_ROUNDS');
    const salt = await bcrypt.genSalt(saltRounds);

    const hashPassword = await bcrypt.hash(createUserDto.password, salt);

    const userId = await this.userService.create({
      ...createUserDto,
      password: hashPassword,
    });

    return userId;
  }

  /// 사장(지점장) 회원가입
  async adminsignup(signupAdminDto: SignupAdminDto) {
    const { checkPassword, ...createAdminDto } = signupAdminDto;

    if (createAdminDto.password !== checkPassword) {
      throw new BadRequestException(
        '비밀번호와 확인 비밀번호가 일치하지 않습니다.',
      );
    }

    const saltRounds = +this.configService.get<number>('SALT_ROUNDS');
    const salt = await bcrypt.genSalt(saltRounds);

    const hashPassword = await bcrypt.hash(createAdminDto.password, salt);

    const userId = await this.userService.admincreate({
      ...createAdminDto,
      password: hashPassword,
    });

    return userId;
  }

  /// 로그인
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('회원가입되지 않은 이메일입니다.');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const accessToken = this.generateAccessToken(user.id, user.name);
    const refreshToken = this.generateRefreshToken(user.id);

    await this.userService.update(user.id, {
      currentRefreshToken: refreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /// 토큰 재발급
  async refresh(id: number) {
    const user = await this.userService.findUserById(id);

    const accessToken = this.generateAccessToken(id, user.name);

    return accessToken;
  }

  /// 로그아웃
  async logout(id: number) {
    await this.userService.update(id, {
      currentRefreshToken: null,
    });

    return true;
  }

  /// access 토큰 발급 (private)
  private generateAccessToken(id: number, name: string) {
    const payload = { userId: id, userName: name };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXP'),
    });

    return accessToken;
  }

  /// refresh 토큰 발급 (private)
  private generateRefreshToken(id: number) {
    const payload = { userId: id };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXP'),
    });

    return refreshToken;
  }

  //네이버 로그인
  async naverLoginCallback({ req, res }) {
    // 네이버 이메일로 사용자를 찾는다.
    let OAuthUser = await this.userRepository.findOne({
      where: { email: req.user.email },
    });

    // 네이버 사용자의 이메일 값을 변수 지정 해주었다.
    const email = req.user.email;

    // 비밀번호 값은 따로 받아올 수 없기 때문에 user의 아이디 값을 해시화 해서 변수 지정해주었다.
    const hashedNaverPassword = await bcrypt.hash(req.user.id, 10);

    // 해당 이메일 사용자가 없다면 회원가입 로직처럼 회원 생성 해준다.
    // 비밀번호는 user의 아이디 값을 해시화 해서 변수 지정한 값을 사용한다.
    if (!OAuthUser) {
      OAuthUser = await this.userRepository.save({
        email,
        nickname: req.user.nickname,
        password: hashedNaverPassword,
      });
    }

    const payload = { email, sub: req.user.id };

    res.redirect(`http://localhost:3000/login/success?payload=${payload}`);

    return {
      message: '로그인 성공',
      success: true,
      access_token: this.jwtService.sign(payload),
      OAuthUser,
    };
  }
}

// async validateUser(user_email: string): Promise<any> {
//   const user = await this.userService.findUserByEmail(user_email);
//   if (!user) {
//     return null;
//   }
//   return user;
// }
