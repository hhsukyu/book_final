import {
  AfterInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { Store } from './store.entity';
import { Notification } from './notification.entity';

@Entity({
  name: 'storebook',
})
export class StoreBook {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, (book) => book.storebook)
  @JoinColumn({ name: 'book_id', referencedColumnName: 'id' })
  book: Relation<Book>;

  @ManyToOne(() => Store, (store) => store.storebook, { cascade: true })
  @JoinColumn({ name: 'store_id', referencedColumnName: 'id' })
  store: Relation<Store>;

  @Column()
  store_id: number;

  @Column()
  book_id: number;

  @Column()
  rent: boolean;

  @Column()
  setisbn: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
