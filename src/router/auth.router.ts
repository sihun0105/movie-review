import { Body, ForbiddenError, JsonController, Post } from "routing-controllers";
import LoginDto from "../DTO/LoginDto";
import { User } from "../../models/user.entity";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as redis from "redis";
import { AppDataSource } from "../../models";

@JsonController('/users')
export class AuthController {
  private client: any;

  constructor() {
      this.client = redis.createClient();
    }

  @Post('/login')
  async login(@Body() user: LoginDto) {
    const { email, password } = user;
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    const userdata = await queryRunner.manager
    .getRepository(User)
    .findOne({ where: { email } })
    if (!userdata) {
      throw new Error('User not found');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid password');
    }
    const accessToken = jwt.sign({ userId: userdata.id }, 'access-secret', {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ userId: userdata.id }, 'refresh-secret');
    this.client.set(refreshToken, userdata.id.toString());
    this.client.expire(refreshToken, 60 * 60 * 24 * 30); // 30 days
    return { accessToken, refreshToken };
  }

  @Post('/join')
async register(@Body() user: LoginDto,next?:Function) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  try {
    const { email, password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userdata = await queryRunner.manager
      .getRepository(User)
      .findOne({ where: { email } });
    if (userdata) {
      throw new ForbiddenError('Nooooo this message will be lost');
    }
    const newUser = await queryRunner.manager.getRepository(User).save({
      email,
      password: hashedPassword,
      Nickname: 'test'
    });
    return newUser;
  } catch (error) {
    throw error;
  } finally {
    await queryRunner.release();
  }
}
}
export default AuthController;
