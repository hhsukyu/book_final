import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({
  name: 'user_gift',
})
export class userGift {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gift_name: string;

  @Column({ type: 'text' })
  gift_desc: string;

  @Column()
  gift_price: string;

  @Column()
  gift_use: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.giftcard)
  user: Relation<User>;
}
