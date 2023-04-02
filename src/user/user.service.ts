import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOne(email: string) {
    return this.userRepository.findOne({ where : {email} });
  }

  async findOneByRefreshToken(refreshToken: string) {
    return this.userRepository.findOne({ where : {refreshToken} });
  }

  async updateRefreshToken(user: User) {
    const refreshToken = uuidv4();
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);
    return refreshToken;
  }

  async create(email: string, password: string,nickname:string) {
    const hashedPassword = await hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      nickname
    });
    return this.userRepository.save(user);
  }
}
