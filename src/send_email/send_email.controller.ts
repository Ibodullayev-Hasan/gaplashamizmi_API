import { Controller, Post, Body } from '@nestjs/common';
import { SendEmailService } from './send_email.service';
import { SendEmailDto } from './send-email.dto';

@Controller('send-email')
export class EmailController {
  constructor(private readonly emailService: SendEmailService) { }

  @Post('code')
  async sendEmail(@Body() sendEmailDto: SendEmailDto): Promise<string> {
    return await this.emailService.sendEmail(sendEmailDto.to);

  }
}
