import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { api } from '../services/api';
import type { EventWithSales } from '../types';

export function Dashboard() {
  const nav = useNavigate();
  const [myEvents, setMyEvents] = useState<EventWithSales[]>([]);

  useEffect(() => {
    api.myEvents().then(setMyEvents);
  }, []);

  const totalRev = Math.round(myEvents.reduce((a, e) => a + e.rev, 0));
  const totalSold = myEvents.reduce((a, e) => a + e.sold, 0);
  const totalBookings = myEvents.reduce((a, e) => a + (e.bookingCount ?? 0), 0);

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '44px 32px 90px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 10 }}>
              Organize
            </div>
            <h1 style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 'clamp(34px,4.4vw,52px)', letterSpacing: '-.035em', margin: 0, lineHeight: 0.98 }}>
              Your events
            </h1>
          </div>
          <button
            onClick={() => nav('/create')}
            style={{
              background: 'var(--accent)',
              border: 'none',
              color: '#fff',
              padding: '13px 22px',
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 14.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            className="lift"
          >
            <Icon name="plus" size={16} strokeWidth={2.2} />
            Create event
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 34 }}>
          <div style={{ background: 'var(--ink)', color: 'var(--paper)', borderRadius: 18, padding: 22, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 100% 0%,rgba(255,77,28,.2),transparent 60%)' }} />
            <div style={{ position: 'relative', fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mut-dk2)', marginBottom: 10 }}>
              Revenue
            </div>
            <div style={{ position: 'relative', fontFamily: 'var(--display)', fontWeight: 800, fontSize: 34, letterSpacing: '-.03em' }}>
              €{totalRev}
            </div>
          </div>
          <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 18, padding: 22 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mut-2)', marginBottom: 10 }}>
              Tickets sold
            </div>
            <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 34, letterSpacing: '-.03em' }}>{totalSold}</div>
          </div>
          <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 18, padding: 22 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mut-2)', marginBottom: 10 }}>
              Active events
            </div>
            <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 34, letterSpacing: '-.03em' }}>{myEvents.length}</div>
          </div>
          <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 18, padding: 22 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mut-2)', marginBottom: 10 }}>
              Bookings
            </div>
            <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 34, letterSpacing: '-.03em' }}>{totalBookings}</div>
          </div>
        </div>

        <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 20, overflow: 'hidden' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1.4fr 1fr auto',
              gap: 16,
              padding: '16px 24px',
              borderBottom: '1px solid var(--line)',
              fontFamily: 'var(--mono)',
              fontSize: 10,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: 'var(--mut-2)',
            }}
          >
            <span>Event</span>
            <span>Status</span>
            <span>Sold</span>
            <span>Revenue</span>
            <span></span>
          </div>
          {myEvents.map((e) => (
            <div
              key={e.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1.4fr 1fr auto',
                gap: 16,
                padding: '18px 24px',
                borderBottom: '1px solid var(--line-2)',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 11, background: e.grad, flex: 'none' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15.5, letterSpacing: '-.01em' }}>{e.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--mut)' }}>
                    {e.dateShort} · {e.city}
                  </div>
                </div>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.05em', background: 'rgba(6,167,125,.12)', color: '#06A77D', padding: '5px 10px', borderRadius: 999 }}>
                  {e.status}
                </span>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 6, background: 'var(--paper-2)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${e.pct}%`, background: 'var(--accent)', borderRadius: 99 }} />
                  </div>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--mut)', whiteSpace: 'nowrap' }}>{e.pct}%</span>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--mut-2)', marginTop: 5 }}>
                  {e.sold} / {e.cap}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 18 }}>€{e.rev}</div>
              <div style={{ display: 'flex', gap: 7 }}>
                <button
                  onClick={() => nav('/events/' + e.id)}
                  title="View"
                  style={{ width: 34, height: 34, borderRadius: 9, border: '1px solid var(--line)', background: 'var(--white)', cursor: 'pointer', color: 'var(--ink)' }}
                  className="lift"
                >
                  <Icon name="eye" size={15} style={{ marginTop: 2 }} />
                </button>
                <button
                  onClick={() => nav('/create')}
                  title="Edit"
                  style={{ width: 34, height: 34, borderRadius: 9, border: '1px solid var(--line)', background: 'var(--white)', cursor: 'pointer', color: 'var(--ink)' }}
                  className="lift"
                >
                  <Icon name="edit" size={15} style={{ marginTop: 2 }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
