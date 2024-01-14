import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ description: '이메일' })
  email: string;

  @IsString()
  @ApiProperty({ description: '비밀번호' })
  password: string;

  @IsString()
  @ApiProperty({ description: '이름' })
  name: string;

  @IsString()
  @ApiProperty({ description: '핸드폰 번호'})
  phone: string;

  @IsString()
  @ApiProperty({ description: '나이'})
  age: string;

}
