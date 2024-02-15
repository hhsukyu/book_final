import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GiftuserService } from './giftuser.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { accessTokenGuard } from 'src/auth/guard/access-token.guard';
import { UserId } from 'src/auth/decorators/userId.decorator';
import { CreateGifusertDto } from './dto/create-usergift.dto';

@ApiTags('(user) 기프트카드')
@Controller('giftuser')
export class GiftuserController {
  constructor(private readonly giftuserservice: GiftuserService) {}

  @ApiBearerAuth('accessToken')
  @Get()
  @UseGuards(accessTokenGuard)
  async giftuserlist(@UserId() userid: number) {
    return await this.giftuserservice.giftuserlist(userid);
  }

  @ApiBearerAuth('accessToken')
  @Post()
  @UseGuards(accessTokenGuard)
  async gituseradd(
    @UserId() userid: number,
    @Body() createGiftuserdto: CreateGifusertDto,
  ) {
    return await this.giftuserservice.giftuseradd(userid, createGiftuserdto);
  }

  //사용완료
  //업데이트 예정
}
