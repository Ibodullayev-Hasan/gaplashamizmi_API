import { Injectable } from '@nestjs/common';
import { CreateChatSettingDto } from './dto/create-chat-setting.dto';
import { UpdateChatSettingDto } from './dto/update-chat-setting.dto';

@Injectable()
export class ChatSettingsService {
  create(createChatSettingDto: CreateChatSettingDto) {
    return 'This action adds a new chatSetting';
  }

  findAll() {
    return `This action returns all chatSettings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatSetting`;
  }

  update(id: number, updateChatSettingDto: UpdateChatSettingDto) {
    return `This action updates a #${id} chatSetting`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatSetting`;
  }
}
