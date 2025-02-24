import { User } from "src/entities";

declare module 'express' {
	export interface Request {
		user?: User;
	}
}