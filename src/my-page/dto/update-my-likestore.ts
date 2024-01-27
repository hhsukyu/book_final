import { IsOptional, IsArray } from 'class-validator';

export class UpdateMyLikeStoreDto {
  @IsArray()
  like_store: string[] = [];
}
