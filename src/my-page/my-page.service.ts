import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MyPage } from '../entity/my-page.entity';
import { AddToWishListDto } from './dto/add-to-wishlist.dto';
import { UpdateMyAddressDto } from './dto/update-my-address.dto';
import { CreateMyPageDto } from './dto/add-to-address.dto';
import { UserService } from '../user/user.service';
import { AddToMyLikeStoreDto } from './dto/add-to-likestore';

@Injectable()
export class MyPageService {
  constructor(
    @InjectRepository(MyPage)
    private myPageRepository: Repository<MyPage>,
    private userService: UserService,
  ) {}

  //주소추가하기
  async create(userId: number, createMyPageDto: CreateMyPageDto) {
    const userDetail = await this.myPageRepository.findOne({
      where: { user: { id: userId } },
    });

    if (userDetail) {
      throw new NotFoundException('주소가 이미 등록되어있습니다');
    }

    const myPage = await this.myPageRepository.save({
      user: { id: userId },
      ...createMyPageDto,
    });
    return myPage;
  }

  //마이페이지 조회
  async findOne(userId: number) {
    const userDetail = await this.myPageRepository.findOne({
      where: { user: { id: userId } },
      //select: ['address', 'wish_list'],
    });
    console.log(userDetail);

    return userDetail;
  }

  //주소 변경
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
  async addToWishList(userId: number, addToWishListDto: AddToWishListDto) {
    const myPage = await this.myPageRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!myPage) {
      throw new NotFoundException(`MyPage with ID ${userId} not found`);
    }

    // 위시리스트에 새로운 아이템을 추가합니다.
    const newWishList = [
      ...(myPage.wish_list || []),
      addToWishListDto.wish_list,
    ];
    myPage.wish_list = newWishList;

    // 업데이트된 엔티티를 저장합니다.
    await this.myPageRepository.save(myPage);
    return myPage;
  }

  // 라이크 스토어에 아이템 추가
  async updateLikeStore(
    userId: number,
    updateMyLikeStoreDto: AddToMyLikeStoreDto,
  ) {
    const myPage = await this.findMyPage(userId);

    // 라이크 스토어에 새로운 아이템을 추가합니다.
    const newLikeStore = [
      ...(myPage.like_store || []),
      updateMyLikeStoreDto.like_store,
    ];
    myPage.like_store = newLikeStore;

    // 업데이트된 엔티티를 저장합니다.
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
