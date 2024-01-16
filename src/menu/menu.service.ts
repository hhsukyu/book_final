import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from '../entity/menu.entity';
import { Repository } from 'typeorm';
import { Store } from '../entity/store.entity';
import { User } from '../entity/user.entity';
import { UserService } from '../user/user.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
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

    console.log(store.menus);

    return menulist;
  }

  //메뉴 등록
  async findMyStoreMenu(
    storeid: number,
    userid: number,
    createMenuDto: CreateMenuDto,
  ) {
    const user = await this.userService.findUserById(userid);
    const store = await this.storeRepository.findOne({
      where: { id: storeid },
    });

    if (user.stores.some((s) => s.id !== store.id)) {
      throw new BadRequestException('소유주만 등록 및 수정이 가능합니다.');
    }

    const menu = await this.menuRepository.save({
      ...createMenuDto,
      store: store,
    });

    return menu;
  }

  //메뉴 수정
  async updateStoreMenu(
    storeid: number,
    menuid: number,
    updateMenuDto: UpdateMenuDto,
  ) {
    const store = await this.storeRepository.findOne({
      where: { id: storeid },
      relations: { menus: true },
    });

    const menu = await this.findmenubyId(menuid);

    if (store.menus.some((s) => s.id !== menu.id)) {
      throw new BadRequestException('해당 지점 사장님만 수정이 가능합니다.');
    }

    await this.menuRepository.update(
      {
        id: menuid,
      },
      {
        ...updateMenuDto,
      },
    );

    return { message: '메뉴 정보가 수정되었습니다.' };
  }

  //메뉴 삭제
  async deleteStoreMenu(storeid: number, menuid: number) {
    const store = await this.storeRepository.findOne({
      where: { id: storeid },
      relations: { menus: true },
    });
    const isMenu = await this.findmenubyId(menuid);

    if (store.menus.some((s) => s.id !== isMenu.id)) {
      throw new BadRequestException('해당 지점 사장님만 수정이 가능합니다.');
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
