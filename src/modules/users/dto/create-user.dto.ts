import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	@Matches(/^(?!\s+$)[A-Za-z1-9._\p{Emoji_Presentation}\p{Emoji}\p{Extended_Pictographic}]+$/u, {
		message:
			"full_name faqat harflar (A-Z, a-z), raqamlar (1-9), nuqta (.), pastki chiziq (_), va emojilardan iborat bo‘lishi mumkin. Bo‘sh bo‘lishi mumkin emas!"
	})
	@MaxLength(100, {
		message: "full_name 100 ta belgidan oshmasligi kerak",
	})
	full_name: string;

	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsNotEmpty()
	@IsString()
	@MaxLength(13, {
		message: "phone 13 ta belgidan oshmasligi kerak",
	})
	@Matches(/^\+998\d{9}$/, {
		message:
			"phone '+998' bilan boshlanishi va undan keyin 9 ta raqam bo‘lishi kerak (masalan: +998901234567)",
	})
	phone: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(6, {
		message: `Minimum 6 ta belgi bo'lsin`
	})
	@MaxLength(8, {
		message: `Maksimum 8 ta belgi bo'lishi mumkin`
	})
	@Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=(?:.*\d){3,})(?=.*[@#$!&])[A-Za-z\d@#$!&]{6,8}$/, {
		message: `password kamida 1 ta katta harf, 1 ta kichik harf, 3 ta raqam va 1 ta belgi (@, #, $, !, & lardan biri) bo'lishi kerak`
	})
	password: string;
}
