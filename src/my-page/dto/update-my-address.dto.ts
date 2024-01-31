import { IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateMyAddressDto {
  @IsString()
  address: string;
}
