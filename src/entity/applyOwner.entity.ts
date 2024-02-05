import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'applyowner',
})
export class ApplyOwner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  owner_name: string;

  @Column()
  business_license_number: boolean;

  @Column()
  business_location: string;

  @Column()
  photo: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
