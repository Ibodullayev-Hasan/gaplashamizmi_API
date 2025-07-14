import { IsEmail, IsEnum, IsOptional, IsString, IsUrl, Matches, MaxLength } from "class-validator"
import { chatFont, chatLanguage, chatTheme } from "../../../enums/chat.enum"

export class UpdateUserProfileDto {

	@IsOptional()
	@IsEnum(chatTheme, {
		message: `chat theme must be either light or night`
	})
	chat_theme: chatTheme

	@IsOptional()
	@IsEnum(chatFont, {
		message: `chat font  must be either san-serif`
	})
	chat_font: chatFont

	@IsOptional()
	@IsEnum(chatLanguage, {
		message: `chat language must be either uzbek or english`
	})
	chat_lang: chatLanguage


	@IsOptional()
	@IsUrl({
		require_protocol: true,
		require_host: true,
		require_valid_protocol: true,
		protocols: ['https']
	})
	@Matches(/\.(jpg|jpeg)$/i, { message: 'Rasm faqat .jpg yoki .jpeg formatda bo‘lishi kerak!' })
	chat_back_img: string

	// user
	@IsOptional()
	@IsString()
	@Matches(/^(?!\s*$)[A-Za-z0-9._\p{Emoji_Presentation}\p{Emoji}\p{Extended_Pictographic} ]+$/u, {
		message:
			"full_name faqat harflar (A-Z, a-z), raqamlar (0-9), nuqta (.), pastki chiziq (_), bo‘sh joy ( ), va emojilardan iborat bo‘lishi mumkin!"
	})

	@MaxLength(50, {
		message: "full_name 50 ta belgidan oshmasligi kerak",
	})
	full_name: string;

	@IsOptional()
	@IsEmail({}, { message: "emailni tog'ri kiriting! user@example.com" })
	email: string

	@IsOptional()
	@IsUrl({
		require_protocol: true,
		require_host: true,
		require_valid_protocol: true,
		protocols: ['https']
	})
	@Matches(/\.(jpg|jpeg|png)$/i, { message: 'Rasm faqat .jpg, .jpeg va png formatda bo‘lishi kerak!' })
	avatar_uri: string
}