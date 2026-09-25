import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Icon } from '../components/Icon';
import { api, priceFrom } from '../services/api';
import type { EventItem } from '../types';

const MARQUEE =
  'Concerts ✺ Theatre ✺ Sport ✺ Festivals ✺ Talks ✺ Cinema ✺ Dance ✺ Comedy ✺ Concerts ✺ Theatre ✺ Sport ✺ Festivals ✺ Talks ✺ Cinema ✺ Dance ✺ Comedy ✺';

const mono = (
  size: number,
  color = 'var(--mut-dk2)',
): React.CSSProperties => ({
  fontFamily: 'var(--mono)',
  fontSize: size,
  letterSpacing: '.1em',
  textTransform: 'uppercase',
  color,
});

export function Welcome() {
  const nav = useNavigate();
  const [featured, setFeatured] = useState<EventItem[]>([]);

  useEffect(() => {
    api.featured().then(setFeatured);
  }, []);

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'var(--paper)', overflowX: 'hidden' }}>
      {/* ---------------- dark hero ---------------- */}
      <div style={{ background: 'var(--ink)', color: 'var(--paper)', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 70% 60% at 78% -5%,rgba(255,77,28,0.22),transparent 60%),radial-gradient(ellipse 50% 50% at 5% 110%,rgba(36,56,255,0.16),transparent 55%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.5,
            backgroundImage:
              'linear-gradient(rgba(243,237,226,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(243,237,226,.04) 1px,transparent 1px)',
            backgroundSize: '54px 54px',
          }}
        />

        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Logo size={22} onDark />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => nav('/login')}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--line-dk)',
                  color: 'var(--paper)',
                  padding: '11px 22px',
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 14.5,
                  cursor: 'pointer',
                }}
                className="lift"
              >
                Log in
              </button>
              <button
                onClick={() => nav('/register')}
                style={{
                  background: 'var(--paper)',
                  border: 'none',
                  color: 'var(--ink)',
                  padding: '11px 22px',
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 14.5,
                  cursor: 'pointer',
                }}
                className="lift"
              >
                Get started
              </button>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '60px 32px 28px' }}>
          <div className="stag" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 40, alignItems: 'center' }}>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 9,
                  padding: '7px 14px',
                  borderRadius: 999,
                  border: '1px solid var(--line-dk)',
                  background: 'rgba(243,237,226,.05)',
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  letterSpacing: '.06em',
                  textTransform: 'uppercase',
                  color: 'var(--mut-dk)',
                  marginBottom: 30,
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1.6s infinite' }} />
                2,400+ events live across Greece
              </div>
              <h1
                style={{
                  fontFamily: 'var(--display)',
                  fontWeight: 800,
                  fontSize: 'clamp(58px,7.4vw,112px)',
                  lineHeight: 0.92,
                  letterSpacing: '-0.045em',
                  margin: '0 0 26px',
                }}
              >
                Be there<br />for what<br />
                <span style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--accent)' }}>matters.</span>
              </h1>
              <p style={{ fontSize: 19, lineHeight: 1.55, color: 'var(--mut-dk)', maxWidth: 480, margin: '0 0 34px' }}>
                Concerts, theatre, sport and ideas — discover, book and never miss the moment. One platform from booking to the front row.
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--paper)',
                  borderRadius: 999,
                  padding: '7px 7px 7px 22px',
                  maxWidth: 520,
                  boxShadow: '0 30px 60px -28px rgba(0,0,0,.6)',
                }}
              >
                <Icon name="search" size={19} color="rgba(20,17,15,.5)" style={{ flex: 'none' }} />
                <input
                  placeholder="Search artists, venues, cities…"
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: 16,
                    color: 'var(--ink)',
                    padding: '12px 14px',
                  }}
                />
                <button
                  onClick={() => nav('/browse')}
                  style={{
                    background: 'var(--accent)',
                    border: 'none',
                    color: '#fff',
                    padding: '13px 26px',
                    borderRadius: 999,
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: 'pointer',
                    flex: 'none',
                  }}
                  className="lift"
                >
                  Explore
                </button>
              </div>
              <div style={{ display: 'flex', gap: 40, marginTop: 42 }}>
                {[
                  ['85%', 'booked in seconds'],
                  ['48', 'cities'],
                  ['1.2M', 'tickets a year'],
                ].map(([n, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 34, letterSpacing: '-.03em' }}>{n}</div>
                    <div style={{ ...mono(10.5), marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* floating showcase cards */}
            <div style={{ position: 'relative', height: 520 }}>
              <div
                style={{
                  position: 'absolute',
                  top: 18,
                  right: 6,
                  width: 300,
                  background: 'var(--paper)',
                  color: 'var(--ink)',
                  borderRadius: 22,
                  boxShadow: '0 40px 80px -30px rgba(0,0,0,.7)',
                  animation: 'floaty 6s ease-in-out infinite',
                  overflow: 'hidden',
                }}
              >
                <div style={{ height: 152, background: 'linear-gradient(135deg,#FF4D1C,#FF8A3D)', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 75% 25%,rgba(255,255,255,.35),transparent 45%)' }} />
                  <span
                    style={{
                      position: 'absolute',
                      left: 16,
                      top: 14,
                      fontFamily: 'var(--mono)',
                      fontSize: 10,
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,.92)',
                      background: 'rgba(0,0,0,.18)',
                      padding: '5px 10px',
                      borderRadius: 999,
                    }}
                  >
                    Music · Tonight
                  </span>
                </div>
                <div style={{ padding: '16px 18px 18px' }}>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 21, letterSpacing: '-.02em', lineHeight: 1.05 }}>
                    Nocturnal — Live
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--mut)', marginTop: 5 }}>Technopolis · Athens</div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 16,
                      paddingTop: 14,
                      borderTop: '1px dashed var(--line)',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--mut)' }}>FROM</span>
                    <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 24 }}>€18</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: 34,
                  left: 0,
                  width: 236,
                  background: 'var(--white)',
                  color: 'var(--ink)',
                  borderRadius: 18,
                  padding: '16px 18px',
                  boxShadow: '0 36px 70px -30px rgba(0,0,0,.6)',
                  animation: 'floaty2 7s ease-in-out infinite .8s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      background: 'var(--sports)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    <Icon name="check" size={17} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Booking confirmed</div>
                    <div style={{ fontSize: 11.5, color: 'var(--mut)' }}>2 × General · €56.00</div>
                  </div>
                </div>
                <div className="barcode" style={{ height: 30, marginTop: 14, color: 'var(--ink)', opacity: 0.85 }} />
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '.1em', color: 'var(--mut)', marginTop: 6, textAlign: 'center' }}>
                  SKN · B501 · CONFIRMED
                </div>
              </div>

              <div
                style={{
                  position: 'absolute',
                  top: 230,
                  right: 34,
                  width: 150,
                  background: 'var(--ink-2)',
                  border: '1px solid var(--line-dk)',
                  color: 'var(--paper)',
                  borderRadius: 16,
                  padding: 14,
                  animation: 'floaty 8s ease-in-out infinite 1.4s',
                }}
              >
                <div style={mono(9.5)}>Live now</div>
                <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 30, marginTop: 4 }}>312</div>
                <div style={{ fontSize: 11.5, color: 'var(--mut-dk)' }}>people viewing</div>
              </div>
            </div>
          </div>
        </div>

        {/* marquee */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderTop: '1px solid var(--line-dk)',
            borderBottom: '1px solid var(--line-dk)',
            marginTop: 36,
            padding: '18px 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 46,
              width: 'max-content',
              animation: 'marq 26s linear infinite',
              fontFamily: 'var(--display)',
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: '-.02em',
              color: 'var(--mut-dk)',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{MARQUEE}</span>
            <span>{MARQUEE}</span>
          </div>
        </div>
      </div>

      {/* ---------------- featured ---------------- */}
      <div style={{ background: 'var(--paper)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px 90px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 10 }}>
                Featured tonight
              </div>
              <h2 style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 'clamp(30px,3.6vw,46px)', letterSpacing: '-.03em', margin: 0 }}>
                Moments worth showing up for
              </h2>
            </div>
            <button
              onClick={() => nav('/browse')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14.5, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 7 }}
              className="navlink"
            >
              See all events <Icon name="arrowRight" size={15} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {featured.map((e) => (
              <div
                key={e.id}
                className="hov-card"
                onClick={() => nav(`/events/${e.id}`)}
                style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 20, overflow: 'hidden', cursor: 'pointer' }}
              >
                <div style={{ height: 188, background: e.grad, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 15%,rgba(255,255,255,.28),transparent 50%)' }} />
                  <span
                    style={{
                      position: 'absolute',
                      left: 14,
                      top: 13,
                      fontFamily: 'var(--mono)',
                      fontSize: 10,
                      letterSpacing: '.08em',
                      textTransform: 'uppercase',
                      color: '#fff',
                      background: 'rgba(0,0,0,.22)',
                      backdropFilter: 'blur(6px)',
                      padding: '5px 11px',
                      borderRadius: 999,
                    }}
                  >
                    {e.type}
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      right: 14,
                      bottom: 13,
                      fontFamily: 'var(--mono)',
                      fontSize: 11,
                      color: '#fff',
                      background: 'rgba(0,0,0,.28)',
                      padding: '5px 11px',
                      borderRadius: 999,
                    }}
                  >
                    {e.dateShort}
                  </span>
                </div>
                <div style={{ padding: '18px 20px 20px' }}>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 22, letterSpacing: '-.02em', lineHeight: 1.08 }}>{e.title}</div>
                  <div style={{ fontSize: 13.5, color: 'var(--mut)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon name="pin" size={13} />
                    {e.venue} · {e.city}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, paddingTop: 16, borderTop: '1px dashed var(--line)' }}>
                    <span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mut-2)' }}>From</span>{' '}
                      <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 21, marginLeft: 4 }}>€{priceFrom(e)}</span>
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>Get tickets →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
