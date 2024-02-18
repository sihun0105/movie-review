import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async verifyNickname(nickname: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        nickname,
      },
    });
    if (user) {
      return true;
    }
    return false;
  }
}
