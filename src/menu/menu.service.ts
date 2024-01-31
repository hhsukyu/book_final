import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from '../entity/menu.entity';
import { Repository } from 'typeorm';
import { Store } from '../entity/store.entity';
import { User } from '../entity/user.entity';
import { UserService } from '../user/user.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class MenuService {
  private readonly storage: Storage;
  private readonly bucket: string;

  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.storage = new Storage({
      projectId: `${this.configService.get('GOOGLE_PROJECTID')}`,
      keyFilename: `${this.configService.get('KEYFILE')}`,
    });
    this.bucket = `${this.configService.get('GOOGLE_BUCKET_NAME')}`;
  }

  //지점 메뉴 조회
  async menulist(storeid: number) {
    const store = await this.storeRepository.findOne({
      where: { id: storeid },
      relations: { menus: true },
    });
    const menulist = store.menus;

    return menulist;
  }

  //특정 메뉴 조회
  async storemenudetail(storeid: number, menuid: number) {
    const store = await this.storeRepository.findOne({
      where: { id: storeid },
      relations: { menus: true },
    });

    if (store) {
      const menu = store.menus.find((menu) => menu.id === menuid);
      if (menu) {
        // 메뉴를 찾았을 때의 처리
        return menu;
      } else {
        // 메뉴를 찾지 못했을 때의 처리
        console.log('해당 메뉴를 찾을 수 없습니다.');
      }
    } else {
      // 스토어를 찾지 못했을 때의 처리
      console.log('해당 스토어를 찾을 수 없습니다.');
    }
  }

  //메뉴 등록
  async createMyStoreMenu(
    storeid: number,
    userid: number,
    createMenuDto: CreateMenuDto,
    url: string,
  ) {
    const user = await this.userService.findUserById(userid);
    const store = await this.storeRepository.findOne({
      where: { id: storeid },
    });

    if (user.stores.every((s) => s.id !== store.id)) {
      throw new BadRequestException('소유주만 등록 및 수정이 가능합니다.');
    }

    const menu = await this.menuRepository.save({
      ...createMenuDto,
      food_img: url,
      store: store,
    });

    return menu.food_img;
  }

  //메뉴 수정
  async updateStoreMenu(
    storeid: number,
    menuid: number,
    updateMenuDto: UpdateMenuDto,
    url: string,
    userid: number,
  ) {
    const store = await this.storeRepository.findOne({
      where: { id: storeid },
      relations: { menus: true, admin: true },
    });

    const user = await this.userRepository.findOne({
      where: { id: userid },
      relations: { stores: true },
    });

    if (user.stores.every((e) => e.id !== store.id)) {
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
        food_img: url,
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

    if (user.stores.every((e) => e.id !== store.id)) {
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

  // 이미지 업로드 구글 스토리지
  async uploadImage(file: Express.Multer.File): Promise<string> {
    console.log(file);
    const fileName = Date.now() + file.originalname;
    const bucket = this.storage.bucket(this.bucket);

    const blob = bucket.file(fileName.replace(/ /g, '_'));

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      public: true,
    });

    blobStream.end(file.buffer);

    console.log(blobStream.on);
    return new Promise((resolve, reject) => {
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      });

      blobStream.on('error', (err) => {
        reject(err);
      });
    });
  }
}
