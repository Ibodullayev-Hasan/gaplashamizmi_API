import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class LoginDto {

	@IsNotEmpty()
	@IsEmail({}, { message: "emailni tog'ri kiriting! user@example.com" })
	email: string

	@IsNotEmpty()
	@IsString()
	@Length(6, 12, { message: "parol min-6, max-12 bolishi mumkin" })
	@Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=(?:.*\d){4,})[A-Za-z\d@#$!&]{6,12}$/, {
		message: `parol kamida 1 ta katta harf, 1 ta kichik harf, 4 ta raqam bo'lishi kerak! A1234a`
	})
	password: string;

}