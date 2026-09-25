import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { api, priceFrom } from '../services/api';
import type { EventItem } from '../types';

const CATS = ['All', 'Music', 'Theatre', 'Sports', 'Seminar', 'Film'];

const selectStyle: React.CSSProperties = {
  border: '1px solid var(--line)',
  background: 'var(--white)',
  borderRadius: 999,
  padding: '11px 18px',
  fontSize: 14,
  color: 'var(--ink)',
  outline: 'none',
  cursor: 'pointer',
};

export function Browse() {
  const nav = useNavigate();

  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const [city, setCity] = useState<string | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [dateRange, setDateRange] = useState<'week' | 'month' | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [cardStyle, setCardStyle] = useState<'A' | 'B' | 'C'>('A');
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    api.listEvents({ cat, q, city, maxPrice, dateRange }).then((result) => {
      setEvents(result);
      setPage(1);
    });
  }, [cat, q, city, maxPrice, dateRange]);

  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(events.length / pageSize));
  const visibleEvents = events.slice((page - 1) * pageSize, page * pageSize);

  const onPrice = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    setMaxPrice(v === 'Under €20' ? 20 : v === '€20–€50' ? 50 : undefined);
  };

  const onCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    setCity(v === 'Any location' ? undefined : v);
  };

  const onDate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDateRange(value === 'This week' ? 'week' : value === 'This month' ? 'month' : undefined);
  };

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '44px 32px 90px' }}>

        {/* ---------------- header ---------------- */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 30 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 10 }}>
              Discover
            </div>
            <h1 style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 'clamp(34px,4.4vw,56px)', letterSpacing: '-.035em', margin: 0, lineHeight: 0.98 }}>
              What's on near you
            </h1>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--mut)', textAlign: 'right', whiteSpace: 'nowrap' }}>
            {events.length} EVENTS<br />
            <span style={{ color: 'var(--mut-2)' }}>Athens · Thessaloniki · +46</span>
          </div>
        </div>

        {/* ---------------- search + filters ---------------- */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 999, padding: '4px 6px 4px 18px', flex: 1, minWidth: 260 }}>
            <Icon name="search" size={17} color="var(--mut)" style={{ flex: 'none' }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title, description, city…"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14.5, padding: '11px 12px', color: 'var(--ink)' }}
            />
          </div>
          <select style={selectStyle} onChange={onDate}>
            <option>Any date</option>
            <option>This week</option>
            <option>This month</option>
          </select>
          <select style={selectStyle} onChange={onPrice}>
            <option>Any price</option>
            <option>Under €20</option>
            <option>€20–€50</option>
            <option>€50+</option>
          </select>
          <select style={selectStyle} onChange={onCity}>
            <option>Any location</option>
            <option>Athens</option>
            <option>Thessaloniki</option>
          </select>
        </div>

        {/* ---------------- category chips + card style ---------------- */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 30 }}>
          <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className="lift"
                style={{
                  padding: '9px 17px',
                  borderRadius: 999,
                  border: '1px solid var(--line)',
                  background: cat === c ? 'var(--ink)' : 'var(--white)',
                  color: cat === c ? 'var(--paper)' : 'var(--ink)',
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mut-2)' }}>Card style</span>
            <div style={{ display: 'flex', background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 999, padding: 3 }}>
              {(['A', 'B', 'C'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setCardStyle(s)}
                  style={{
                    padding: '6px 13px',
                    border: 'none',
                    borderRadius: 999,
                    background: cardStyle === s ? 'var(--ink)' : 'transparent',
                    color: cardStyle === s ? 'var(--paper)' : 'var(--ink)',
                    fontFamily: 'var(--mono)',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ===== CARD STYLE A — image-led grid ===== */}
        {cardStyle === 'A' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {visibleEvents.map((e) => (
              <div
                key={e.id}
                className="hov-card"
                onClick={() => nav('/events/' + e.id)}
                style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 20, overflow: 'hidden', cursor: 'pointer' }}
              >
                <div style={{ height: 176, background: e.grad, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 15%,rgba(255,255,255,.26),transparent 50%)' }} />
                  <span style={{ position: 'absolute', left: 13, top: 12, fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '.08em', textTransform: 'uppercase', color: '#fff', background: 'rgba(0,0,0,.24)', backdropFilter: 'blur(6px)', padding: '5px 10px', borderRadius: 999 }}>
                    {e.type}
                  </span>
                  <span style={{ position: 'absolute', right: 13, bottom: 12, fontFamily: 'var(--mono)', fontSize: 10.5, color: '#fff', background: 'rgba(0,0,0,.3)', padding: '5px 10px', borderRadius: 999 }}>
                    {e.dateShort}
                  </span>
                </div>
                <div style={{ padding: '16px 18px 18px' }}>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 20, letterSpacing: '-.02em', lineHeight: 1.08 }}>{e.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--mut)', marginTop: 5 }}>{e.venue} · {e.city}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTop: '1px dashed var(--line)' }}>
                    <span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mut-2)' }}>From</span>{' '}
                      <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 19, marginLeft: 3 }}>€{priceFrom(e)}</span>
                    </span>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent)' }}>Tickets →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== CARD STYLE B — ticket-stub horizontal ===== */}
        {cardStyle === 'B' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
            {visibleEvents.map((e) => (
              <div
                key={e.id}
                className="hov-card"
                onClick={() => nav('/events/' + e.id)}
                style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 18, cursor: 'pointer', display: 'flex', overflow: 'hidden', position: 'relative' }}
              >
                <div style={{ width: 118, flex: 'none', background: e.grad, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 20%,rgba(255,255,255,.28),transparent 60%)' }} />
                  <span style={{ position: 'absolute', left: 0, bottom: 14, writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '.14em', textTransform: 'uppercase', color: '#fff', padding: 8 }}>
                    {e.type}
                  </span>
                </div>
                <div style={{ position: 'absolute', left: 108, top: 0, bottom: 0, width: 20, background: 'radial-gradient(circle 6px at 0 0,var(--white) 5px,transparent 6px)', backgroundSize: '20px 14px', backgroundRepeat: 'repeat-y', pointerEvents: 'none' }} />
                <div style={{ flex: 1, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 19, letterSpacing: '-.02em', lineHeight: 1.1 }}>{e.title}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--mut)', marginTop: 6 }}>{e.venue} · {e.city}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 14 }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--mut)' }}>
                      {e.dateShort}<br />
                      <span style={{ color: 'var(--ink)', fontWeight: 700 }}>€{priceFrom(e)}+</span>
                    </div>
                    <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--ink)', color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="arrowRight" size={15} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== CARD STYLE C — editorial list ===== */}
        {cardStyle === 'C' && (
          <div style={{ borderTop: '1px solid var(--line)' }}>
            {visibleEvents.map((e) => (
              <div
                key={e.id}
                onClick={() => nav('/events/' + e.id)}
                className="row-hover lift"
                style={{ display: 'grid', gridTemplateColumns: '64px 1.6fr 1fr 1fr auto', alignItems: 'center', gap: 20, padding: '20px 14px', borderBottom: '1px solid var(--line)', cursor: 'pointer' }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 13, background: e.grad }} />
                <div>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 21, letterSpacing: '-.02em', lineHeight: 1.05 }}>{e.title}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--accent)', marginTop: 6 }}>{e.type}</div>
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--mut)' }}>{e.venue}<br />{e.city}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 12.5, color: 'var(--ink)' }}>{e.dateShort}</div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mut-2)', display: 'block' }}>From</span>
                  <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 22 }}>€{priceFrom(e)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---------------- pagination ---------------- */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 44 }}>
          <button disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="lift" style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid var(--line)', background: 'var(--white)', cursor: page === 1 ? 'not-allowed' : 'pointer', color: 'var(--mut)', opacity: page === 1 ? 0.45 : 1 }}>
            <Icon name="chevronLeft" size={15} style={{ marginTop: 2 }} />
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
            <button key={number} onClick={() => setPage(number)} style={{ width: 38, height: 38, borderRadius: 10, border: page === number ? 'none' : '1px solid var(--line)', background: page === number ? 'var(--ink)' : 'var(--white)', color: page === number ? 'var(--paper)' : 'var(--ink)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>{number}</button>
          ))}
          <button disabled={page === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="lift" style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid var(--line)', background: 'var(--white)', cursor: page === pageCount ? 'not-allowed' : 'pointer', color: 'var(--ink)', opacity: page === pageCount ? 0.45 : 1 }}>
            <Icon name="chevronRight" size={15} style={{ marginTop: 2 }} />
          </button>
        </div>

      </div>
    </div>
  );
}
