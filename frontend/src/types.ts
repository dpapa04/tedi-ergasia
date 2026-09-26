/* ============================================================
   Domain types — modelled on the assignment DTD (ΤΕΔ 2026).
   These mirror the shapes the REST API will return, so the
   mock service layer and the future backend are interchangeable.
   ============================================================ */

export type Role = 'visitor' | 'participant' | 'organizer' | 'admin';

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'COMPLETED' | 'CANCELLED';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export type UserStatus = 'Pending' | 'Approved' | 'Rejected';

/** <TicketType TicketTypeID> */
export interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  available: number;
}

/** <Booking BookingID> */
export interface Booking {
  id: string;
  eventId: string;
  attendee: string; // UserID
  time: string; // ISO
  ticketTypeRef: string; // TicketTypeID
  numberOfTickets: number;
  totalCost: number;
  bookingStatus: BookingStatus;
}

/** <GeoLocation Latitude Longitude> */
export interface GeoLocation {
  lat: number;
  lng: number;
}

/** <Event EventID> */
export interface EventItem {
  id: string;
  title: string;
  /** display category used by the filter chips */
  cat: string;
  /** all categories (Category+) */
  cats: string[];
  type: string; // EventType
  venue: string;
  addr: string;
  city: string;
  country: string;
  geo: GeoLocation;
  dateShort: string;
  dateLong: string;
  time: string;
  startDateTime: string;
  endDateTime: string;
  cap: number; // Capacity
  booked: number;
  status: EventStatus;
  org: string; // Organizer UserID / display
  desc: string;
  media: string[]; // Photo*
  /** visual gradient used across the UI for this event */
  grad: string;
  color: string;
  tickets: TicketType[];
}

/** A user of the platform (registration + roles + approval). */
export interface User {
  id?: string;
  u: string; // username
  name: string;
  role: 'Participant' | 'Organizer' | 'Administrator';
  status: UserStatus;
  email: string;
  phone: string;
  city: string;
  afm: string; // ΑΦΜ / tax id
  joined: string;
}

/** A message in the inbox/sent messaging folders. */
export interface Message {
  id: number;
  folder: 'inbox' | 'sent';
  from: string;
  sub: string;
  body: string;
  time: string;
  unread: boolean;
  ev: string; // related event title
}

/** Derived view-model of an event with computed booking totals (for the dashboard). */
export interface EventWithSales extends EventItem {
  sold: number;
  rev: number;
  pct: number;
}
