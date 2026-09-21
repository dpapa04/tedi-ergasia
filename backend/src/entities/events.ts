import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./users";
import { Booking } from "./bookings";

export enum EventStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column("simple-array")
  categories!: string[];

  @Column()
  eventType!: string;

  @Column()
  venue!: string;

  @Column()
  address!: string;

  @Column()
  city!: string;

  @Column()
  country!: string;

  @Column({ type: "decimal", precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true })
  longitude?: number;

  @Column({ type: "timestamp" })
  startDateTime!: Date;

  @Column({ type: "timestamp" })
  endDateTime!: Date;

  @Column({ type: "int" })
  capacity!: number;
  
  @OneToMany(() => TicketType, (ticket: TicketType) => ticket.event, { cascade: true })
  ticketTypes!: TicketType[];

  @OneToMany(() => Booking, (booking: Booking) => booking.event)
  bookings!: Booking[];
  
  @ManyToOne(() => User)
  @JoinColumn({ name: "organizerId" })
  organizer!: User;
  
  @Column({ type: "enum", enum: EventStatus, default: EventStatus.DRAFT })
  status!: EventStatus;

  @Column({ type: "text" })
  description!: string;

  @Column("simple-array", { nullable: true })
  photos?: string[];
}

@Entity("ticket_types")
export class TicketType {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "int" })
  available!: number;

  @ManyToOne(() => Event, (event: Event) => event.ticketTypes, { onDelete: "CASCADE" })
  event!: Event;
}