import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from "nodemailer"

@Injectable()
export class SendEmailService {

    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail', // Gmail xizmatidan foydalanish
            auth: {
                user: `${process.env.MY_EMAIL}`,
                pass: `${process.env.MY_EMAIL_PASS}`,
            },
        });
    }

    async sendEmail(to: string): Promise<string> {
        try {
            let code = Math.floor(Math.random() * 1000000)

            const mailOptions = {
                from: `${process.env.MY_EMAIL}`,
                to,
                subject: `GAPLASHAMIZMI 😉`,
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f9f9f9; width: 600px; margin: 0 auto;">
                        <h1 style="color: #4CAF50; text-align: center;">GAPLASHAMIZMI 😉</h1>
                        <p style="font-size: 16px;">Assalomu alaykum,</p>
                        <p style="font-size: 16px;">Quyidagi kodni ko'rsatilgan joyga kiriting:</p>
                        <div style="background: #f4f4f4; border: 1px solid #ddd; padding: 15px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 16px; color: #444;">
                            <pre style="margin: 0; font-size: 18px; color:darkred;">${code}</pre>
                        </div>
                        <p style="font-size: 14px; color: #666;">Kodning amal qilish muddati: 10 daqiqa.</p>
                        <p style="font-size: 14px; text-align: center; margin-top: 20px; color: #999;">Agar bu sizning so'rovingiz bo'lmasa, e'tiborsiz qoldiring.</p>
                    </div>
                    `
            };

            await this.transporter.sendMail(mailOptions);

            throw new HttpException('Success', HttpStatus.CREATED)
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new HttpException(`Failed to send email: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
