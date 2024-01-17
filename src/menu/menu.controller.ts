import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { accessTokenGuard } from '..//auth/guard/access-token.guard';
import { UserId } from '../auth/decorators/userId.decorator';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  //지점 메뉴 조회
  @Get('/storeid/:storeid/')
  async menulist(@Param('storeid') storeid: number) {
    return await this.menuService.menulist(storeid);
  }

  //메뉴 등록
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload menu with image.',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The image file to upload.',
        },
        food_name: {
          type: 'string',
          description: 'The name of the menu.',
        },
        food_desc: {
          type: 'string',
          description: 'The description of the menu.',
        },
        food_price: {
          type: 'number',
          description: 'The price of the menu.',
        },
      },
    },
  })
  @Post('/storeid/:storeid')
  @UseInterceptors(FileInterceptor('file'))
  async findMyStoreMenu(
    @Param('storeid') storeid: number,
    @UserId() userid: number,
    @Body() createMenuDto: CreateMenuDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.menuService.createMyStoreMenu(
      storeid,
      userid,
      createMenuDto,
      file,
    );
  }

  //메뉴 수정.
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload menu with image.',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The image file to upload.',
        },
        food_name: {
          type: 'string',
          description: 'The name of the menu.',
        },
        food_desc: {
          type: 'string',
          description: 'The description of the menu.',
        },
        food_price: {
          type: 'number',
          description: 'The price of the menu..,',
        },
      },
    },
  })
  @Patch('/storeid/:storeid/:menuid')
  @UseInterceptors(FileInterceptor('file'))
  async updateStoreMenu(
    @Param('storeid') storeid: number,
    @Param('menuid') menuid: number,
    @Body() updateMenuDto: UpdateMenuDto,
    @UploadedFile() file: Express.Multer.File,
    @UserId() userid: number,
  ) {
    return await this.menuService.updateStoreMenu(
      storeid,
      menuid,
      updateMenuDto,
      file,
      userid,
    );
  }

  //메뉴 삭제
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Delete('/storeid/:storeid/:menuid')
  async deleteStoreMenu(
    @Param('storeid') storeid: number,
    @Param('menuid') menuid: number,
    @UserId() userid: number,
  ) {
    return await this.menuService.deleteStoreMenu(storeid, menuid, userid);
  }
}
