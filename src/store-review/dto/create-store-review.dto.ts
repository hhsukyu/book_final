import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateStoreReviewDto {
  @IsString()
  @ApiProperty({ description: '내용' })
  content: string;

  @IsNumber()
  @ApiProperty({ description: '별점' })
  rating: number;
}
