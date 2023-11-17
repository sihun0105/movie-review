import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/user/dto/login.dto';
import { JoinDto } from 'src/user/dto/Join.dto';
import { RefreshDto } from 'src/user/dto/refreshToken.dto';
import { JwtAuthGuard } from './JwtAuthGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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
    return this.authService.create(
      JoinDto.email,
      JoinDto.password,
      JoinDto.nickname,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Body() refreshToken: RefreshDto) {
    return this.authService.refresh(refreshToken);
  }
}
