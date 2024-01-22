import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Book } from './book.entity';
import { Store } from './store.entity';

@Entity({
  name: 'book',
})
export class StoreBook {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, (book) => book.storebook)
  book: Relation<Book>;

  @ManyToOne(() => Store, (store) => store.storebook, { cascade: true })
  store: Relation<Store>;

  @Column()
  store_id: number;

  @Column()
  book_id: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
