import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class EmailCodeDto {
	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsNotEmpty()
	@IsString()
	code: string
}

export class EmailDto {
	@IsNotEmpty()
	@IsEmail()
	email: string
}