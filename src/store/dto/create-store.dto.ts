import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
// import { Point } from 'wkx';

export class CreateStoreDto {
  @IsString()
  @ApiProperty({ description: '지점명' })
  store_name: string;

  @IsString()
  @ApiProperty({ description: '지점소개' })
  store_desc: string;

  @IsString()
  @ApiProperty({ description: '지점위치' })
  store_address: string;

  // @IsNumber({}, { each: true })
  // @ApiProperty({ description: '지점좌표' })
  // place: Point;

  @IsString()
  @ApiProperty({ description: '오픈시간' })
  store_open: string;

  @IsString()
  @ApiProperty({ description: '마감시간' })
  store_close: string;
}
