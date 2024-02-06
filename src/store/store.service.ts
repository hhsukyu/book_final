/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Store } from '../entity/store.entity';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { UserService } from '..//user/user.service';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) {}

  //지점 전체 조회.
  async storelist() {
    const store = await this.storeRepository.find({});

    return store;
  }

  //지점 관리자 전체 조회.
  async storefulllist() {
    const store = await this.storeRepository.find({});

    return store;
  }

  //본인 지점 조회
  async findMystoreByid(userid: number) {
    const user = await this.userService.findUserByIdWithStore(userid);

    if (!user.stores) {
      throw new NotFoundException('존재하지 않는 지점입니다.');
    }

    console.log(user.stores);

    return user.stores;
  }

  //마이페이지 지점 검색
  async findmypagestore(storename: string) {
    const stores = await this.storeRepository.find();

    const result = stores.filter((store) =>
      store.store_name.includes(storename),
    );

    return result;
  }

  //지점 상세 조회
  async findstoreByid(storeid: number) {
    const store = await this.storeRepository.find({
      where: { id: storeid },
      select: [
        'id',
        'store_name',
        'store_desc',
        'store_img',
        'store_address',
        'store_open',
        'store_close',
        'admin',
      ],
    });

    return store;
  }

  //지점 등록
  async createStore(
    createStoreDto: CreateStoreDto,
    userid: number,
    place: string,
    url: string,
  ) {
    const user = await this.userService.findUserById(userid);
    const dataArray = place.split(',');
    const longitude = dataArray[0]; // "126.8652937"
    const latitude = dataArray[1]; //

    console.log(longitude, latitude);
    console.log(place);

    if (user.role === 0) {
      throw new BadRequestException('지점 사장만 지점 생성이 가능합니다.');
    }

    const store = await this.storeRepository.save({
      ...createStoreDto,
      admin: user,
      store_img: url,
    });

    const newPlace = this.storeRepository
      .createQueryBuilder()
      .update()
      .set({
        place: () => `ST_GeomFromText('Point(${longitude} ${latitude})')`,
      })
      .where('id = :id', { id: store.id })
      .execute();

    return store;
  }

  //지점 수정
  async updateStore(
    updateStoreDto: UpdateStoreDto,
    storeid: number,
    userid: number,
    place: string,
    url: string,
  ) {
    const user = await this.userService.findUserById(userid);
    const store = await this.findStoreById(storeid);

    const dataArray = place.split(',');
    const longitude = dataArray[0]; // 경도
    const latitude = dataArray[1]; // 위도

    console.log(longitude, latitude);

    if (user.stores.every((s) => s.id !== store.id)) {
      throw new BadRequestException('지점 사장님만 수정이 가능합니다.');
    }

    await this.storeRepository.update(
      {
        id: storeid,
      },
      {
        ...updateStoreDto,
        store_img: url,
      },
    );

    // 주소가 수정되었을 경우에만 실행
    if (place !== '0,0') {
      const newPlace = this.storeRepository
        .createQueryBuilder()
        .update()
        .set({
          place: () => `ST_GeomFromText('POINT(${latitude} ${longitude})')`,
        })
        .where('id = :id', { id: storeid })
        .execute();
    }

    return { message: '지점 정보가 수정되었습니다.' };
  }

  //지점 삭제
  async deleteStore(storeid: number, userid: number) {
    const user = await this.userService.findUserById(userid);
    const store = await this.findStoreById(storeid);

    if (user.stores.every((s) => s.id !== store.id)) {
      throw new BadRequestException('지점 사장님만 삭제가 가능합니다.');
    }

    const result = await this.storeRepository.delete({ id: storeid });

    return result;
  }

  //체크
  async check(userid: number) {
    const user = await this.userService.findUserById(userid);

    console.log(user);

    if (user.role === 0) {
      console.log('user 로그인 입니다.');
    } else if (user.role === 1) {
      console.log('사장님 로그인 입니다.');
    }
  }

  async findStoreById(storeid: number) {
    return await this.storeRepository.findOne({
      where: { id: storeid },
    });
  }

  async findUserByIdWithStore(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'nickname', 'createdAt', 'updatedAt'],
      relations: { stores: true },
    });
  }

  async StoreNameById(id: number) {
    const store = await this.storeRepository.findOne({ where: { id } });
    return store.store_name;
  }

  //지점 스토어 이름 찾기 함수
  async StoremypageNameById(id: number) {
    const store = await this.storeRepository.findOne({
      where: { id },
      select: ['id', 'store_name'],
    });
    return store;
  }
}
