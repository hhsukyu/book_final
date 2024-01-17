import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StoreReviewService } from './store-review.service';
import { CreateStoreReviewDto } from './dto/create-store-review.dto';
import { UpdateStoreReviewDto } from './dto/update-store-review.dto';

@Controller('store-review')
export class StoreReviewController {
  constructor(private readonly storeReviewService: StoreReviewService) {}

  @Post()
  create(@Body() createStoreReviewDto: CreateStoreReviewDto) {
    return this.storeReviewService.create(createStoreReviewDto);
  }

  @Get()
  findAll() {
    return this.storeReviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeReviewService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStoreReviewDto: UpdateStoreReviewDto,
  ) {
    return this.storeReviewService.update(+id, updateStoreReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeReviewService.remove(+id);
  }
}
