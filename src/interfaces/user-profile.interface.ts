import { chatFont, chatLanguage, chatTheme } from "src/enums/chat.enum";

export interface IUserProfile {
	id: string
	chat_theme: chatTheme
	chat_font: chatFont
	chat_back_img: string
	chat_back_color: string
	chat_lang: chatLanguage
}