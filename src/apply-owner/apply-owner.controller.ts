import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserId } from 'src/auth/decorators/userId.decorator';
import { accessTokenGuard } from 'src/auth/guard/access-token.guard';
import { ApplyOwnerDto } from './dto/applyowner.dto';
import { ApplyOwnerService } from './apply-owner.service';

@Controller('applyowner')
export class ApplyOwnerController {
  constructor(private readonly applyOwnerService: ApplyOwnerService) {}

  //사업자 전환하기 신청폼 제출
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Post('')
  async userToOwner(
    @Body() applyOwnerDto: ApplyOwnerDto,
    @UserId() userid: number,
  ) {
    return await this.applyOwnerService.userToOwner(applyOwnerDto, userid);
  }

  //사장님 신청자 조회
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Get('')
  async getPreOwners() {
    return await this.applyOwnerService.getPreOwners();
  }
  //사장님 신청자 승인
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Put(':userid/:applyownerid')
  async approveOwner(
    @Param('userid') userid: number,
    @Param('applyownerid') applyownerid: number,
  ) {
    return await this.applyOwnerService.approveOwner(userid, applyownerid);
  }
}
