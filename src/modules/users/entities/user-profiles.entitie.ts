import { IUserProfile } from "src/interfaces/user-profile.interface";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { chatFont, chatLanguage, chatTheme } from "src/enums/chat.enum";

@Entity({ name: "userProfile" })
export class UserProfile implements IUserProfile {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar" })
	chat_theme: chatTheme;

	@Column({ type: "varchar" })
	chat_font: chatFont;

	@Column({ type: "varchar" })
	chat_back_color: string;

	@Column({ type: "text" })
	chat_back_img: string;

	@Column({ type: "varchar", length: 15, default: chatLanguage.UZB })
	chat_lang: chatLanguage;
}