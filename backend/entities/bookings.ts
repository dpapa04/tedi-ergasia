import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { User } from "./users";
import { Event, TicketType } from "./events";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED"
}

@Entity("bookings")
export class Booking {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "attendeeId" })
  attendee!: User;

  @ManyToOne(() => Event)
  @JoinColumn({ name: "eventId" })
  event!: Event;

  @ManyToOne(() => TicketType)
  @JoinColumn({ name: "ticketTypeId" })
  ticketType!: TicketType;

  @Column({ type: "int" })
  numberOfTickets!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalCost!: number;

  @Column({ type: "enum", enum: BookingStatus, default: BookingStatus.CONFIRMED })
  bookingStatus!: BookingStatus;

  @CreateDateColumn()
  createdAt!: Date;
}