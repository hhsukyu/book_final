import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminReviewDto {
  @IsString()
  @ApiProperty({ description: '댓글 내용' })
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  content: string;
}
