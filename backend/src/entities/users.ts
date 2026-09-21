import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";

export enum UserRole {
  ADMIN = "ADMIN",
  ORGANIZER = "ORGANIZER",
  ATTENDEE = "ATTENDEE",
  VISITOR = "VISITOR"
}

export enum UserStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  passwordHash!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  phone!: string;

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

  @Column({ unique: true })
  vatNumber!: string; // ΑΦΜ

  @Column({ type: "enum", enum: UserRole, default: UserRole.ATTENDEE })
  role!: UserRole;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.PENDING })
  status!: UserStatus;

  @CreateDateColumn()
  createdAt!: Date;
}