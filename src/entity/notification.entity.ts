import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  전체알림 = '전체알림',
  입고알림 = '입고알림',
  지점공지 = '지점공지',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.전체알림, // 기본값
  })
  sort: NotificationType; // 타입을 NotificationType으로 변경

  @Column({ nullable: true })
  book_id: number;

  @Column({ nullable: true })
  store_id: number;

  @Column({ nullable: true })
  from: number; // 메시지 작성자 //로그인accesstoken을 통해서 불러옴

  @ManyToOne(() => User, (user) => user.notifications, {
    nullable: true,
    onDelete: 'CASCADE',
  }) // 다대일 관계 설정
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User; //알림 타겟

  @Column({ nullable: true })
  message: string; // 알림 메시지

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
