import { Module } from '@nestjs/common';
import { ChatSettingsService } from './chat-settings.service';
import { ChatSettingsController } from './chat-settings.controller';

@Module({
  controllers: [ChatSettingsController],
  providers: [ChatSettingsService],
})
export class ChatSettingsModule {}
