import { User } from "../database/entities";
import * as multer from 'multer';

declare module 'express' {
	export interface Request {
		user?: User;
	}
}

declare global {
	namespace Express {
		export interface Multer {
			File: multer.File;
		}
	}
}