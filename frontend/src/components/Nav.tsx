import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { Icon } from './Icon';
import { useApp } from '../state/AppContext';
import { api } from '../services/api';
import type { Role } from '../types';

/* Sticky top navigation with the "View prototype as" role switcher.
   Shown on all authenticated screens (browse/detail/dashboard/…). */
export function Nav() {
  const nav = useNavigate();
  const loc = useLocation();
  const { role, setRole, isOrganizer, isAdmin, canBook, roleLabel, roleInitial } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    api.unreadCount().then((n) => setHasUnread(n > 0));
  }, [loc.pathname]);

  const tab = (path: string) => (loc.pathname === path ? 'var(--ink)' : 'var(--mut)');

  const pickRole = (r: Role) => {
    setRole(r);
    setMenuOpen(false);
    if (r === 'admin') nav('/admin');
    else if (r === 'organizer' && loc.pathname === '/admin') nav('/browse');
    else if (r === 'visitor' && (loc.pathname === '/admin' || loc.pathname === '/dashboard')) nav('/browse');
  };

  const roleOptions: { key: Role; name: string; desc: string }[] = [
    { key: 'visitor', name: 'Visitor', desc: 'Browse only — no booking' },
    { key: 'participant', name: 'Participant', desc: 'Discover & book tickets' },
    { key: 'organizer', name: 'Organizer', desc: 'Create & manage events' },
    { key: 'admin', name: 'Administrator', desc: 'Approve & manage users' },
  ];

  const circleBtn: React.CSSProperties = {
    width: 38,
    height: 38,
    borderRadius: '50%',
    border: '1px solid var(--line)',
    background: 'var(--white)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--ink)',
  };

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(243,237,226,0.82)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 32px',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <Logo size={21} onClick={() => nav('/browse')} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 26, fontSize: 14.5, fontWeight: 500 }}>
            <span className="navlink" onClick={() => nav('/browse')} style={{ cursor: 'pointer', color: tab('/browse') }}>
              Discover
            </span>
            {isOrganizer && (
              <span className="navlink" onClick={() => nav('/dashboard')} style={{ cursor: 'pointer', color: tab('/dashboard') }}>
                Organize
              </span>
            )}
            {isAdmin && (
              <span className="navlink" onClick={() => nav('/admin')} style={{ cursor: 'pointer', color: tab('/admin') }}>
                Users
              </span>
            )}
            {canBook && (
              <span className="navlink" onClick={() => nav('/messages')} style={{ cursor: 'pointer', color: tab('/messages') }}>
                Messages
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => nav('/browse')} style={circleBtn} className="lift">
            <Icon name="search" size={17} />
          </button>
          {canBook && (
            <button onClick={() => nav('/messages')} style={{ ...circleBtn, position: 'relative' }} className="lift">
              <Icon name="message" size={17} />
              {hasUnread && (
                <span
                  style={{
                    position: 'absolute',
                    top: 7,
                    right: 8,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    border: '2px solid var(--white)',
                  }}
                />
              )}
            </button>
          )}

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '5px 6px 5px 14px',
                borderRadius: 999,
                border: '1px solid var(--line)',
                background: 'var(--white)',
                cursor: 'pointer',
              }}
              className="lift"
            >
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 10,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  color: 'var(--mut)',
                }}
              >
                {roleLabel}
              </span>
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--ink)',
                  color: 'var(--paper)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                {roleInitial}
              </span>
            </button>

            {menuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 48,
                  background: 'var(--white)',
                  border: '1px solid var(--line)',
                  borderRadius: 16,
                  boxShadow: '0 24px 50px -20px rgba(20,17,15,.3)',
                  padding: 8,
                  width: 230,
                  zIndex: 60,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 9.5,
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: 'var(--mut-2)',
                    padding: '8px 12px 6px',
                  }}
                >
                  View prototype as
                </div>
                {roleOptions.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => pickRole(r.key)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      padding: '10px 12px',
                      border: 'none',
                      background: role === r.key ? 'rgba(255,77,28,.07)' : 'transparent',
                      borderRadius: 10,
                      cursor: 'pointer',
                      textAlign: 'left',
                      marginBottom: 2,
                    }}
                  >
                    <span>
                      <span style={{ display: 'block', fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{r.name}</span>
                      <span style={{ display: 'block', fontSize: 11.5, color: 'var(--mut)' }}>{r.desc}</span>
                    </span>
                    {role === r.key && (
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
