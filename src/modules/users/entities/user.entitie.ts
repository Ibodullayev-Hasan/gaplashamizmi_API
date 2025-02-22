import { IUsers } from "src/interfaces/users.interface";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserProfile } from "./user-profiles.entitie";
import { SavedMessages } from "./saved-messages.entitie";

@Entity({ name: "users" })
export class User implements IUsers {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 100 })
	full_name: string;

	@Column({ type: "text", unique: true })
	email: string;

	@Column({ type: "varchar", length: 13 })
	phone: string;

	@Column({ type: "text" })
	password: string;

	@Column({ type: "boolean", default: true })
	is_active?: boolean;

	@CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at?: Date;

	@UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	updated_at?: Date;

	@OneToOne(() => UserProfile)
	@JoinColumn()
	user_profile?: UserProfile;

	@OneToOne(() => SavedMessages)
	@JoinColumn()
	saved_messages?: SavedMessages;
}
