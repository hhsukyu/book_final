import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UserService } from './user.service';
import { accessTokenGuard } from '../auth/guard/access-token.guard';
import { UserId } from '../auth/decorators/userId.decorator';

import { FileInterceptor } from '@nestjs/platform-express';
import { MenuService } from '../menu/menu.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly menuService: MenuService,
  ) {}

  @Get('email')
  findEmail(@Query('email') email: string) {
    return this.userService.findEmail(email);
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Get('')
  findAll() {
    return this.userService.findAll();
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Get('me')
  findUserById(@UserId() id: string) {
    return this.userService.findUserById(+id);
  }

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
        name: {
          type: 'string',
          description: 'The description of the name.',
        },
        phone: {
          type: 'string',
          description: 'The price of the phone,',
        },
        age: {
          type: 'string',
          description: 'The price of the age,',
        },
      },
    },
  })
  @Put('profile')
  @UseInterceptors(FileInterceptor('file'))
  async updateprofile(
    @UserId() userid: number,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = await this.menuService.uploadImage(file);
    return await this.userService.updateUser(userid, updateProfileDto, url);
  }
}
