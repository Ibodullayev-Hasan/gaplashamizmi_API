import { IsEnum, IsOptional, IsUrl, Matches } from "class-validator"
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
		message: `chat language must be either uzb or eng`
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
}