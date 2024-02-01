import { IsNumber, IsString } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  // @ApiProperty({ description: '메뉴이름' })
  food_name: string;

  @IsString()
  // @ApiProperty({ description: '메뉴 소개' })
  food_desc: string;

  // @IsString()
  // @ApiProperty({ description: '메뉴 이미지' })
  // food_img: string;

  @IsNumber()
  // @ApiProperty({ description: '메뉴 가격' })
  food_price: number;
}
