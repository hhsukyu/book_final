import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from './user.entity';
import { StoreReview } from './storeReview.entity';
import { Menu } from './menu.entity';

@Entity({
  name: 'store',
})
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.store)
  admin: Relation<User>;

  @Column()
  store_name: string;

  @Column()
  store_desc: string;

  @Column()
  store_img: string;

  @Column()
  store_address: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @OneToMany(() => Menu, (menu) => menu.store)
  menus: Relation<Menu>[];

  // @OneToMany(() => AdminReview, (adminReview) => adminReview.store)
  // adminReviews: Relation<AdminReview>[];

  @OneToMany(() => StoreReview, (storeReview) => storeReview.store_id)
  store_reviews: Relation<StoreReview>[];

  @Column()
  store_open: Date;

  @Column()
  store_close: Date;
}
