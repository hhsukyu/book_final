import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsArray } from 'class-validator';
import { Column } from 'typeorm';

export class CreateMyPageDto {
  @IsString()
  @ApiProperty({ description: '주소' })
  address: string;

  @IsNumber()
  @ApiProperty({ description: '위도' })
  latitude: number;

  @IsNumber()
  @ApiProperty({ description: '경도' })
  longitude: number;

  @IsArray()
  @ApiProperty({ description: '위시리스트' })
  @IsOptional()
  wish_list: string[] = [];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
