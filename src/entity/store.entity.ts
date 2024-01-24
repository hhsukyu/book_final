import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  Point,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Menu } from './menu.entity';
import { StoreBook } from './store-book.entity';
import { StoreReview } from './storeReview.entity';
import { AdminReview } from './adminReview.entity';

@Entity({
  name: 'store',
})
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.stores)
  admin: Relation<User>;

  @OneToMany(() => StoreBook, (storebook) => storebook.store)
  storebook: Relation<StoreBook>;

  @ManyToOne(() => Store, (store) => store.storebook, { cascade: true })
  store: Relation<Store>;

  @Column()
  store_name: string;

  @Column()
  store_desc: string;

  @Column()
  store_img: string;

  @Column()
  store_address: string;

  @Column({ type: 'point' })
  place: Point;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @OneToMany(() => Menu, (menu) => menu.store)
  menus: Relation<Menu>[];

  @OneToMany(() => AdminReview, (adminReview) => adminReview.store)
  adminReviews: Relation<AdminReview>[];

  @OneToMany(() => StoreReview, (storeReview) => storeReview.store)
  store_reviews: Relation<StoreReview>[];

  @Column()
  store_open: Date;

  @Column()
  store_close: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
