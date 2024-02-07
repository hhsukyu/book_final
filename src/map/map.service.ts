import { Injectable } from '@nestjs/common';
import { StoreService } from '../store/store.service';

@Injectable()
export class MapService {
  constructor(private readonly storeService: StoreService) {}
  async findNearCafe(location: string) {
    const radiusNo = 3; //반경 3km 이내 점포 반환
    const storeList = await this.storeService.storelist();
    const nearCafe = [];
    const locationData = location.split(' ');
    const longitude = Number(locationData[0].substring(6));
    const latitude = Number(locationData[1].slice(0, -1));

    storeList.forEach((element) => {
      if (!element.place) return [];
      const newplace = String(element.place).split(' ');
      const newlongitude = Number(newplace[0].substring(6));
      const newlatitude = Number(newplace[1].slice(0, -1));
      // console.log(
      //   this.getDistance([longitude, latitude], [newlongitude, newlatitude]),
      // );
      if (
        radiusNo >=
        this.getDistance([longitude, latitude], [newlongitude, newlatitude])
      ) {
        nearCafe.push(element);
      }
    });
    return nearCafe;
  }

  async findNearCafeSearch(location: string, keyword: string) {
    const nearCafe = await this.findNearCafe(location);
    const haveCafe = [];
    nearCafe.forEach(async (cafe) => {
      const bookList = await cafe.storebook; //보유 도서 불러오기
      let check = 0;
      //보유 도서에 키워드 존재하는지 여부 검색
      bookList.foreach((book) => {
        if (book.includes(keyword)) check = 1;
      });
      if (check === 1) haveCafe.push(cafe);
    });

    return haveCafe;
  }

  deg2rad(deg: number) {
    return (deg * Math.PI) / 180.0;
  }

  getDistance(point1: number[], point2: number[]) {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(point2[1] - point1[1]); //위도
    const dLon = this.deg2rad(point2[0] - point1[0]); //경도
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(point1[1])) *
        Math.cos(this.deg2rad(point2[1])) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
