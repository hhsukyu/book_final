import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Store } from './store.entity';
// import { StoreReview } from '.';
@Entity({
  name: 'adminReview',
})
export class AdminReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  storeId: number;

  @Column()
  reviewId: number;

  @Column()
  content: string;

  // 날짜 입력이 안돼서 수정 예정코드
  @Column()
  date: Date;

  @ManyToOne(() => Store, (store) => store.adminReview)
  store: Store[];

  //   @ManyToOne(() => StoreReview, (storeReview) => storeReview.adminReview)
  //   storeReview: Realation<StoreReview>[];
}
