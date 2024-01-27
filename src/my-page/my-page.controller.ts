import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MyPageService } from './my-page.service';
import { UpdateMyWishListDto } from './dto/update-my-wishlist.dto';
import { UpdateMyAddressDto } from './dto/update-my-address.dto';
import { accessTokenGuard } from '../auth/guard/access-token.guard';
import { UserId } from '../auth/decorators/userId.decorator';
import { CreateMyPageDto } from './dto/create-my-page.dto';

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
  @Put('address')
  async address_change(
    @UserId() userId: number,
    @Body() updateMyAddressDto: UpdateMyAddressDto,
  ) {
    return await this.myPageService.address_change(userId, updateMyAddressDto);
  }

  @UseGuards(accessTokenGuard)
  @Put('wishlist')
  async update(
    @UserId() userId: number,
    @Body() updateMyWishListDto: UpdateMyWishListDto,
  ) {
    return await this.myPageService.wishList_likeStore_change(
      userId,
      updateMyWishListDto,
    );
  }
}
