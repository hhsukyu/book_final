import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplyOwner } from 'src/entity/applyOwner.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { ApplyOwnerDto } from './dto/applyowner.dto';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/entity/user.entity';

@Injectable()
export class ApplyOwnerService {
  constructor(
    @InjectRepository(ApplyOwner)
    private applyOwnerRepository: Repository<ApplyOwner>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  //사업자 전환하기 신청폼 제출
  async userToOwner(applyOwnerDto: ApplyOwnerDto, userid: number) {
    const user = await this.userService.findUserById(userid);

    console.log('user', user);

    // await this.authService.sendVerificationCode(user.email);

    // console.log('인증번호가 성공적으로 전송되었습니다.');

    try {
      const ownerApplication = await this.applyOwnerRepository.save({
        ...applyOwnerDto,
        userid: user.id,
      });

      return ownerApplication;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //사장님 신청자 조회
  async getPreOwners() {
    const preOwners = await this.applyOwnerRepository.find({
      where: { Authorized: false },
    });
    return preOwners;
  }

  //사장님 신청자 승인
  async approveOwner(userid: number, applyownerid: number) {
    console.log('userid', userid);
    // ApplyOwner 엔터티 조회
    const applyOwner = await this.applyOwnerRepository.findOne({
      where: { id: applyownerid },
    });

    if (!applyOwner) {
      // 해당 ID에 해당하는 사장님 신청자가 없을 경우 예외 처리
      throw new NotFoundException('Owner not found');
    }

    // Authorized 필드를 true로 변경
    applyOwner.Authorized = true;

    // 해당 사장님 신청자 업데이트
    await this.applyOwnerRepository.save(applyOwner);

    const user = await this.userService.findUserById(userid);

    if (!user) {
      // 해당 ID에 해당하는 사용자가 없을 경우 예외 처리
      throw new NotFoundException('User not found');
    }
    console.log('user', user);

    user.role = 1;

    return this.userRepository.save(user);
  }
}
