import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateGiftDto {
  @IsString()
  @ApiProperty({ description: '이름' })
  gift_name: string;

  @IsString()
  @ApiProperty({ description: '기프트카드 설명' })
  gift_desc: string;

  @IsString()
  @ApiProperty({ description: '사용처' })
  gift_use: string;

  @IsString()
  @ApiProperty({ description: '기프트 가격' })
  gift_price: string;
}
