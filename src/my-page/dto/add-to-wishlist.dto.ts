import { IsString } from 'class-validator';

export class AddToWishListDto {
  @IsString()
  wish_list: string;
}
