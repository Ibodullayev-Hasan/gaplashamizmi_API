import { SavedMessages } from "src/modules/users/entities/saved-messages.entitie";
import { UserProfile } from "src/modules/users/entities/user-profiles.entitie";

export interface IUsers {
	id: string
	full_name: string
	email: string
	// phone: string
	password: string
	is_active?: boolean
	created_at?: Date
	updated_at?: Date
	user_profile?: UserProfile
	saved_messages?:SavedMessages
}
