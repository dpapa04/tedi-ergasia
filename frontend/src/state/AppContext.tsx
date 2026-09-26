import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Role, EventItem } from '../types';

/* ============================================================
   Global app state: the active role (the design's "View as"
   switcher), the signed-in demo user, and the booking hand-off
   between the Event Detail and Confirmation screens.
   In the final app the role/user come from the JWT; here they're
   local so every role can be explored without a backend.
   ============================================================ */

export interface BookingResult {
  event: EventItem;
  ticketName: string;
  qty: number;
  total: string;
  ref: string;
}

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  userId: string;
  isVisitor: boolean;
  isOrganizer: boolean;
  isAdmin: boolean;
  canBook: boolean;
  roleLabel: string;
  roleInitial: string;
  lastBooking: BookingResult | null;
  setLastBooking: (b: BookingResult | null) => void;
}

const AppCtx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(() => {
    const storedRole = JSON.parse(localStorage.getItem('skene_user') ?? 'null')?.role as string | undefined;
    return storedRole ? storedRole.toLowerCase() as Role : 'visitor';
  });
  const [lastBooking, setLastBooking] = useState<BookingResult | null>(null);

  const value = useMemo<AppState>(() => {
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    return {
      role,
      setRole,
      userId: JSON.parse(localStorage.getItem('skene_user') ?? 'null')?.id ?? '',
      isVisitor: role === 'visitor',
      isOrganizer: role === 'organizer',
      isAdmin: role === 'admin',
      canBook: role === 'participant' || role === 'organizer',
      roleLabel: cap(role),
      roleInitial: role.charAt(0).toUpperCase(),
      lastBooking,
      setLastBooking,
    };
  }, [role, lastBooking]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppState {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
