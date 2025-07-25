import { SavedMessages } from "../modules/users/entities/saved-messages.entity";
import { UserProfile } from "../modules/users/entities/user-profiles.entity";

export interface IUsers {
	id: string
	full_name: string
	avatar_uri?: string
	email: string
	// phone: string
	password: string
	role?: string
	is_active?: boolean
	created_at?: Date
	updated_at?: Date
	user_profile?: UserProfile
	saved_messages?: SavedMessages
}
