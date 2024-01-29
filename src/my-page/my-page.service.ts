import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MyPage } from '../entity/my-page.entity';
import { UpdateMyWishListDto } from './dto/update-my-wishList.dto';
import { UpdateMyAddressDto } from './dto/update-my-address.dto';
import { CreateMyPageDto } from './dto/create-my-page.dto';
import { UserService } from '../user/user.service';
import { UpdateMyLikeStoreDto } from './dto/update-my-likestore';

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

  // 위시리스트 변경 메서드
  async updateWishList(
    userId: number,
    updateMyWishListDto: UpdateMyWishListDto,
  ) {
    const myPage = await this.findMyPage(userId);
    myPage.wish_list = updateMyWishListDto.wish_list;
    await this.myPageRepository.save(myPage);
    return myPage;
  }

  // 라이크 스토어 변경 메서드
  async updateLikeStore(
    userId: number,
    updateMyLikeStoreDto: UpdateMyLikeStoreDto,
  ) {
    const myPage = await this.findMyPage(userId);
    myPage.like_store = updateMyLikeStoreDto.like_store;
    await this.myPageRepository.save(myPage);
    return myPage;
  }

  // MyPage 찾기
  private async findMyPage(userId: number): Promise<MyPage> {
    let myPage = await this.myPageRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!myPage) {
      throw new NotFoundException(`MyPage with ID ${userId} not found`);
    }

    return myPage;
  }
}
