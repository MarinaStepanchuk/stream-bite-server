import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  subscriber_id: number;

  @Column({ nullable: false })
  author_id: number;
}
