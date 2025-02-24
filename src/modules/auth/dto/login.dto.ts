import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {

	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsNotEmpty()
	@IsString()
	@MinLength(6, {
		message: `Minimum 6 ta belgi bo'lsin`
	})
	@MaxLength(8, {
		message: `Maksimum 8 ta belgi bo'lishi mumkin`
	})
	password: string;
}