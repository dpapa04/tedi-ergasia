import type {
  EventItem,
  User,
  Message,
  Booking,
  EventWithSales,
  TicketType,
} from '../types';
import { EVENTS, USERS, MESSAGES, MY_EVENT_IDS } from '../data/mockData';

/* ============================================================
   Mock API — an in-memory store whose method surface mirrors the
   REST API the Express/Prisma backend will expose. Every screen
   talks to this module, so swapping in `fetch('/api/...')` later
   touches only this file.
   ============================================================ */

// deep-clone the seed data so mutations (bookings, approvals) persist
// for the session without editing the source arrays.
const db = {
  events: structuredClone(EVENTS) as EventItem[],
  users: structuredClone(USERS) as User[],
  messages: structuredClone(MESSAGES) as Message[],
  bookings: [] as Booking[],
  myEventIds: [...MY_EVENT_IDS],
};

/** simulate network latency so loading states are exercised */
const delay = <T>(value: T, ms = 120): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const token = localStorage.getItem('skene_token');
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  const body = await response.json().catch(() => undefined);
  if (!response.ok) throw new Error(body?.message ?? 'Request failed');
  return body as T;
};

type BackendEvent = {
  id: string;
  title: string;
  categories: string[];
  eventType: string;
  venue: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  startDateTime: string;
  endDateTime: string;
  capacity: number;
  status: EventItem['status'];
  organizer?: { username: string };
  description: string;
  photos?: string[];
  ticketTypes: TicketType[];
};

const mapEvent = (event: BackendEvent): EventItem => {
  const start = new Date(event.startDateTime);
  const booked = event.ticketTypes.reduce((sum, ticket) => sum + ticket.quantity - ticket.available, 0);
  return {
    id: event.id,
    title: event.title,
    cat: event.categories[0] ?? 'Other',
    cats: event.categories,
    type: event.eventType,
    venue: event.venue,
    addr: event.address,
    city: event.city,
    country: event.country,
    geo: { lat: Number(event.latitude ?? 0), lng: Number(event.longitude ?? 0) },
    dateShort: start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    dateLong: start.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    time: start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    startDateTime: event.startDateTime,
    endDateTime: event.endDateTime,
    cap: event.capacity,
    booked,
    status: event.status,
    org: event.organizer?.username ?? '',
    desc: event.description,
    media: event.photos ?? [],
    grad: 'linear-gradient(135deg,#324b4a,#8d6c56)',
    color: '#324b4a',
    tickets: event.ticketTypes,
  };
};

export const priceFrom = (e: EventItem): number =>
  Math.min(...e.tickets.map((t) => t.price));

const sold = (e: EventItem): number =>
  e.tickets.reduce((a, t) => a + (t.quantity - t.available), 0);

const revenue = (e: EventItem): number =>
  e.tickets.reduce((a, t) => a + (t.quantity - t.available) * t.price, 0);

export const withSales = (e: EventItem): EventWithSales => {
  const s = sold(e);
  const cap = e.tickets.reduce((a, t) => a + t.quantity, 0);
  return { ...e, sold: s, rev: revenue(e), pct: cap ? Math.round((s / cap) * 100) : 0 };
};

export interface EventFilter {
  cat?: string; // 'All' | category
  q?: string;
  city?: string;
  maxPrice?: number;
  dateRange?: 'week' | 'month';
}

export const api = {
  login(username: string, password: string) {
    return request<{ token: string; user: { id: string; username: string; role: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  register(payload: Record<string, unknown>) {
    return request<{ message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /* ---------------- events ---------------- */
  listEvents(filter: EventFilter = {}): Promise<EventItem[]> {
    const { cat = 'All', q = '', city, maxPrice, dateRange } = filter;
    const params = new URLSearchParams();
    if (cat !== 'All') params.set('category', cat);
    if (q) params.set('q', q);
    if (city && city !== 'Any location') params.set('location', city);
    if (maxPrice != null) params.set('price_max', String(maxPrice));
    if (dateRange) {
      const now = new Date();
      const end = new Date(now);
      end.setDate(end.getDate() + (dateRange === 'week' ? 7 : 30));
      params.set('date_from', now.toISOString());
      params.set('date_to', end.toISOString());
    }
    return request<{ data: BackendEvent[] }>(`/events?${params}`).then((result) => result.data.map(mapEvent));
    /*
    const qq = q.trim().toLowerCase();
    const now = new Date();
    const rangeEnd = dateRange
      ? new Date(now.getFullYear(), now.getMonth() + (dateRange === 'week' ? 0 : 1), now.getDate() + (dateRange === 'week' ? 7 : 1))
      : undefined;
    const result = db.events.filter((e) => {
      const inCat = cat === 'All' || e.cat === cat || e.cats.includes(cat);
      const inCity = !city || city === 'Any location' || e.city === city;
      const inPrice = maxPrice == null || priceFrom(e) <= maxPrice;
      const eventDate = new Date(e.startDateTime);
      const inDate = !rangeEnd || (eventDate >= now && eventDate <= rangeEnd);
      const haystack = `${e.title} ${e.desc} ${e.city} ${e.venue} ${e.cats.join(' ')}`.toLowerCase();
      const matches = !qq || haystack.includes(qq);
      return inCat && inCity && inPrice && inDate && matches;
    });
    return delay(result); */
  },

  getEvent(id: string): Promise<EventItem | undefined> {
    return request<BackendEvent>(`/events/${id}`).then(mapEvent);
  },

  featured(): Promise<EventItem[]> {
    return delay(['EV1024', 'EV1031', 'EV1063'].map((id) => db.events.find((e) => e.id === id)!));
  },

  /** Events owned by the demo organizer, with computed sales. */
  myEvents(): Promise<EventWithSales[]> {
    return delay(
      db.myEventIds.map((id) => withSales(db.events.find((e) => e.id === id)!)),
    );
  },

  /* ---------------- bookings ---------------- */
  /**
   * Create a booking, enforcing the assignment's capacity rules:
   *  - requested qty must be available for the ticket type
   *  - total capacity of the event must not be exceeded
   * Updates availability on success.
   */
  book(
    eventId: string,
    ticketTypeId: string,
    qty: number,
    attendee: string,
  ): Promise<{ ref: string; booking: Booking }> {
    return request<{ ref: string; bookingId: string; totalCost: number; createdAt: string }>('/bookings', {
      method: 'POST',
      body: JSON.stringify({ eventId, ticketTypeId, numberOfTickets: qty }),
    }).then((result) => ({
      ref: result.ref,
      booking: { id: result.bookingId, eventId, attendee, time: result.createdAt, ticketTypeRef: ticketTypeId, numberOfTickets: qty, totalCost: result.totalCost, bookingStatus: 'CONFIRMED' },
    }));
    /*
    const event = db.events.find((e) => e.id === eventId);
    if (!event) return Promise.reject(new Error('Event not found'));
    if (event.status !== 'PUBLISHED') return Promise.reject(new Error('Event is not open for booking'));
    const ticket = event.tickets.find((t) => t.id === ticketTypeId);
    if (!ticket) return Promise.reject(new Error('Ticket type not found'));
    if (qty < 1 || qty > ticket.available)
      return Promise.reject(new Error('Not enough tickets available for this type'));
    const totalBooked = event.tickets.reduce((a, t) => a + (t.quantity - t.available), 0);
    if (totalBooked + qty > event.cap)
      return Promise.reject(new Error('Event capacity would be exceeded'));

    ticket.available -= qty;
    event.booked += qty;
    const booking: Booking = {
      id: `B${Math.floor(1000 + Math.random() * 9000)}`,
      eventId,
      attendee,
      time: new Date().toISOString(),
      ticketTypeRef: ticketTypeId,
      numberOfTickets: qty,
      totalCost: +(ticket.price * qty).toFixed(2),
      bookingStatus: 'CONFIRMED',
    };
    db.bookings.push(booking);
    return delay({ ref: nextBookingRef(), booking }); */
  },

  /* ---------------- users / admin ---------------- */
  listUsers(): Promise<User[]> {
    return delay(db.users);
  },

  approveUser(username: string): Promise<User | undefined> {
    const user = db.users.find((u) => u.u === username);
    if (user) user.status = 'Approved';
    return delay(user);
  },

  rejectUser(username: string): Promise<User | undefined> {
    const user = db.users.find((u) => u.u === username);
    if (user) user.status = 'Rejected';
    return delay(user);
  },

  /* ---------------- messaging ---------------- */
  listMessages(folder: 'inbox' | 'sent'): Promise<Message[]> {
    return delay(db.messages.filter((m) => m.folder === folder));
  },

  deleteMessage(id: number): Promise<void> {
    db.messages = db.messages.filter((m) => m.id !== id);
    return delay(undefined);
  },

  unreadCount(): Promise<number> {
    return delay(db.messages.filter((m) => m.folder === 'inbox' && m.unread).length);
  },

  /* ---------------- export (admin) ---------------- */
  exportJSON(): string {
    return JSON.stringify({ events: db.events }, null, 2);
  },

  /** Emit the events tree per the assignment DTD. */
  exportXML(): string {
    const esc = (s: string | number) =>
      String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const ticketXML = (t: TicketType) =>
      `      <TicketType TicketTypeID="${esc(t.id)}">\n` +
      `        <Name>${esc(t.name)}</Name>\n` +
      `        <Price>${t.price.toFixed(2)}</Price>\n` +
      `        <Quantity>${t.quantity}</Quantity>\n` +
      `        <Available>${t.available}</Available>\n` +
      `      </TicketType>`;
    const bookingXML = (b: Booking) =>
      `      <Booking BookingID="${esc(b.id)}">\n` +
      `        <Attendee UserID="${esc(b.attendee)}"/>\n` +
      `        <Time>${esc(b.time)}</Time>\n` +
      `        <TicketTypeRef>${esc(b.ticketTypeRef)}</TicketTypeRef>\n` +
      `        <NumberOfTickets>${b.numberOfTickets}</NumberOfTickets>\n` +
      `        <TotalCost>${b.totalCost.toFixed(2)}</TotalCost>\n` +
      `        <BookingStatus>${esc(b.bookingStatus)}</BookingStatus>\n` +
      `      </Booking>`;
    const eventXML = (e: EventItem) => {
      const bookings = db.bookings.filter((b) => b.eventId === e.id);
      return (
        `  <Event EventID="${esc(e.id)}">\n` +
        `    <Title>${esc(e.title)}</Title>\n` +
        e.cats.map((c) => `    <Category>${esc(c)}</Category>`).join('\n') + '\n' +
        `    <EventType>${esc(e.type)}</EventType>\n` +
        `    <Venue>${esc(e.venue)}</Venue>\n` +
        `    <Address>${esc(e.addr)}</Address>\n` +
        `    <City>${esc(e.city)}</City>\n` +
        `    <Country>${esc(e.country)}</Country>\n` +
        `    <GeoLocation Latitude="${e.geo.lat}" Longitude="${e.geo.lng}"/>\n` +
        `    <StartDateTime>${esc(e.startDateTime)}</StartDateTime>\n` +
        `    <EndDateTime>${esc(e.endDateTime)}</EndDateTime>\n` +
        `    <Capacity>${e.cap}</Capacity>\n` +
        `    <TicketTypes>\n${e.tickets.map(ticketXML).join('\n')}\n    </TicketTypes>\n` +
        `    <Bookings>\n${bookings.map(bookingXML).join('\n')}${bookings.length ? '\n' : ''}    </Bookings>\n` +
        `    <Organizer UserID="${esc(e.org)}"/>\n` +
        `    <Status>${esc(e.status)}</Status>\n` +
        `    <Description>${esc(e.desc)}</Description>\n` +
        (e.media.length
          ? `    <Media>\n${e.media.map((p) => `      <Photo>${esc(p)}</Photo>`).join('\n')}\n    </Media>\n`
          : '') +
        `  </Event>`
      );
    };
    return `<?xml version="1.0" encoding="UTF-8"?>\n<Events>\n${db.events.map(eventXML).join('\n')}\n</Events>\n`;
  },
};
