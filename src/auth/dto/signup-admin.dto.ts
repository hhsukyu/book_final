import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateAdminDto } from '../../user/dto/create-admin.dto';

export class SignupAdminDto extends CreateAdminDto {
  @IsString()
  @ApiProperty({ description: '비밀번호 확인' })
  checkPassword: string;
}
