import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gift } from 'src/entity/gift.entity';
import { Repository } from 'typeorm';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UserService } from 'src/user/user.service';
import { UpdateGiftDto } from './dto/update-gift.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { ImpDto } from './dto/imp.dto';

@Injectable()
export class GiftService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Gift)
    private readonly giftRepository: Repository<Gift>,
    private readonly configService: ConfigService,
  ) {}

  async addgift(userId: number, creategiftdto: CreateGiftDto) {
    const user = await this.userService.findUserById(userId);

    if (user.role !== 2) {
      throw new BadRequestException('관리자만 등록이 가능합니다.');
    }

    const result = await this.giftRepository.save({
      ...creategiftdto,
    });

    return result;
  }

  async deletegift(userId: number, giftid: number) {
    const user = await this.userService.findUserById(userId);

    if (user.role !== 2) {
      throw new BadRequestException('관리자만 등록이 가능합니다.');
    }

    const result = await this.giftRepository.delete({ id: giftid });

    return result;
  }

  //조회
  async giftlist() {
    const gift = await this.giftRepository.find();

    return gift;
  }

  //기프트 수정
  async updategift(
    userId: number,
    updateGiftdto: UpdateGiftDto,
    giftid: number,
  ) {
    const user = await this.userService.findUserById(userId);

    if (user.role !== 2) {
      throw new BadRequestException('관리자만 등록이 가능합니다.');
    }

    await this.giftRepository.update(
      {
        id: giftid,
      },
      {
        ...updateGiftdto,
      },
    );
  }

  //기프트 상세 조회
  async giftdetail(giftid: number) {
    const gift = await this.giftRepository.findOne({
      where: { id: giftid },
      select: ['gift_name', 'gift_price', 'gift_desc', 'gift_use'],
    });

    return gift;
  }

  async giftcheck(impdto: ImpDto) {
    const gift = await this.giftRepository.findOne({
      where: { id: impdto.giftid },
    });
    axios
      .post('https://api.iamport.kr/users/getToken', {
        imp_key: `${this.configService.get('PORT_ONE_KEY')}`,
        imp_secret: `${this.configService.get('PORT_ONE_SECRET_API')}`,
      })
      .then(function (response) {
        console.log(response.data);
        const access_token = response.data.response.access_token;
        console.log(access_token);
        axios
          .get(`https://api.iamport.kr/payments/${impdto.imp_uid}`, {
            headers: {
              Authorization: access_token,
            },
          })
          .then(function (response) {
            console.log(response.data);
            const checkgiftinfo = response.data;
            if (gift.gift_price !== `${checkgiftinfo.response.amount}`) {
              throw new BadRequestException('결제 서버에 문제가 있습니다.');
            } else {
              return HttpStatus.OK;
            }
          })
          .catch(function (error) {
            console.log(error);
            throw new BadRequestException('결제 서버에 문제가 있습니다.');
          });
      })
      .catch(function (error) {
        console.log(error);
        throw new BadRequestException('결제 서버에 문제가 있습니다.');
      });
  }
}
