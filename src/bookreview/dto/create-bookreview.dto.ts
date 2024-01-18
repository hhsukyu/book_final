import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateBookReviewDto {
  @IsString()
  @ApiProperty({ description: '댓글 내용' })
  @IsOptional()
  content?: string;

  @IsNumber()
  @ApiProperty({ description: '별점' })
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number;
}
