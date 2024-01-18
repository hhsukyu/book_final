import { Role } from '../user/types/userRole.type';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Store } from './store.entity';
import { BookReview } from './bookreview.entity';
@Entity({
  name: 'users', // 데이터베이스 테이블의 이름
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  currentRefreshToken?: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  age: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @OneToMany(() => Store, (store) => store.admin, { cascade: true })
  stores: Relation<Store>[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BookReview, (bookReview) => bookReview.user)
  bookReviews: BookReview[];
}
