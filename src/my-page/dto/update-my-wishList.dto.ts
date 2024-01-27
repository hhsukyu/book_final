import { IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateMyWishListDto {
  @IsArray()
  @IsOptional()
  wish_list: string[] = [];

  @IsArray()
  @IsOptional()
  like_store: string[] = [];
}
