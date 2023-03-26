import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@Index('email', ['email'], { unique: true })
@Entity({ schema: 'DODODODO', name: 'user' })
export class User {
  @ApiProperty({
    example: '1',
    description: '사용자 아이디',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsEmail()
  @ApiProperty({
    example: 'tlgns14@nate.com',
    description: '사용자 이메일',
  })
  @Column('varchar', { name: 'email', unique: true, length: 30 })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '김시후니후니',
    description: '사용자 닉네임',
  })
  @Column('varchar', { name: 'nickname', length: 30 })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '1q2w3e4r',
    description: '사용자 비밀번호',
  })
  @Column('varchar', { name: 'password', length: 100, select: true })
  password: string;

  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
