import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/entities";
import * as CryptoJS from 'crypto-js';

@Injectable()
export class TokenGenerator {
	private jwtSecretKey: string;
	private aesKey: string;
	private accessTime: string;
	private refreshTime: string;

	constructor(private readonly jwtService: JwtService) {
		this.jwtSecretKey = process.env.SECRET_KEY || '';
		this.aesKey = process.env.AES_KEY || '';
		this.accessTime = process.env.JWT_ACCESS_EXPIRES_TIME || '15m';
		this.refreshTime = process.env.JWT_REFRESH_EXPIRES_TIME || '7d';
	}

	async generator(user: User)
		: Promise<{
			accToken: string,
			accessExpiresIn: string,
			refToken: string,
			refreshExpiresIn: string
		}> {
		try {
			if (!this.jwtSecretKey || !this.aesKey) {
				throw new HttpException('Missing secret keys', HttpStatus.INTERNAL_SERVER_ERROR);
			}

			const payload = { sub: user.id, email: user.email };

			const [accToken, refToken] = await Promise.all([
				this.jwtService.signAsync(payload, { secret: this.jwtSecretKey, expiresIn: this.accessTime, algorithm: "HS512" }),
				this.jwtService.signAsync(payload, { secret: this.jwtSecretKey, expiresIn: this.refreshTime, algorithm: "HS512" }),
			]);

			// JWT'ni AES-256 bilan shifrlash (string formatga o'tkazish)
			const encryptedAccToken = CryptoJS.AES.encrypt(accToken, this.aesKey).toString();
			const encryptedRefToken = CryptoJS.AES.encrypt(refToken, this.aesKey).toString();

			// vaqt qo'shish
			const accessDate = new Date();
			accessDate.setMinutes(accessDate.getMinutes() + Number(this.accessTime.split("")[0]));

			const refreshDate = new Date();
			refreshDate.setDate(refreshDate.getDate() + Number(this.refreshTime.split("")[0]));

			return {
				accToken: encryptedAccToken,
				accessExpiresIn: accessDate.toLocaleString(), // ISO formatda saqlash yaxshiroq
				refToken: encryptedRefToken,
				refreshExpiresIn: refreshDate.toLocaleString()
			};
		} catch (error: any) {
			throw error instanceof HttpException
				? error
				: new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}
}
