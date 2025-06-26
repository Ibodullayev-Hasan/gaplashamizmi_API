import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";
import { UserRole } from "../../../enums/roles.enum";

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	@Matches(/^(?!\s*$)[A-Za-z0-9._\p{Emoji_Presentation}\p{Emoji}\p{Extended_Pictographic} ]+$/u, {
		message:
			"full_name faqat harflar (A-Z, a-z), raqamlar (0-9), nuqta (.), pastki chiziq (_), bo‘sh joy ( ), va emojilardan iborat bo‘lishi mumkin!"
	})

	@MaxLength(50, {
		message: "full_name 50 ta belgidan oshmasligi kerak",
	})
	full_name: string;

	@IsNotEmpty()
	@IsEmail({},{message:"emailni tog'ri kiriting! user@example.com"})
	email: string

	@IsNotEmpty()
	@IsString()
	@Length(6, 12, { message: "parol min-6, max-12 bolishi mumkin" })
	@Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=(?:.*\d){4,})[A-Za-z\d@#$!&]{6,12}$/, {
		message: `parol kamida 1 ta katta harf, 1 ta kichik harf, 4 ta raqam bo'lishi kerak! A1234a`
	})
	password: string;

	@IsOptional()
	@IsEnum(UserRole, {
		message: `role must be either ADMIN or USER`
	})
	role?: string

}
