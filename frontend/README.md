# Skene — Frontend

React + TypeScript (Vite) frontend for the **Event Management & E-Booking** platform
(ΤΕΔ 2026 assignment). It provides the current UI prototype, event browsing, role-based
demo views, booking flow, administration tools, and an in-memory API adapter.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build  (typecheck + production bundle)
npm run preview    # serve the production build
```

Requires Node 18+ (developed on Node 22).

## Current frontend scope

All screens from the design, matched pixel-for-pixel:

| Screen | Route | Notes |
| --- | --- | --- |
| Welcome | `/` | Hero, live search, featured events, marquee |
| Login | `/login` | Split screen, prefilled demo credentials |
| Register | `/register` | Full form → "pending admin approval" success state |
| Browse / Catalog | `/browse` | Search + date/price/location filters, category chips, **3 card styles A/B/C** |
| Event Detail | `/events/:id` | Dark hero, **OpenStreetMap** map, sticky 2-step booking widget |
| Confirmation | `/confirmation` | E-ticket with barcode + booking reference |
| Organizer Dashboard | `/dashboard` | Revenue/sales stats, events table with sold progress |
| Create / Edit Event | `/create` | DTD-shaped form, live capacity-vs-allocation guard |
| Admin — Users | `/admin` | User table, approve/reject, **XML + JSON export** |
| Messaging | `/messages` | Inbox / Sent folders, unread badges, delete |

The **"View prototype as"** switcher in the top-right nav toggles the four demo roles
(Visitor / Participant / Organizer / Administrator) and gates the UI accordingly —
e.g. visitors can browse but not book; only organizers see *Organize*; only admins see *Users*.

## Structure

```
src/
  main.tsx              app entry (Router + AppProvider)
  App.tsx               routes; authenticated screens share the Nav layout
  types.ts              domain types, modelled on the assignment DTD
  data/mockData.ts      seed EVENTS / USERS / MESSAGES (from the design)
  services/api.ts       in-memory API — mirrors the future REST surface
  state/AppContext.tsx  active role, demo user, booking hand-off
  components/           Logo, Icon (design SVG set), Nav (+ role switcher)
  screens/              one file per screen above
  styles/global.css     design tokens, keyframes, utility classes
```

## Data layer & the backend

`src/services/api.ts` is the single seam to the backend. Every screen reads/writes
through its async methods (`listEvents`, `getEvent`, `book`, `listUsers`,
`approveUser`, `listMessages`, `exportXML`, …), which today resolve against an
in-memory store seeded from `data/mockData.ts`. Swapping in the real REST API means
changing **only this file** (each method becomes a `fetch('/api/...')` with the JWT
attached). `vite.config.ts` already proxies `/api` → `http://localhost:4000` for that.

The types in `types.ts` and the `exportXML()` output follow the assignment's DTD
(`Event`, `TicketType`, `Booking`, `GeoLocation`, …), so the contract is stable
ahead of the Express + Prisma + Postgres backend.

### Booking rules enforced in the prototype
`api.book()` rejects a booking unless the requested quantity is available for the
chosen ticket type **and** the event's total capacity is not exceeded, then decrements
availability. The Create/Edit form surfaces the same rule live
(*allocated / capacity*, turning red on overflow).

## Backend integration still required

- Backend: Express REST API, Prisma schema (DTD → relational), JWT auth, role guards.
- Biased Matrix Factorization recommender (assignment §13), from scratch.
- Wiring `api.ts` to the live endpoints and real authentication.
- Enforcing HTTPS/TLS, JWT authentication, and role authorization on the server.
