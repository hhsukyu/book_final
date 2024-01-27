import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MyPage } from '../entity/my-page.entity';
import { UpdateMyWishListDto } from './dto/update-my-wishlist.dto';
import { UpdateMyAddressDto } from './dto/update-my-address.dto';
import { CreateMyPageDto } from './dto/create-my-page.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class MyPageService {
  constructor(
    @InjectRepository(MyPage)
    private myPageRepository: Repository<MyPage>,
    private userService: UserService,
  ) {}

  async create(userId: number, createMyPageDto: CreateMyPageDto) {
    const userDetail = await this.myPageRepository.findOne({
      where: { user: { id: userId } },
      //select: ['address', 'wish_list'],
    });

    if (userDetail) {
      throw new NotFoundException('이미 등록되어있습니다');
    }

    const myPage = await this.myPageRepository.save({
      user: { id: userId },
      ...createMyPageDto,
    });
    return myPage;
  }

  async findOne(userId: number) {
    const userDetail = await this.myPageRepository.findOne({
      where: { user: { id: userId } },
      //select: ['address', 'wish_list'],
    });
    console.log(userDetail);

    return userDetail;
  }

  async address_change(userId: number, updateMyAddressDto: UpdateMyAddressDto) {
    const myPage = await this.myPageRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!myPage) {
      throw new NotFoundException(`MyPage with ID ${userId} not found`);
    }

    // 새로운 데이터로 엔티티를 업데이트합니다.
    Object.assign(myPage, updateMyAddressDto);

    // 업데이트된 엔티티를 저장합니다.
    await this.myPageRepository.save(myPage);
    return myPage;
  }

  async wishList_likeStore_change(
    userId: number,
    updateMyWishListDto: UpdateMyWishListDto,
  ) {
    const myPage = await this.myPageRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!myPage) {
      throw new NotFoundException(`MyPage with ID ${userId} not found`);
    }

    // 새로운 데이터로 엔티티를 업데이트합니다.
    Object.assign(myPage, updateMyWishListDto);

    // 업데이트된 엔티티를 저장합니다.
    await this.myPageRepository.save(myPage);
    return myPage;
  }
}
