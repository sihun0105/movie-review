import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  async verifyNickname(nickname: string) {
    const user = await this.userService.verifyNickname(nickname);
    if (!user) {
      return true;
    }
    return false;
  }
}
