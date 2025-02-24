import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
	// @IsNotEmpty()
	// @IsString()
	// @Length(13, 13, {
	// 	message: "phone 13 ta belgidan oshmasligi kerak",
	// })
	// @Matches(/^\+998\d{9}$/, {
	// 	message:
	// 		"phone '+998' bilan boshlanishi va undan keyin 9 ta raqam bo‘lishi kerak (masalan: +998901234567)",
	// })
	// phone: string;
}
