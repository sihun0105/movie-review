import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';
import { LoginDto } from '../user/dto/login.dto';
import { UserService } from './user.service';
import { JoinDto } from './dto/Join.dto';

@Controller('user')
export class UserController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new HttpException('아이디와 비밀번호를 확인해주세요.', 500);
    }
    return this.authService.login(user);
  }

  @Post('join')
  async join(@Body() JoinDto: JoinDto) {
    return this.userService.create(
      JoinDto.email,
      JoinDto.password,
      JoinDto.nickname,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    console.log(refreshToken);
    return this.authService.refresh(refreshToken);
  }
}
