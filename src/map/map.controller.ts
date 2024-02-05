import { Controller, Get, Param } from '@nestjs/common';
import { MapService } from './map.service';
import { Point } from 'wkx';

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  //주소를 좌표값으로 변환 >> 프론트엔드에서 주소찾기로 주소 받을 때 처리
  //위치값을 현재 Param으로 전달 => 추후 더 나은 방법 있으면 변경

  //주위 매장 값 반환
  @Get('/:location')
  async findNearCafe(@Param('location') location: string) {
    const dataArray = location.split(',');
    const longitude = Number(dataArray[0]); // "126.8652937"
    const latitude = Number(dataArray[1]); //
    const newlocation = new Point(longitude, latitude).toWkt();
    return await this.mapService.findNearCafe(newlocation);
  }

  //보유 도서 기반 주위 매장 값 반환
  @Get('/:location/keyword/:keyword')
  async findNearCafeSearch(
    @Param('location') location: string,
    @Param('keyword') keyword: string,
  ) {
    const dataArray = location.split(',');
    const longitude = Number(dataArray[0]); // "126.8652937"
    const latitude = Number(dataArray[1]); //
    const newlocation = new Point(longitude, latitude).toWkt();
    return await this.mapService.findNearCafeSearch(newlocation, keyword);
  }
}
