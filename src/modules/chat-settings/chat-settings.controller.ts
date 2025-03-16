import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatSettingsService } from './chat-settings.service';
import { CreateChatSettingDto } from './dto/create-chat-setting.dto';
import { UpdateChatSettingDto } from './dto/update-chat-setting.dto';

@Controller('chat-settings')
export class ChatSettingsController {
  constructor(private readonly chatSettingsService: ChatSettingsService) {}

  @Post()
  create(@Body() createChatSettingDto: CreateChatSettingDto) {
    return this.chatSettingsService.create(createChatSettingDto);
  }

  @Get()
  findAll() {
    return this.chatSettingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatSettingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatSettingDto: UpdateChatSettingDto) {
    return this.chatSettingsService.update(+id, updateChatSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatSettingsService.remove(+id);
  }
}
