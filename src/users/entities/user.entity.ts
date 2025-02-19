import { ApiProperty } from '@nestjs/swagger';
import { IUser } from 'src/interfaces/user.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User implements IUser {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;


    @ApiProperty({
        description: 'The full name of the user',
        example: "Jon Doe"
    })
    @Column({ type: 'varchar', length: 255 })
    full_name: string;


    @ApiProperty({
        description: 'The email of the user',
        example: "Jon@example.com"
    })
    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;


    @ApiProperty({
        description: 'The password of the user',
        example: "Jon8077"
    })
    @Column({ type: 'varchar', length: 60 })
    password: string;


    @ApiProperty({
        description: 'The phone of the user',
        example: "+998991234567"
    })
    @Column({ type: 'varchar', length: 15, unique: true })
    phone: string;
}
