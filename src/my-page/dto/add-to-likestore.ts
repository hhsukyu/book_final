import { IsArray, IsString } from 'class-validator';

export class AddToMyLikeStoreDto {
  @IsString()
  like_store: string;
}
