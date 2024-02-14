import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { MyPageService } from './my-page.service';
import { AddToWishListDto } from './dto/add-to-wishlist.dto';
import { UpdateMyAddressDto } from './dto/update-my-address.dto';
import { accessTokenGuard } from '../auth/guard/access-token.guard';
import { UserId } from '../auth/decorators/userId.decorator';
import { CreateMyPageDto } from './dto/add-to-address.dto';
import { AddToMyLikeStoreDto } from './dto/add-to-likestore';
import { RemoveFromWishListDto } from './dto/remove-from-wishlist.dto';
import { RemoveFromLikeStoreDto } from './dto/remove-from-likestore';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('마이페이지')
@Controller('mypage')
export class MyPageController {
  constructor(private readonly myPageService: MyPageService) {}

  //마이페이지생성
  @UseGuards(accessTokenGuard)
  @Post('')
  async create(
    @UserId() userId: number,
    //@Body() createMyPageDto: CreateMyPageDto,
  ) {
    return await this.myPageService.create(userId);
  }

  //주소 변경하기
  @UseGuards(accessTokenGuard)
  @Put('address')
  async address_change(
    @UserId() userId: number,
    @Body() updateMyAddressDto: UpdateMyAddressDto,
  ) {
    return await this.myPageService.address_change(userId, updateMyAddressDto);
  }

  //내 주소, 위시리스트 조회
  @UseGuards(accessTokenGuard)
  @Get('')
  async findOne(@UserId() userId: number) {
    return await this.myPageService.findOne(+userId);
  }

  // 위시리스트 추가
  @UseGuards(accessTokenGuard)
  @Post('wishlist')
  async addToWishList(
    @UserId() userId: number,
    @Body() addToWishListDto: AddToWishListDto,
  ) {
    return await this.myPageService.addToWishList(userId, addToWishListDto);
  }

  //특정 위시리스트 삭제
  @UseGuards(accessTokenGuard)
  @Delete('wishlist')
  async removeFromWishList(
    @UserId() userId: number,
    @Body() removeFromWishListDto: RemoveFromWishListDto,
  ) {
    return await this.myPageService.removeFromWishList(
      userId,
      removeFromWishListDto,
    );
  }

  // 라이크 스토어 추가
  @UseGuards(accessTokenGuard)
  @Post('likestore')
  async updateLikeStore(
    @UserId() userId: number,
    @Body() updateMyLikeStoreDto: AddToMyLikeStoreDto,
  ) {
    return await this.myPageService.updateLikeStore(
      userId,
      updateMyLikeStoreDto,
    );
  }

  //특정 라이크 스토어 삭제
  @UseGuards(accessTokenGuard)
  @Delete('likestore')
  async removeFromLikeStore(
    @UserId() userId: number,
    @Body() removeFromLikeStoreDto: RemoveFromLikeStoreDto,
  ) {
    return await this.myPageService.removeFromLikeStore(
      userId,
      removeFromLikeStoreDto,
    );
  }
}
