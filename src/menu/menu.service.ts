import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from '../entity/menu.entity';
import { Repository } from 'typeorm';
import { Store } from '../entity/store.entity';
import { User } from '../entity/user.entity';
import { UserService } from '../user/user.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import * as AWS from 'aws-sdk';

@Injectable()
export class MenuService {
  s3 = new AWS.S3();

  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) {}

  //지점 메뉴 조회
  async menulist(storeid: number) {
    const store = await this.storeRepository.findOne({
      where: { id: storeid },
      relations: { menus: true },
    });
    const menulist = store.menus;

    return menulist;
  }

  //메뉴 등록
  async createMyStoreMenu(
    storeid: number,
    userid: number,
    createMenuDto: CreateMenuDto,
    file: Express.Multer.File,
  ) {
    console.log(file);

    const AWS_S3_BUCKET = 'book-image-upload-bucket';

    const params = {
      Bucket: AWS_S3_BUCKET,
      Key: String(file.originalname),
      Body: file.buffer,
      ACL: 'public-read',
    };

    const response = await this.s3.upload(params).promise();
    console.log(response);

    const user = await this.userService.findUserById(userid);
    const store = await this.storeRepository.findOne({
      where: { id: storeid },
    });

    if (user.stores.some((s) => s.id !== store.id)) {
      throw new BadRequestException('소유주만 등록 및 수정이 가능합니다.');
    }

    const menu = await this.menuRepository.save({
      ...createMenuDto,
      food_img: response.Location,
      store: store,
    });

    return menu.food_img;
  }

  //메뉴 수정
  async updateStoreMenu(
    storeid: number,
    menuid: number,
    updateMenuDto: UpdateMenuDto,
    file: Express.Multer.File,
    userid: number,
  ) {
    const AWS_S3_BUCKET = 'book-image-upload-bucket';

    const params = {
      Bucket: AWS_S3_BUCKET,
      Key: String(file.originalname),
      Body: file.buffer,
      ACL: 'public-read',
    };

    const response = await this.s3.upload(params).promise();
    console.log(response);

    const store = await this.storeRepository.findOne({
      where: { id: storeid },
      relations: { menus: true, admin: true },
    });

    const user = await this.userRepository.findOne({
      where: { id: userid },
      relations: { stores: true },
    });

    if (user.stores.some((e) => e.id !== store.id)) {
      throw new BadRequestException('지점 사장님만 수정이 가능합니다.');
    }

    const menu = await this.findmenubyId(menuid);

    if (!menu) {
      throw new BadRequestException('메뉴를 확인해주세요');
    }

    await this.menuRepository.update(
      {
        id: menuid,
      },
      {
        ...updateMenuDto,
        food_img: response.Location,
      },
    );

    return { message: '메뉴 정보가 수정되었습니다.' };
  }

  //메뉴 삭제
  async deleteStoreMenu(storeid: number, menuid: number, userid: number) {
    const user = await this.userRepository.findOne({
      where: { id: userid },
      relations: { stores: true },
    });

    const store = await this.storeRepository.findOne({
      where: { id: storeid },
    });
    const isMenu = await this.findmenubyId(menuid);

    if (user.stores.some((e) => e.id !== store.id)) {
      throw new BadRequestException('지점 사장님만 삭제가 가능합니다.');
    }

    if (!isMenu) {
      throw new BadRequestException('메뉴를 확인해주세요');
    }

    const result = await this.menuRepository.delete({ id: menuid });

    return result;
  }

  async findmenubyId(menuid: number) {
    return await this.menuRepository.findOne({
      where: { id: menuid },
    });
  }
}
