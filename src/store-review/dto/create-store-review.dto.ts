import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateStoreReviewDto {
  // @IsString()
  // @ApiProperty({ description: '지점ID' })
  // store_name: string;

  // @IsString()
  // @ApiProperty({ description: '사용자ID' })
  // store_desc: string;

  @IsString()
  @ApiProperty({ description: '내용' })
  store_address: string;

  @IsNumber()
  @ApiProperty({ description: '별점' })
  store_rating: number;
}
