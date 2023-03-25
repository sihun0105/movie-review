import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '../models/user.entity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as redis from "redis";


@Service()
export class AuthService {
    
private client: any;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    this.client = redis.createClient();
  }

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({where : {email}});
    if (!user) {
      throw new Error('User not found');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid password');
    }
    const accessToken = jwt.sign({ userId: user.id }, 'access-secret', {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ userId: user.id }, 'refresh-secret');
    this.client.set(refreshToken, user.id.toString());
    this.client.expire(refreshToken, 60 * 60 * 24 * 30); // 30 days
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    return new Promise((resolve, reject) => {
      this.client.get(refreshToken, async (err, userId) => {
        if (err) {
          reject(err);
        }
        if (userId) {
          const user = await this.userRepository.findOne(userId);
          if (user) {
            const accessToken = jwt.sign(
              { userId: user.id },
              'access-secret',
              {
                expiresIn: '15m',
              },
            );
            resolve({ accessToken });
          }
        }
    }
    )})
  }}