import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Status } from '../types/receiptStatus.type';
export class UpdateReceiptDto {
  @ApiProperty({ description: '상태 변경' })
  @IsNotEmpty({ message: '상태를 입력해주세요' })
  status: Status;
}
