import { IUserProfile } from "src/interfaces/user-profile.interface";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { chatFont, chatLanguage, chatTheme } from "src/enums/chat.enum";

@Entity({ name: "userProfile" })
export class UserProfile implements Partial<IUserProfile> {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", default: chatTheme.LIGHT })
	chat_theme?: chatTheme;

	@Column({ type: "varchar", default: chatFont.SANS_SERIF })
	chat_font?: chatFont;


	@Column({ type: "text", default: "https://wallpapers.com/images/hd/dark-city-background-ympe22eapcw8su8e.jpg" })
	chat_back_img?: string;

	@Column({ type: "varchar", length: 15, default: chatLanguage.UZB })
	chat_lang?: chatLanguage;

}