import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { MyPageService } from './my-page.service';
import { UpdateMyWishListDto } from './dto/update-my-wishList.dto';
import { UpdateMyAddressDto } from './dto/update-my-address.dto';
import { accessTokenGuard } from '../auth/guard/access-token.guard';
import { UserId } from '../auth/decorators/userId.decorator';
import { CreateMyPageDto } from './dto/create-my-page.dto';
import { UpdateMyLikeStoreDto } from './dto/update-my-likestore';

@Controller('mypage')
export class MyPageController {
  constructor(private readonly myPageService: MyPageService) {}

  @UseGuards(accessTokenGuard)
  @Post('')
  async create(
    @UserId() userId: number,
    @Body() createMyPageDto: CreateMyPageDto,
  ) {
    return await this.myPageService.create(userId, createMyPageDto);
  }

  @UseGuards(accessTokenGuard)
  @Get('')
  async findOne(@UserId() userId: number) {
    return await this.myPageService.findOne(+userId);
  }

  @UseGuards(accessTokenGuard)
  @Patch('address')
  async address_change(
    @UserId() userId: number,
    @Body() updateMyAddressDto: UpdateMyAddressDto,
  ) {
    return await this.myPageService.address_change(userId, updateMyAddressDto);
  }

  // 위시리스트 변경
  @UseGuards(accessTokenGuard)
  @Patch('wishlist')
  async updateWishList(
    @UserId() userId: number,
    @Body() updateMyWishListDto: UpdateMyWishListDto,
  ) {
    return await this.myPageService.updateWishList(userId, updateMyWishListDto);
  }

  // 라이크 스토어 변경
  @UseGuards(accessTokenGuard)
  @Patch('likestore')
  async updateLikeStore(
    @UserId() userId: number,
    @Body() updateMyLikeStoreDto: UpdateMyLikeStoreDto,
  ) {
    return await this.myPageService.updateLikeStore(
      userId,
      updateMyLikeStoreDto,
    );
  }
}
