import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
//import { Book } from './book.entity';
import { User } from './user.entity';

@Entity()
export class BookReview {
  @PrimaryGeneratedColumn()
  reviewid: number;

  @Column({ name: 'book_id' })
  bookid: number;

  @Column({ name: 'user_id' })
  userid: number;

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
