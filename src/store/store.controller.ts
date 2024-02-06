import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { accessTokenGuard } from '../auth/guard/access-token.guard';
import { UserId } from '../auth/decorators/userId.decorator';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MenuService } from '../menu/menu.service';

@Controller('store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly menuService: MenuService,
  ) {}

  //지점 전체 조회
  // @ApiBearerAuth("accessToken")
  // @UseGuards(accessTokenGuard)
  @Get('')
  async storelist() {
    return await this.storeService.storelist();
  }

  @Get('/admin')
  async storefulllist() {
    return await this.storeService.storefulllist();
  }

  //마이페이지 스토어 부분 이름 검색
  @Get('/liststore/:storeid')
  findmypagestorename(@Param('storeid') storeid: number) {
    return this.storeService.StoremypageNameById(storeid);
  }

  //지점 검색 만들기
  @Get('/mypage')
  findmypagestore(@Query('storeName') storeName: string) {
    return this.storeService.findmypagestore(storeName);
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
  @Get('/:storeId')
  async findStoreById(@Param('storeId') storeid: number) {
    return await this.storeService.findstoreByid(storeid);
  }

  //지점 등록
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async createStore(
    @Body() createStoreDto: CreateStoreDto,
    @UserId() userid: number,
    @Body('place') place: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = await this.menuService.uploadImage(file);
    return await this.storeService.createStore(
      createStoreDto,
      userid,
      place,
      url,
    );
  }

  //지점 수정
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Put('/:storeid')
  @UseInterceptors(FileInterceptor('file'))
  async updateStore(
    @Body() updateStoreDto: UpdateStoreDto,
    @Param('storeid') storeid: number,
    @UserId() userid: number,
    @Body('place') place: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = await this.menuService.uploadImage(file);
    return await this.storeService.updateStore(
      updateStoreDto,
      storeid,
      userid,
      place,
      url,
    );
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
