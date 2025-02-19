import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class SignInDto {
    @ApiProperty({
        description: 'This is user email',
        example: "JonDoe@example.com",
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'This is user password',
        example: "JonParol212",
    })
    @IsStrongPassword({
        minLength: 4, // Minimal uzunlik
        minLowercase: 1, // Kamida 1 ta kichik harf
        minUppercase: 1, // Kamida 1 ta katta harf
        minNumbers: 1,   // Kamida 1 ta raqam
        minSymbols: 0,   // Maxsus belgilarsiz
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}

