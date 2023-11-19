import { IsEmail, IsNotEmpty } from 'class-validator';

export class JoinDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  nickname: string;
}
