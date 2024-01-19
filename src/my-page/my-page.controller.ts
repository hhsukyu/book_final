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
import { UpdateMyPageDto } from './dto/update-my-page.dto';
import { accessTokenGuard } from 'src/auth/guard/access-token.guard';
import { UserId } from 'src/auth/decorators/userId.decorator';
import { CreateMyPageDto } from './dto/create-my-page.dto';

@Controller('my-page')
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
  @Put('')
  async update(
    @UserId() userId: number,
    @Body() updateMyPageDto: UpdateMyPageDto,
  ) {
    return await this.myPageService.update(userId, updateMyPageDto);
  }
}
