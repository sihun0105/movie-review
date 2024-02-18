import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { PrismaService } from '@/lib/prisma/prisma.service';

@Module({
  controllers: [ChannelsController],
  providers: [ChannelsService, PrismaService],
})
export class ChannelsModule {}
