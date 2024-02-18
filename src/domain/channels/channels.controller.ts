import { Controller, Get, Param, Req } from '@nestjs/common';
import { ChannelsService } from './channels.service';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get(':url/channels')
  async getWorkspaceChannels(@Param('url') url, @Req() req) {
    return this.channelsService.getWorkspaceChannels(url, req.user.id);
  }
}
