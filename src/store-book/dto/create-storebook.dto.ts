import { IsBoolean, IsString, IsNumber } from 'class-validator';

export class CreateStoreBookDto {
  @IsNumber()
  book_id: number;

  @IsNumber()
  store_id: number;

  @IsBoolean()
  rent: boolean;

  @IsString()
  setisbn: string;
}
