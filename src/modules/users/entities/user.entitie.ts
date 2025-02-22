import { IUsers } from "src/interfaces/users.interface";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserProfile } from "./user-profiles.entitie";

@Entity({ name: "users" })
export class User implements IUsers {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "text" })
	full_name: string;

	@Column({ type: "text", unique: true })
	email: string;

	@Column({ type: "varchar", length: 13 })
	phone: string;

	@Column({ type: "text" })
	password: string;

	@Column({ type: "varchar", default: true })
	is_active?: boolean;

	@Column({ type: "date" })
	created_at?: Date;

	@Column({ type: "date" })
	updated_at?: Date;

	@OneToOne(() => UserProfile)
	@JoinColumn()
	user_profile?: UserProfile;

}
