import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity({name : "user"})
export class User {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;
    @Column('varchar', { name: 'email', unique: true, length: 30 })
    email: string;
    @Column('varchar', { name: 'nickname', length: 30 })
    nickname: string;
    @Column('varchar', { name: 'password', length: 100, select: true })
    password: string;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date | null;
  }
  