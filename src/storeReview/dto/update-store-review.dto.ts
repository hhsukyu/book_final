import { PartialType } from '@nestjs/mapped-types';
import { CreateStoreReviewDto } from './create-store-review.dto';

export class UpdateStoreReviewDto extends PartialType(CreateStoreReviewDto) {}
