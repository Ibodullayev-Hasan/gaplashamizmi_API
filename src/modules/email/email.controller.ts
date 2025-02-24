import { Body, Controller, Post } from "@nestjs/common";
import { EmailService } from "./email.service";
import { EmailCodeDto, EmailDto } from "./dto/email.dto";

@Controller('email')
export class EmailController {
	constructor(
		private readonly emailService: EmailService
	) { }

	@Post('send')
	sendCode(@Body() emailDto: EmailDto) {
		return this.emailService.sendVerificationCode(emailDto.email)
	}

	@Post('verify-code')
	verifyCode(@Body() emailCodeDto: EmailCodeDto) {
		return this.emailService.verifyCode(emailCodeDto)
	}
}