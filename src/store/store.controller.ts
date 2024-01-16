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
import { StoreService } from './store.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { accessTokenGuard } from '../auth/guard/access-token.guard';
import { UserId } from '../auth/decorators/userId.decorator';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  //지점 전체 조회
  // @ApiBearerAuth("accessToken")
  // @UseGuards(accessTokenGuard)
  @Get('')
  async storelist() {
    return await this.storeService.storelist();
  }

  //본인 지점 조회
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Get('/mystore')
  findMyStoreById(@UserId() userid: number) {
    return this.storeService.findMystoreByid(userid);
  }

  //지점 상세조회
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Get('/:storeId')
  async findStoreById(@Param('storeId') storeid: number) {
    return await this.storeService.findstoreByid(storeid);
  }

  //지점 등록
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Post('')
  async createStore(
    @Body() createStoreDto: CreateStoreDto,
    @UserId() userid: number,
  ) {
    return await this.storeService.createStore(createStoreDto, userid);
  }

  //지점 수정
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Put('/:storeid')
  async updateStore(
    @Body() updateStoreDto: UpdateStoreDto,
    @Param('storeid') storeid: number,
    @UserId() userid: number,
  ) {
    return await this.storeService.updateStore(updateStoreDto, storeid, userid);
  }

  //지점 삭제 (회원탈퇴시 자동으로 삭제하도록?)
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Delete('/:storeid')
  async deleteStore(
    @Param('storeid') storeid: number,
    @UserId() userid: number,
  ) {
    return await this.storeService.deleteStore(storeid, userid);
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Post('/check')
  async check(@UserId() userid: number) {
    return await this.storeService.check(userid);
  }
}
