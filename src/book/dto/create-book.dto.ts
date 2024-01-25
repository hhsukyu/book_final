import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDate } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @ApiProperty({ description: '제목' })
  title: string;

  @IsString()
  @ApiProperty({ description: '내용' })
  book_desc: string;

  @IsString()
  @ApiProperty({ description: '그림 작가' })
  illustrator: string;

  @IsString()
  @ApiProperty({ description: '글 작가' })
  writer: string;

  @IsString()
  @ApiProperty({ description: '출판사' })
  publisher: string;

  @IsString()
  @ApiProperty({ description: '출판날짜' })
  publication_date: string;

  @IsString()
  @ApiProperty({ description: '장르' })
  genre: string;

  @IsString()
  @ApiProperty({ description: 'ISBN' })
  isbn: string;

  @IsString()
  @ApiProperty({ description: '시리즈' })
  setisbn: string;

  @IsString()
  @ApiProperty({ description: '완결여부' })
  fnshYn: string;

  @IsString()
  @ApiProperty({ description: '이미지' })
  book_image: string;
}
