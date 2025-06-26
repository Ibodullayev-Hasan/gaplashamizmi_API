import { IUsers } from "../../../interfaces/users.interface";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserProfile } from "./user-profiles.entity";
import { SavedMessages } from "./saved-messages.entity";
import { Message } from "../../../modules/chat/entities/message.entity";
import { UserRole } from "../../../enums/roles.enum";

@Entity({ name: "users" })
export class User implements IUsers {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 100 })
	full_name: string;

	@Column({ type: "text", default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcZsL6PVn0SNiabAKz7js0QknS2ilJam19QQ&s" })
	avatar_uri?: string;

	@Column({ type: "text", unique: true })
	email: string;

	@Column({ type: "text" })
	password: string;

	@Column({ type: "text", default: UserRole.USER })
	role?: string;

	@Column({ type: "boolean", default: true })
	is_active?: boolean;

	@CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at?: Date;

	@UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	updated_at?: Date;

	@OneToOne(() => UserProfile, { cascade: true, eager: true })
	@JoinColumn()
	user_profile?: UserProfile;

	@OneToOne(() => SavedMessages, { cascade: true, eager: true })
	@JoinColumn()
	saved_messages?: SavedMessages;

	@OneToMany(() => Message, (message) => message.senderId)
	messages: Message[];

}
