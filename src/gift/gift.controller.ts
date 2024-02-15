import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GiftService } from './gift.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { accessTokenGuard } from 'src/auth/guard/access-token.guard';
import { UserId } from 'src/auth/decorators/userId.decorator';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';

@ApiTags('(admin) 기프트카트')
@Controller('gift')
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  //기프트 등록
  @ApiBearerAuth('accessToken')
  @Post()
  @UseGuards(accessTokenGuard)
  async addgift(
    @UserId() user_id: number,
    @Body() createGiftdto: CreateGiftDto,
  ) {
    return await this.giftService.addgift(user_id, createGiftdto);
  }

  //기프트 삭제
  @ApiBearerAuth('accessToken')
  @Delete('/giftid')
  @UseGuards(accessTokenGuard)
  async deletegift(@UserId() user_id: number, @Param('giftid') giftid: number) {
    return await this.giftService.deletegift(user_id, giftid);
  }

  //기프트 수정
  @ApiBearerAuth('accessToken')
  @Put('/:giftid')
  @UseGuards(accessTokenGuard)
  async updategift(
    @UserId() user_id: number,
    @Body() updateGiftdto: UpdateGiftDto,
    @Param('giftid') giftid: number,
  ) {
    return await this.giftService.updategift(user_id, updateGiftdto, giftid);
  }

  //기프트 조회
  @Get()
  async giftlist() {
    return await this.giftService.giftlist();
  }

  //기프트 상세조회
  @Get('/:giftid')
  async giftdetail(@Param('giftid') giftid: number) {
    return await this.giftService.giftdetail(giftid);
  }
}
