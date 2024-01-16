import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

import { CreateAdminReviewDto } from 'src/admin-review/dto/create-adminReview.dto';

export class UpdateAdminReviewDto extends PickType(CreateAdminReviewDto, [
  'content',
]) {
  @IsString()
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  content: string;
}
