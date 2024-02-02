import {
  BadRequestException,
  ConflictException,
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
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'src/configs/redis/redis.service';
import { EmailService } from 'src/configs/mailer/email.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { MyPageService } from 'src/my-page/my-page.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly myPageService: MyPageService,
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

    //TODO: 함수로 따로 빼기
    const accessToken = this.generateAccessToken(user.id, user.nickname);
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

    const accessToken = this.generateAccessToken(id, user.nickname);

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

  //네이버 회원가입/로그인
  async naverLoginCallback({ req, res }) {
    // 네이버 이메일로 사용자를 찾는다.
    const email = req.user.userProfile.userEmail;
    const nickname = req.user.userProfile.userNick;
    const photo = req.user.userProfile.userProfileImage;
    let OAuthUser = await this.userRepository.findOne({
      where: { email },
    });

    // 네이버 사용자의 이메일 값을 변수 지정
    // user의 아이디 값을 해시화 해서 변수 지정
    const hashedNaverPassword = await bcrypt.hash(email, 10);

    // 해당 이메일 사용자가 없다면 회원가입 로직처럼 회원 생성
    // 비밀번호는 user의 아이디 값을 해시화 해서 변수 지정한 값을 사용
    if (!OAuthUser) {
      OAuthUser = await this.userRepository.save({
        email,
        nickname,
        photo,
        password: hashedNaverPassword,
      });

      //마이페이지생성
      const mypage = await this.myPageService.create(OAuthUser.id);
      console.log(mypage);
    }

    const accessToken = this.generateAccessToken(
      OAuthUser.id,
      OAuthUser.nickname,
    );
    const refreshToken = this.generateRefreshToken(OAuthUser.id);

    await this.userService.update(OAuthUser.id, {
      currentRefreshToken: refreshToken,
    });

    if (OAuthUser) {
      res.redirect(
        `/auth/login/success?accessToken=${accessToken}&refreshToken=${refreshToken}`, //받아주는 페이지 만들어야함
      );
    } else res.redirect('/login&signup.html');
  }

  //네이버 지점업주 회원가입/로그인
  async naverAdminLoginCallback({ req, res }) {
    // 네이버 이메일로 사용자를 찾는다.
    const email = req.user.userProfile.userEmail;
    const nickname = req.user.userProfile.userNick;
    let OAuthUser = await this.userRepository.findOne({
      where: { email },
    });

    // 네이버 사용자의 이메일 값을 변수 지정
    // user의 아이디 값을 해시화 해서 변수 지정
    const hashedNaverPassword = await bcrypt.hash(email, 10);

    // 해당 이메일 사용자가 없다면 회원가입 로직처럼 회원 생성
    // 비밀번호는 user의 아이디 값을 해시화 해서 변수 지정한 값을 사용
    if (!OAuthUser) {
      OAuthUser = await this.userRepository.save({
        email,
        nickname,
        password: hashedNaverPassword,
        role: 1,
      });
    }

    const accessToken = this.generateAccessToken(
      OAuthUser.id,
      OAuthUser.nickname,
    );
    const refreshToken = this.generateRefreshToken(OAuthUser.id);

    await this.userService.update(OAuthUser.id, {
      currentRefreshToken: refreshToken,
    });

    if (OAuthUser)
      res.redirect(
        `/login/success?accessToken=${accessToken}&refreshToken=${refreshToken}`, //받아주는 페이지 만들어야함
      );
    else res.redirect('/login/failure');
  }

  //카카오 회원가입/로그인
  async kakaoLoginCallback({ req, res }) {
    // 카카오 이메일로 사용자를 찾는다.
    const email = req.user.userProfile.userEmail;
    const nickname = req.user.userProfile.userNick;
    const photo = req.user.userProfile.userProfileImage;
    let OAuthUser = await this.userRepository.findOne({
      where: { email },
    });

    // 카카오 사용자의 이메일 값을 변수 지정
    // user의 아이디 값을 해시화 해서 변수 지정
    const hashedKakaoPassword = await bcrypt.hash(email, 10);

    // 해당 이메일 사용자가 없다면 회원가입 로직처럼 회원 생성
    // 비밀번호는 user의 아이디 값을 해시화 해서 변수 지정한 값을 사용
    if (!OAuthUser) {
      OAuthUser = await this.userRepository.save({
        email,
        nickname,
        photo,
        password: hashedKakaoPassword,
      });
      //마이페이지생성
      const mypage = await this.myPageService.create(OAuthUser.id);
      console.log(mypage);
    }
    console.log('photo', photo);
    const accessToken = this.generateAccessToken(
      OAuthUser.id,
      OAuthUser.nickname,
    );
    const refreshToken = this.generateRefreshToken(OAuthUser.id);

    await this.userService.update(OAuthUser.id, {
      currentRefreshToken: refreshToken,
    });

    if (OAuthUser)
      res.redirect(
        `http://localhost:3000/auth/login/success?accessToken=${accessToken}&refreshToken=${refreshToken}`, //받아주는 페이지 만들어야함
      );
    else res.redirect('http://localhost:3000/login&signup.html');
  }

  //카카오 지점업주 회원가입/로그인
  async kakaoAdminLoginCallback({ req, res }) {
    // 카카오 이메일로 사용자를 찾는다.
    const email = req.user.userProfile.userEmail;
    const nickname = req.user.userProfile.userNick;
    let OAuthUser = await this.userRepository.findOne({
      where: { email },
    });

    // 카카오 사용자의 이메일 값을 변수 지정
    // user의 아이디 값을 해시화 해서 변수 지정
    const hashedKakaoPassword = await bcrypt.hash(email, 10);

    // 해당 이메일 사용자가 없다면 회원가입 로직처럼 회원 생성
    // 비밀번호는 user의 아이디 값을 해시화 해서 변수 지정한 값을 사용
    if (!OAuthUser) {
      OAuthUser = await this.userRepository.save({
        email,
        nickname,
        password: hashedKakaoPassword,
        role: 1,
      });
    }

    const accessToken = this.generateAccessToken(
      OAuthUser.id,
      OAuthUser.nickname,
    );
    const refreshToken = this.generateRefreshToken(OAuthUser.id);

    await this.userService.update(OAuthUser.id, {
      currentRefreshToken: refreshToken,
    });

    if (OAuthUser)
      res.redirect(
        `http://localhost:3000/login/success?accessToken=${accessToken}&refreshToken=${refreshToken}`, //받아주는 페이지 만들어야함
      );
    else res.redirect('http://localhost:3000/login/failure');
  }

  //비밀번호 찾기- 이메일 인증번호 보내기
  async sendVerificationCode(email: string) {
    const code = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    await this.redisService.setVerificationCode(email, code.toString());
    await this.emailService.sendVerificationEmail(email, code.toString());
    console.log('email, code', email, code);
  }

  //비밀번호 찾기-인증번호 확인
  async verifyCode(code: string, email: string) {
    const storedCode = await this.redisService.getVerificationCode(email);
    console.log('storedCode,code', storedCode, code);

    if (storedCode === code) {
      return { message: '이메일 인증 성공' };
    } else {
      throw new ConflictException('인증번호가 일치하지 않습니다.');
    }
  }

  //비밀번호 찾기-비밀번호 재설정
  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    if (updatePasswordDto.password !== updatePasswordDto.checkPassword) {
      throw new BadRequestException(
        '비밀번호와 확인 비밀번호가 일치하지 않습니다.',
      );
    }
    const user = await this.userRepository.findOne({
      where: { email: updatePasswordDto.email },
    });

    const saltRounds = +this.configService.get<number>('SALT_ROUNDS');
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(updatePasswordDto.password, salt);

    user.password = hashedPassword;
    await this.userRepository.save(user);
  }

  //사용자 사장으로 전환
  async changeOwner(userid: number) {
    const user = await this.userRepository.findOne({ where: { id: userid } });

    user.role = 1;
    return this.userRepository.save(user);
  }
}
