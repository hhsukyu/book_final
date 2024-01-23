import {
  AfterInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Book } from './book.entity';
import { Store } from './store.entity';
import { Notification } from './notification.entity';

@Entity({
  name: 'book',
})
export class StoreBook {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, (book) => book.storebook)
  book: Relation<Book>;

  @ManyToOne(() => Store, (store) => store.storebook, { cascade: true })
  store: Relation<Store>;

  @Column()
  store_id: number;

  @Column()
  book_id: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @AfterInsert()
  async createNotification() {
    // Store_book가 추가될 때 알림 생성
    const notification = new Notification();
    notification.message = '책이 추가되었습니다.'; // 원하는 알림 메시지로 변경
    notification.user = this.user; // Store_book에 연결된 사용자에게 알림 전송
    await notification.save();
  }
}
