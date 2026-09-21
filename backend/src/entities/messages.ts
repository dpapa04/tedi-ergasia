import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { User } from "./users";
import { Event } from "./events";

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "senderId" })
  sender!: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "recipientId" })
  recipient!: User;

  @ManyToOne(() => Event, { nullable: true })
  @JoinColumn({ name: "eventId" })
  event?: Event;

  @Column()
  subject!: string;

  @Column({ type: "text" })
  body!: string;

  @Column({ default: false })
  isRead!: boolean;

  @Column({ default: false })
  deletedBySender!: boolean;

  @Column({ default: false })
  deletedByRecipient!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}