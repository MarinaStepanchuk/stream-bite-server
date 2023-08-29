import { Post } from 'src/post/entities/post.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
