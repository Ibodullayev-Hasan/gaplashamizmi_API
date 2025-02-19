import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendEmailDto {
    @IsEmail()
    @IsNotEmpty()
    to: string;
}
