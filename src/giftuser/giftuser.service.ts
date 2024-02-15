import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userGift } from 'src/entity/usergift.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateGifusertDto } from './dto/create-usergift.dto';

@Injectable()
export class GiftuserService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(userGift)
    private readonly giftuserRepository: Repository<userGift>,
  ) {}

  async giftuserlist(userid: number) {
    const user = await this.userService.findUserById(userid);

    const result = await this.giftuserRepository.find({
      relations: { user: true },
      where: { user: { id: user.id } },
    });

    console.log(user);
    console.log(result);

    return result;
  }

  async giftuseradd(userid: number, createGiftuserdto: CreateGifusertDto) {
    const user = await this.userService.findUserById(userid);

    const result = await this.giftuserRepository.save({
      ...createGiftuserdto,
      user: user,
    });

    return result;
  }
}
