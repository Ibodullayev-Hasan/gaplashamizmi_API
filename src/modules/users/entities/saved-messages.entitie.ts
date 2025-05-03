import { ISavedMessages } from "../../../interfaces/saved-messages.interface";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("savedMessages")
export class SavedMessages implements Partial<ISavedMessages> {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "text", nullable: true, default: null })
	saved_text?: string;

	@Column({ type: "text", nullable: true, default: null })
	saved_img_uri?: string;

	@Column({ type: "text", nullable: true, default: null })
	saved_video_uri?: string;

	@Column({ type: "text", nullable: true, default: null })
	saved_audio_uri?: string;
}