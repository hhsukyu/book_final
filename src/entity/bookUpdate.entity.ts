import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({})
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 150000 })
  pageNo: number;
}
