import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Comment } from './commnet.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  audience: number;

  @OneToMany(() => Comment, comment => comment.movie)
  Comments: Comment[]; // change to uppercase "C"
}
