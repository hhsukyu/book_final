import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

@Entity()
export class BookReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'float', nullable: true })
  rating: number;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  created_at: Date;

  @ManyToOne(() => Book, (book) => book.bookReviews)
  @JoinColumn({ name: 'book_id', referencedColumnName: 'id' })
  book: Book;

  @ManyToOne(() => User, (user) => user.bookReviews)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
