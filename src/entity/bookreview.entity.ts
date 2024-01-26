import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
//import { Book } from './book.entity';
import { User } from './user.entity';

@Entity()
export class BookReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'book_id' })
  book_id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'float', nullable: true })
  rating: number;

  @Column({ type: 'datetime', nullable: true })
  review_date: Date;

  //@ManyToOne(() => Book, (book) => book.bookReviews)
  //book: Book;

  @ManyToOne(() => User, (user) => user.bookReviews)
  user: User;
}
