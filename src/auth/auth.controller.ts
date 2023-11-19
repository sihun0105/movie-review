import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JoinDto } from 'src/auth/dto/join-user-dto';
import { JwtAuthGuard } from './JwtAuthGuard';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { LoginUserDto } from './dto/login-user-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginUserDto) {
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
  async refresh(@Body() refreshToken: RefreshTokenDto) {
    return this.authService.refresh(refreshToken);
  }
}
