import { IsString } from 'class-validator';

export class RemoveFromLikeStoreDto {
  @IsString()
  like_store: string;
}
