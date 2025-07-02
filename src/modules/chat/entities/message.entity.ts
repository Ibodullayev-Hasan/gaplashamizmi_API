import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from '../../../entities';
import { MessageType } from '../../../enums/message-type.enum';


@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column("uuid")
  senderId: string;

  @Column({ type: "text", default: null })
  text?: string

  @Column({ type: 'enum', enum: MessageType, default: MessageType.TEXT })
  type?: MessageType;

  @ManyToOne(() => Chat, (chat) => chat.message)
  chat: Chat;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;
}
