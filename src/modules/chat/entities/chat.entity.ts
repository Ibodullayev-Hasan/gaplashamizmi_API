import { Entity, PrimaryGeneratedColumn, OneToMany, Column, } from 'typeorm';
import { Message } from './message.entity';


@Entity({ name: 'chat' })
export class Chat {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column("uuid")
	senderId: string

	@Column("uuid")
	receiverId: string

	@OneToMany(() => Message, (messages) => messages.chat)
	message: Message[];
}
