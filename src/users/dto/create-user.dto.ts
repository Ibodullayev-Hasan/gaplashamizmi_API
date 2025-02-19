import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length, IsNotEmpty, Matches, IsStrongPassword } from 'class-validator';

export class CreateUserDto {

    @ApiProperty({
        description: 'The full name of the user',
        example: "Jon Doe"
    })
    @Matches(/^[a-zA-Z0-9\s\-_]+$/i, {
        message: 'Full name can only contain letters, numbers, spaces, dashes, and underscores. Emojis and empty spaces are not allowed.',
    })
    @Matches(/.*\S.*/, {
        message: 'Full name cannot consist only of spaces.',
    })
    @IsString()
    @IsNotEmpty()
    full_name: string;


    @ApiProperty({
        description: 'The email of the user',
        example: "Jon@example.com"
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        example: "Jon8077"
    })
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({
        minLength: 4, // Minimal uzunlik
        minLowercase: 1, // Kamida 1 ta kichik harf
        minUppercase: 1, // Kamida 1 ta katta harf
        minNumbers: 1,   // Kamida 1 ta raqam
        minSymbols: 0,   // Maxsus belgilarsiz
    })
    password: string;

    @ApiProperty({
        description: 'The phone of the user',
        example: "+998991234567"
    })
    @IsNotEmpty()
    @IsString()
    @Matches(/^\+998\d{9}$/, {
        message: 'Phone number must be in the format +998XXXXXXXXX',
    })
    phone: string;
    id: number;
}
