import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

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

  @IsDate()
  @ApiProperty({ description: '오픈시간' })
  store_open: Date;

  @IsDate()
  @ApiProperty({ description: '마감시간' })
  store_close: Date;
}
