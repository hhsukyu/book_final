import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Like, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

import { MyPage } from '../entity/my-page.entity';
import { MyPageService } from 'src/my-page/my-page.service';
import { Role } from './types/userRole.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    @InjectRepository(MyPage) // My_page 레포지토리 추가
    private readonly myPageRepository: Repository<MyPage>,
    private readonly myPageService: MyPageService,
  ) {}

  //admin 페이지 유저리스트
  async finduserlist() {
    const users = await this.userRepository.find({
      where: { role: Raw((role) => `${role} = '0'`) },
      select: ['nickname', 'email', 'createdAt'],
    });

    console.log(typeof Role.User);
    return users;
  }
  //admin 페이지 사장님리스트
  async findownerlist() {
    const users = await this.userRepository.find({
      where: { role: Raw((role) => `${role} = '1'`) },
    });

    console.log(typeof Role.User);
    return users;
  }

  //유저 이름 확인
  async findusername(userid: number) {
    const user = await this.userRepository.findOne({
      where: { id: userid },
      select: ['nickname'],
    });
    return user;
  }

  //유저 회원가입
  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    const isUser = await this.findUserByEmail(email);

    if (isUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const user = await this.userRepository.save(createUserDto);

    const mypage = await this.myPageService.create(user.id);
    console.log(mypage);
    return user.id;
  }

  //사장님 회원가입
  async admincreate(createAdminDto: CreateAdminDto) {
    const { email } = createAdminDto;

    const isAdmin = await this.findUserByEmail(email);

    if (isAdmin) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const user = await this.userRepository.save({
      ...createAdminDto,
      role: 1,
    });

    return user;
  }

  async findEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return { isEmailExists: !!user };
  }

  async findAll() {
    return await this.userRepository.find({
      select: ['id', 'email', 'nickname', 'createdAt', 'updatedAt'],
    });
  }

  async findUserById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'photo',
        'nickname',
        'createdAt',
        'updatedAt',
        'role',
      ],
      relations: { stores: true, myPage: true },
    });
  }

  async findUserByIdWithStore(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'nickname', 'createdAt', 'updatedAt'],
      relations: { stores: true },
    });
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const isUser = await this.findUserById(id);

    if (!isUser) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    const result = await this.userRepository.update(
      {
        id,
      },
      {
        ...updateUserDto,
      },
    );

    return result;
  }

  async updateuserImg(userid: number, url: string) {
    const isUser = await this.findUserById(userid);

    if (!isUser) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    const result = await this.userRepository.update(
      { id: userid },
      { photo: url },
    );

    return result;
  }

  async updateUser(
    id: number,
    updateProfileDto: UpdateProfileDto,
    url: string,
  ) {
    const isUser = await this.findUserById(id);

    if (!isUser) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    const result = await this.userRepository.update(
      {
        id,
      },
      {
        ...updateProfileDto,
        photo: url,
      },
    );

    return result;
  }

  async remove(id: number) {
    const isUser = await this.findUserById(id);

    if (!isUser) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    const result = await this.userRepository.delete({ id });

    return result;
  }

  //위시리스트&관심지점일치 user 추출
  async UsersByWishedBook(bookid: number, storeid: number): Promise<number[]> {
    const bookIdString = bookid.toString();
    const storeIdString = storeid.toString();

    const myPageRecords = await this.myPageRepository.find({
      where: {
        wish_list: Like(`%${bookIdString}%`),
        like_store: Like(`%${storeIdString}%`),
      }, // 위시리스트에 해당 책이 포함된 레코드를 찾음
      relations: ['user'], // 사용자 정보를 함께 로드
    });

    // 위시리스트에 해당 책을 가진 사용자들의 ID를 추출
    const userIds = myPageRecords.map((list) => list.user.id);

    return userIds;
  }

  //관심지점일치 user추출
  async findUsersByStoreInterest(storeid: number): Promise<number[]> {
    const storeIdString = storeid.toString();

    const myPageRecords = await this.myPageRepository.find({
      where: [{ like_store: Like(`%${storeIdString}%`) }],
      relations: ['user'], // 사용자 정보를 함께 로드
    });

    // 위시리스트에 해당 책을 가진 사용자들의 ID를 추출
    const userIds = myPageRecords.map((list) => list.user.id);

    return userIds;
  }
}
