import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsNumber } from 'class-validator';

export class CreateStoreBookDto {
  // @IsNumber()
  // @ApiProperty({ description: 'book id' })
  // book_id: number;

  // @IsNumber()
  // @ApiProperty({ description: 'store id' })
  // store_id: number;

  @IsBoolean()
  @ApiProperty({ description: '대여여부' })
  rent: boolean;

  @IsString()
  @ApiProperty({ description: 'setisbn' })
  setisbn: string;
}
