import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Store } from './store.entity';
// import { AdminReview } from './adminReview.entity.ts';

@Entity({
  name: 'store_review', // 데이터베이스 테이블의 이름
})
export class StoreReview {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Store, (store) => store.store_reviews)
  store_id: Relation<Store>;

  @ManyToOne(() => User, (user) => user.store_reviews)
  user_id: Relation<User>;

  @Column()
  content: string;

  @Column()
  rating: number;

  // @OneToMany(() => admin_review, (admin_review) => admin_review.admin)
  // admin_review: Relation<admin_review>[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
