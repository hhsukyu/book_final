import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Notification {
  save() {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sort: string;

  @Column({ nullable: true })
  book_id: number;

  @Column({ nullable: true })
  store_id: number;

  @Column({ nullable: true })
  message: string; // 알림 메시지

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.notifications, {
    nullable: true,
    onDelete: 'CASCADE',
  }) // 다대일 관계 설정
  user: User;
}
