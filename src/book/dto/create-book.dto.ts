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

  @IsDate()
  @ApiProperty({ description: '출판날짜' })
  publication_date: string;

  @IsString()
  @ApiProperty({ description: '장르' })
  genre: string;

  @IsNumber()
  @ApiProperty({ description: 'ISBN' })
  isbn: string;

  @IsNumber()
  @ApiProperty({ description: '시리즈' })
  setisbn: string;
}
