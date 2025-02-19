import { Module } from '@nestjs/common';
import { SendEmailService } from './send_email.service';
import { EmailController } from './send_email.controller';

@Module({
  providers: [SendEmailService],
  controllers: [EmailController],
  exports: [SendEmailService]
})
export class SendEmailModule { }
