import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useApp } from '../state/AppContext';

export function Confirmation() {
  const nav = useNavigate();
  const { lastBooking } = useApp();

  useEffect(() => {
    if (!lastBooking) nav('/browse');
  }, [lastBooking, nav]);

  if (!lastBooking) return null;

  const { event, ticketName, qty, total, ref } = lastBooking;

  return (
    <div
      style={{
        background: 'var(--ink)',
        minHeight: '100vh',
        color: 'var(--paper)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 32px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 50% at 50% -10%,rgba(255,77,28,.22),transparent 60%)',
        }}
      />
      <div style={{ position: 'relative', width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 26 }} className="stag">
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'var(--sports)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              boxShadow: '0 0 0 8px rgba(6,167,125,.16)',
            }}
          >
            <Icon name="check" size={28} strokeWidth={2.4} color="#fff" />
          </div>
          <h1
            style={{
              fontFamily: 'var(--display)',
              fontWeight: 800,
              fontSize: 38,
              letterSpacing: '-.035em',
              margin: '0 0 6px',
            }}
          >
            You're going!
          </h1>
          <p style={{ fontSize: 15, color: 'var(--mut-dk)', margin: 0 }}>
            A confirmation has been sent to your email.
          </p>
        </div>

        {/* ticket */}
        <div
          style={{
            background: 'var(--paper)',
            color: 'var(--ink)',
            borderRadius: 22,
            overflow: 'hidden',
            boxShadow: '0 40px 80px -30px rgba(0,0,0,.7)',
          }}
        >
          <div style={{ background: event.grad, height: 96, position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(circle at 80% 20%,rgba(255,255,255,.3),transparent 55%)',
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: 20,
                top: 16,
                fontFamily: 'var(--mono)',
                fontSize: 10,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: '#fff',
                background: 'rgba(0,0,0,.24)',
                padding: '5px 11px',
                borderRadius: 999,
              }}
            >
              {event.type} · E-Ticket
            </span>
          </div>
          <div style={{ padding: '22px 24px 4px' }}>
            <div
              style={{
                fontFamily: 'var(--display)',
                fontWeight: 800,
                fontSize: 26,
                letterSpacing: '-.025em',
                lineHeight: 1.0,
              }}
            >
              {event.title}
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--mut)', marginTop: 7 }}>
              {event.venue} · {event.city}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 9,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: 'var(--mut-2)',
                  }}
                >
                  Date
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, marginTop: 3 }}>{event.dateShort}</div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 9,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: 'var(--mut-2)',
                  }}
                >
                  Doors
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, marginTop: 3 }}>{event.time}</div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 9,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: 'var(--mut-2)',
                  }}
                >
                  Ticket
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, marginTop: 3 }}>
                  {ticketName} × {qty}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 9,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: 'var(--mut-2)',
                  }}
                >
                  Paid
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, marginTop: 3 }}>€{total}</div>
              </div>
            </div>
          </div>
          <div style={{ position: 'relative', height: 30, margin: '18px 0 0' }}>
            <div
              style={{
                position: 'absolute',
                left: -15,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'var(--ink)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: -15,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'var(--ink)',
              }}
            />
            <div style={{ position: 'absolute', left: 18, right: 18, top: '50%', borderTop: '2px dashed var(--line)' }} />
          </div>
          <div style={{ padding: '6px 24px 24px', textAlign: 'center' }}>
            <div className="barcode" style={{ height: 48, color: 'var(--ink)' }} />
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 11,
                letterSpacing: '.18em',
                color: 'var(--mut)',
                marginTop: 10,
              }}
            >
              {ref} · CONFIRMED
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
          <button
            onClick={() => nav('/browse')}
            style={{
              flex: 1,
              background: 'transparent',
              border: '1px solid var(--line-dk)',
              color: 'var(--paper)',
              padding: 14,
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 14.5,
              cursor: 'pointer',
            }}
            className="lift"
          >
            Keep exploring
          </button>
          <button
            onClick={() => nav('/messages')}
            style={{
              flex: 1,
              background: 'var(--accent)',
              border: 'none',
              color: '#fff',
              padding: 14,
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 14.5,
              cursor: 'pointer',
            }}
            className="lift"
          >
            View my tickets
          </button>
        </div>
      </div>
    </div>
  );
}
