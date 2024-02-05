import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserId } from 'src/auth/decorators/userId.decorator';
import { accessTokenGuard } from 'src/auth/guard/access-token.guard';
import { ApplyOwnerDto } from './dto/applyowner.dto';
import { ApplyOwnerService } from './apply-owner.service';

@Controller('apply-owner')
export class ApplyOwnerController {
  constructor(private readonly applyOwnerService: ApplyOwnerService) {}

  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenGuard)
  @Post('')
  async userToOwner(
    @Body() applyOwnerDto: ApplyOwnerDto,
    @UserId() userid: number,
  ) {
    return await this.applyOwnerService.userToOwner(applyOwnerDto, userid);
  }
}
