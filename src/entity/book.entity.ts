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
  publication_date: string;

  @Column({ nullable: true })
  genre: string;

  @Column()
  isbn: string;

  @Column()
  setisbn: string;

  @Column()
  fnshYn: string;

  @Column()
  book_image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StoreBook, (storebook) => storebook.book)
  storebook: Relation<StoreBook>;
}
