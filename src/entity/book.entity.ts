import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { StoreBook } from './store-book.entity';

@Entity({ name: 'book' })
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  book_desc: string;

  @Column()
  writer: string;

  @Column()
  illustrator: string;

  @Column()
  publisher: string;

  @Column()
  publication_date: Date;

  @Column()
  genre: string;

  @Column()
  isbn: number;

  @Column()
  series: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StoreBook, (storebook) => storebook.book)
  storebook: Relation<StoreBook>;
}
