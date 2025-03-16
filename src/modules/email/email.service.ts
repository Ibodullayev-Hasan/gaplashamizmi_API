import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { EmailCodeDto } from "./dto/email.dto";
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";
import { Cache } from "cache-manager";

@Injectable()
export class EmailService {
	constructor(
		@Inject('MAIL_TRANSPORTER') private transporter: nodemailer.Transporter,
		@Inject('CACHE_MANAGER') private cacheManager: Cache,
		private configService: ConfigService
	) { }


	// send code
	async sendVerificationCode(email: string): Promise<{ message: string }> {
		try {
			const ttl = this.configService.get<number>('CACHE_TTL');

			const code: string = Math.floor(Math.random() * 900000 + 100000).toString()

			// ikkisini birda bajarish(async ishlash)
			await Promise.all([

				this.cacheManager.set(email, code, ttl * 1000),

				this.transporter.sendMail({
					from: `"GAPLASHAMIZMI 😄" <ibodullayev297@gmail.com>`,
					to: email,
					subject: 'Tasdiqlash Kodi (no-reply)',
					text: `Sizning tasdiqlash kodingiz: ${code}`,
					html: `<div style="
                          font-family: Arial, sans-serif;
                           background-color: #f4f4f4;
                          padding: 20px;
                          text-align: center;
                          border-radius: 8px;
                          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                          max-width: 400px;
                          margin: auto;
                      ">
                          <h2 style="color: #4CAF50; margin-bottom: 10px;">Tasdiqlash Kodingiz</h2>
                          <p style="color: #333; font-size: 16px;">
                              <b style="font-size: 22px; color: #e91e63;">${code}</b>
                          </p>
                          <p style="color: #555; font-size: 14px;">
                              Ushbu kodni kerakli joyga kiriting va emailingizni tasdiqlang! 😊
                          </p>
                      </div>
                            `,
				})

			])

			return { message: "Tasdiqlash kodi yuborildi!" };
		} catch (error) {
			throw error instanceof HttpException
				? error
				: new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}

	// verify code
	async verifyCode(emailCodeDto: EmailCodeDto): Promise<{ message: string }> {
		try {
			const { email, code } = emailCodeDto;
			const ttl = this.configService.get<number>('CACHE_TTL');

			const savedCode = await this.cacheManager.get(email);

			if (!savedCode) throw new HttpException('The code has expired or is not available', HttpStatus.BAD_REQUEST);

			if (savedCode !== code.trim()) throw new HttpException('Invalid code!', HttpStatus.BAD_REQUEST);

			await Promise.all([
				this.cacheManager.del(email),
				this.cacheManager.set(`true-${email}`, `true-email`, ttl * 1000)
			])

			return { message: `Email verified succssfully` }
		} catch (error: any) {
			throw error instanceof HttpException
				? error
				: new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}

	}
}