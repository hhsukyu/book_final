import { Role } from '../user/types/userRole.type';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Store } from './store.entity';
import { LoginType } from '../user/types/login.type';
import { StoreReview } from './storeReview.entity';
import { BookReview } from './bookreview.entity';
import { MyPage } from './my-page.entity';
// import { ReceiptAuth } from './receiptAuth.entity';
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
  photo: string;

  @Column()
  nickname: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  age?: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @Column({ type: 'enum', enum: LoginType, default: LoginType.Email })
  loginType: LoginType;

  @OneToMany(() => Store, (store) => store.admin, { cascade: true })
  stores: Relation<Store>[];

  @OneToMany(() => StoreReview, (storeReview) => storeReview.user)
  store_reviews: Relation<StoreReview>[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => BookReview, (bookReview) => bookReview.user)
  bookReviews: BookReview[];

  @OneToOne(() => MyPage, (myPage) => myPage.user)
  @JoinColumn()
  myPage: MyPage;

  // @OneToMany(() => ReceiptAuth, (receiptAuth) => receiptAuth.user)
  // receiptAuths: ReceiptAuth[];
}
