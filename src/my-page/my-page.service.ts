import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MyPage } from '../entity/my-page.entity';
import { AddToWishListDto } from './dto/add-to-wishlist.dto';
import { UpdateMyAddressDto } from './dto/update-my-address.dto';
import { CreateMyPageDto } from './dto/add-to-address.dto';
import { UserService } from '../user/user.service';
import { AddToMyLikeStoreDto } from './dto/add-to-likestore';
import { RemoveFromWishListDto } from './dto/remove-from-wishlist.dto';
import { RemoveFromLikeStoreDto } from './dto/remove-from-likestore';

@Injectable()
export class MyPageService {
  constructor(
    @InjectRepository(MyPage)
    private myPageRepository: Repository<MyPage>,
    //private userService: UserService,
  ) {}

  //회원가입직후 마이페이지 생성
  async create(userId: number) {
    const userDetail = await this.myPageRepository.findOne({
      where: { user: { id: userId } },
    });

    if (userDetail) {
      throw new NotFoundException('주소가 이미 등록되어있습니다');
    }

    const myPage = await this.myPageRepository.save({
      user: { id: userId },
      ...CreateMyPageDto,
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

  // 위시리스트 추가 메서드
  async addToWishList(userId: number, addToWishListDto: AddToWishListDto) {
    const myPage = await this.myPageRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!myPage) {
      throw new NotFoundException(`MyPage with ID ${userId} not found`);
    }

    // 추가하려는 아이템이 이미 wish_list에 존재하는지 확인
    if (
      myPage.wish_list &&
      myPage.wish_list.includes(addToWishListDto.wish_list)
    ) {
      throw new NotFoundException(
        `'${addToWishListDto.wish_list}'서적은 이미 위시리스트에 있습니다.`,
      );
    }

    // 위시리스트에 새로운 아이템을 추가합니다.
    const newWishList = [
      ...(myPage.wish_list || []),
      addToWishListDto.wish_list,
    ];

    // 모든 요소를 숫자로 변환
    const newWishListNumbers = newWishList.map(Number);

    // 숫자 배열 오름차순으로 정렬.
    newWishListNumbers.sort((a, b) => a - b);

    // 다시 문자열 배열러
    const sortedWishList = newWishListNumbers.map(String);

    myPage.wish_list = sortedWishList;

    // 업데이트된 엔티티를 저장합니다.
    await this.myPageRepository.save(myPage);
    return myPage;
  }

  //특정 위시리스트 삭제
  async removeFromWishList(
    userId: number,
    removeFromWishListDto: RemoveFromWishListDto,
  ) {
    const myPage = await this.findMyPage(userId);

    // 제거할 항목이 위시리스트에 있는지 확인하고 제거합니다.
    const updatedWishList = myPage.wish_list.filter(
      (item) => item !== removeFromWishListDto.wish_list,
    );

    myPage.wish_list = updatedWishList;

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

    // 추가하려는 아이템이 이미 like_store 존재하는지 확인
    if (
      myPage.like_store &&
      myPage.like_store.includes(updateMyLikeStoreDto.like_store)
    ) {
      throw new NotFoundException(
        `'${updateMyLikeStoreDto.like_store}'지점은 이미 관심지점에 있습니다.`,
      );
    }

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

  //특정 위시리스트 삭제
  async removeFromLikeStore(
    userId: number,
    removeFromLikeStoreDto: RemoveFromLikeStoreDto,
  ) {
    const myPage = await this.findMyPage(userId);

    // 제거할 항목이 위시리스트에 있는지 확인하고 제거합니다.
    const updatedLikeStores = myPage.like_store.filter(
      (item) => item !== removeFromLikeStoreDto.like_store,
    );

    myPage.like_store = updatedLikeStores;

    // 업데이트된 엔티티를 저장합니다.
    await this.myPageRepository.save(myPage);
    return myPage;
  }

  // MyPage 찾기
  private async findMyPage(userId: number): Promise<MyPage> {
    const myPage = await this.myPageRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!myPage) {
      throw new NotFoundException(`MyPage with ID ${userId} not found`);
    }

    return myPage;
  }
}
