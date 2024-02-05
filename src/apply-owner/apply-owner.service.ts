import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplyOwner } from 'src/entity/applyOwner.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { ApplyOwnerDto } from './dto/applyowner.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ApplyOwnerService {
  constructor(
    @InjectRepository(ApplyOwner)
    private applyOwnerRepository: Repository<ApplyOwner>,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  //사업자 전환하기 신청
  async userToOwner(applyOwnerDto: ApplyOwnerDto, userid: number) {
    const user = await this.userService.findUserById(userid);

    console.log('user', user);

    await this.authService.sendVerificationCode(user.email);

    console.log('인증번호가 성공적으로 전송되었습니다.');

    try {
      const ownerApplication = await this.applyOwnerRepository.save({
        ...applyOwnerDto,
        email: user.email,
      });

      return ownerApplication;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
