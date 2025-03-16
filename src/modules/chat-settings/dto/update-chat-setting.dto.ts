import { PartialType } from '@nestjs/mapped-types';
import { CreateChatSettingDto } from './create-chat-setting.dto';

export class UpdateChatSettingDto extends PartialType(CreateChatSettingDto) {}
