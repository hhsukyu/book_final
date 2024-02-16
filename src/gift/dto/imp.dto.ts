import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ImpDto {
  @IsNumber()
  @ApiProperty({ description: '결제상품ID' })
  giftid: number;

  @IsString()
  @ApiProperty({ description: '결제UID' })
  imp_uid: string;
}
