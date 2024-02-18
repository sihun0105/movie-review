import { PrismaService } from '@/lib/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelsService {
  constructor(private readonly prismaService: PrismaService) {}
  async getWorkspaceChannels(url: string, userId: string) {
    return true;
  }
}
