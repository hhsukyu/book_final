import { Injectable } from '@nestjs/common';
import { CreateStoreReviewDto } from './dto/create-store-review.dto';
import { UpdateStoreReviewDto } from './dto/update-store-review.dto';

@Injectable()
export class StoreReviewService {
  create(createStoreReviewDto: CreateStoreReviewDto) {
    return 'This action adds a new storeReview';
  }

  findAll() {
    return `This action returns all storeReview`;
  }

  findOne(id: number) {
    return `This action returns a #${id} storeReview`;
  }

  update(id: number, updateStoreReviewDto: UpdateStoreReviewDto) {
    return `This action updates a #${id} storeReview`;
  }

  remove(id: number) {
    return `This action removes a #${id} storeReview`;
  }
}
