import { IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateMyWishListDto {
  @IsArray()
  wish_list: string[] = [];
}
