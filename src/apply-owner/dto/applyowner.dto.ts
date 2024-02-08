import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDate } from 'class-validator';

export class ApplyOwnerDto {
  @IsString()
  @ApiProperty({ description: '대표자' })
  owner_name: string;

  @IsNumber()
  @ApiProperty({ description: '사업자등록번호' })
  business_license_number: number;

  @IsString()
  @ApiProperty({ description: '사업장 소재지' })
  business_location: string;

  @IsString()
  @ApiProperty({ description: '사업장 이름' })
  store_name: string;
}
