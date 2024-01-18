import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminReviewDto {
  @IsString()
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  content: string;
}
