import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  refresh_token: string;

  @IsNotEmpty()
  user_id: number;
}
