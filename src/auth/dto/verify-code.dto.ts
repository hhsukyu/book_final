import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyCodeDto {
  @IsString()
  @ApiProperty({ description: '인증번호' })
  code: string;

  @IsString()
  @ApiProperty({ description: '이메일' })
  email: string;
}
