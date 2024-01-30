import { IsString } from 'class-validator';

export class RemoveFromWishListDto {
  @IsString()
  wish_list: string;
}
