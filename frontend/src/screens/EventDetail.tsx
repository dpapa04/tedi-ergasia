import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { api, priceFrom } from '../services/api';
import { useApp } from '../state/AppContext';
import type { EventItem } from '../types';

export function EventDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { isVisitor, canBook, userId, setLastBooking } = useApp();

  const [ev, setEv] = useState<EventItem | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [bookStep, setBookStep] = useState<0 | 1>(0);

  useEffect(() => {
    api.getEvent(id!).then((e) => {
      if (!e) nav('/browse');
      else setEv(e);
    });
  }, [id, nav]);

  if (!ev) return null;

  const selTicket = ev.tickets.find((t) => t.id === ticketId);
  const total = (selTicket ? selTicket.price * qty : 0).toFixed(2);

  const { lat, lng } = ev.geo;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.008}%2C${lat - 0.005}%2C${lng + 0.008}%2C${lat + 0.005}&layer=mapnik&marker=${lat}%2C${lng}`;

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(q + 1, Math.min(8, selTicket?.available ?? 8)));

  const confirmBook = () => {
    if (!selTicket) return;
    api.book(ev.id, ticketId!, qty, userId).then((result) => {
      setLastBooking({ event: ev, ticketName: selTicket.name, qty, total, ref: result.ref });
      nav('/confirmation');
    });
  };

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      {/* dark hero */}
      <div style={{ background: 'var(--ink)', color: 'var(--paper)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.9, background: ev.grad, mixBlendMode: 'normal' }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top,var(--ink) 4%,rgba(20,17,15,.55) 55%,rgba(20,17,15,.25))',
          }}
        />
        <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', padding: '26px 32px 44px' }}>
          <button
            onClick={() => nav('/browse')}
            style={{
              background: 'rgba(20,17,15,.3)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(243,237,226,.2)',
              color: 'var(--paper)',
              padding: '9px 16px',
              borderRadius: 999,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              marginBottom: 88,
            }}
            className="lift"
          >
            <Icon name="chevronLeft" size={15} />
            All events
          </button>
          <div style={{ display: 'flex', gap: 9, marginBottom: 16 }}>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 10.5,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                background: 'var(--accent)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: 999,
              }}
            >
              {ev.type}
            </span>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 10.5,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                background: 'rgba(243,237,226,.14)',
                backdropFilter: 'blur(8px)',
                color: 'var(--paper)',
                padding: '6px 12px',
                borderRadius: 999,
              }}
            >
              {ev.status}
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--display)',
              fontWeight: 800,
              fontSize: 'clamp(42px,6vw,80px)',
              letterSpacing: '-.04em',
              lineHeight: 0.95,
              margin: '0 0 18px',
              maxWidth: '14ch',
            }}
          >
            {ev.title}
          </h1>
          <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', fontSize: 15 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="calendar" size={17} />
              {ev.dateLong}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="clock" size={17} />
              {ev.time}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="pin" size={17} />
              {ev.venue}, {ev.city}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '44px 32px 90px',
          display: 'grid',
          gridTemplateColumns: '1fr 392px',
          gap: 44,
          alignItems: 'start',
        }}
      >
        {/* left: details */}
        <div>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 11,
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 12,
            }}
          >
            About this event
          </div>
          <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--ink)', margin: '0 0 14px', maxWidth: '60ch' }}>
            {ev.desc}
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--mut)', margin: '0 0 34px', maxWidth: '60ch' }}>
            Presented by {ev.org}. Categories: {ev.cats.join(' · ')}. Please arrive early; entry closes 15 minutes after
            the start time.
          </p>

          <div style={{ display: 'flex', gap: 14, marginBottom: 40, flexWrap: 'wrap' }}>
            <div
              style={{
                flex: 1,
                minWidth: 150,
                background: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: 16,
                padding: 18,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 9.5,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: 'var(--mut-2)',
                  marginBottom: 7,
                }}
              >
                Capacity
              </div>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 26, letterSpacing: '-.02em' }}>
                {ev.cap}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                minWidth: 150,
                background: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: 16,
                padding: 18,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 9.5,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: 'var(--mut-2)',
                  marginBottom: 7,
                }}
              >
                Organizer
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-.01em', marginTop: 4 }}>{ev.org}</div>
            </div>
            <div
              style={{
                flex: 1,
                minWidth: 150,
                background: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: 16,
                padding: 18,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 9.5,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: 'var(--mut-2)',
                  marginBottom: 7,
                }}
              >
                From
              </div>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 26, letterSpacing: '-.02em' }}>
                €{priceFrom(ev)}
              </div>
            </div>
          </div>

          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 11,
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 14,
            }}
          >
            Location
          </div>
          <div
            style={{
              borderRadius: 18,
              overflow: 'hidden',
              border: '1px solid var(--line)',
              background: 'var(--white)',
            }}
          >
            <iframe
              src={mapSrc}
              style={{ width: '100%', height: 300, border: 0, display: 'block', filter: 'saturate(.92)' }}
              loading="lazy"
            />
            <div
              style={{
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--line)',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{ev.venue}</div>
                <div style={{ fontSize: 13, color: 'var(--mut)' }}>
                  {ev.addr}, {ev.city}, {ev.country}
                </div>
              </div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--mut)' }}>OpenStreetMap</span>
            </div>
          </div>
        </div>

        {/* right: booking widget (sticky) */}
        <div style={{ position: 'sticky', top: 96 }}>
          <div
            style={{
              background: 'var(--white)',
              border: '1px solid var(--line)',
              borderRadius: 22,
              boxShadow: '0 24px 50px -28px rgba(20,17,15,.25)',
              overflow: 'hidden',
            }}
          >
            {/* STEP 0: choose tickets */}
            {bookStep === 0 && (
              <>
                <div style={{ padding: '24px 24px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 20, letterSpacing: '-.02em' }}>
                      Choose tickets
                    </span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--sports)' }}>● ON SALE</span>
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--mut)', margin: '0 0 18px' }}>
                    Bookings are final once confirmed.
                  </p>
                </div>
                <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {ev.tickets.map((t) => {
                    const selected = ticketId === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => {
                          if (t.available > 0) setTicketId(t.id);
                        }}
                        style={{
                          border: `1.5px solid ${selected ? 'var(--accent)' : 'var(--line)'}`,
                          background: selected ? 'rgba(255,77,28,.06)' : 'var(--white)',
                          borderRadius: 14,
                          padding: '15px 16px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12,
                          transition: 'all .2s',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                          {t.available === 0 ? (
                            <div
                              style={{
                                fontFamily: 'var(--mono)',
                                fontSize: 10.5,
                                color: 'var(--accent)',
                                marginTop: 3,
                                letterSpacing: '.05em',
                              }}
                            >
                              SOLD OUT
                            </div>
                          ) : (
                            <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--mut)', marginTop: 3 }}>
                              {t.available} left
                            </div>
                          )}
                        </div>
                        <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 21, letterSpacing: '-.02em' }}>
                          €{t.price}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ padding: '18px 24px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 18px' }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--mut)' }}>Quantity</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <button
                        onClick={dec}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          border: '1px solid var(--line)',
                          background: 'var(--white)',
                          cursor: 'pointer',
                          fontSize: 18,
                          color: 'var(--ink)',
                        }}
                        className="lift"
                      >
                        –
                      </button>
                      <span
                        style={{
                          fontFamily: 'var(--display)',
                          fontWeight: 800,
                          fontSize: 20,
                          minWidth: 22,
                          textAlign: 'center',
                        }}
                      >
                        {qty}
                      </span>
                      <button
                        onClick={inc}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          border: '1px solid var(--line)',
                          background: 'var(--white)',
                          cursor: 'pointer',
                          fontSize: 18,
                          color: 'var(--ink)',
                        }}
                        className="lift"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 0',
                      borderTop: '1px dashed var(--line)',
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 15 }}>Total</span>
                    <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 30, letterSpacing: '-.03em' }}>
                      €{total}
                    </span>
                  </div>
                  {isVisitor && (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: 14,
                        background: 'var(--paper)',
                        borderRadius: 12,
                        fontSize: 13,
                        color: 'var(--mut)',
                        lineHeight: 1.5,
                      }}
                    >
                      Booking is for registered members.{' '}
                      <span
                        onClick={() => nav('/register')}
                        style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Create a free account →
                      </span>
                    </div>
                  )}
                  {canBook && (
                    <button
                      onClick={() => {
                        if (selTicket) setBookStep(1);
                      }}
                      disabled={!selTicket}
                      style={{
                        width: '100%',
                        border: 'none',
                        color: '#fff',
                        padding: 16,
                        borderRadius: 999,
                        fontWeight: 700,
                        fontSize: 15.5,
                        cursor: 'pointer',
                        background: 'var(--accent)',
                        opacity: selTicket ? 1 : 0.5,
                      }}
                      className="lift"
                    >
                      Review booking
                    </button>
                  )}
                </div>
              </>
            )}

            {/* STEP 1: confirm */}
            {bookStep === 1 && selTicket && (
              <div style={{ padding: 24 }}>
                <button
                  onClick={() => setBookStep(0)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--mut)',
                    fontSize: 13,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 18,
                    padding: 0,
                  }}
                >
                  <Icon name="chevronLeft" size={14} />
                  Edit
                </button>
                <div
                  style={{
                    fontFamily: 'var(--display)',
                    fontWeight: 700,
                    fontSize: 21,
                    letterSpacing: '-.02em',
                    marginBottom: 18,
                  }}
                >
                  Confirm your booking
                </div>
                <div style={{ background: 'var(--paper)', borderRadius: 14, padding: 18, marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 10 }}>
                    <span style={{ color: 'var(--mut)' }}>Event</span>
                    <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{ev.title}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 10 }}>
                    <span style={{ color: 'var(--mut)' }}>Ticket</span>
                    <span style={{ fontWeight: 600 }}>{selTicket.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 10 }}>
                    <span style={{ color: 'var(--mut)' }}>Quantity</span>
                    <span style={{ fontWeight: 600 }}>{qty}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 14,
                      paddingTop: 12,
                      borderTop: '1px dashed var(--line)',
                    }}
                  >
                    <span style={{ color: 'var(--mut)' }}>Total</span>
                    <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 20 }}>€{total}</span>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    background: 'rgba(255,77,28,.06)',
                    border: '1px solid rgba(255,77,28,.18)',
                    borderRadius: 12,
                    padding: 13,
                    marginBottom: 18,
                  }}
                >
                  <Icon name="info" size={17} color="var(--accent)" style={{ flex: 'none', marginTop: 1 }} />
                  <span style={{ fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.5 }}>
                    This booking <strong>cannot be undone</strong> after confirmation. Availability is updated instantly.
                  </span>
                </div>
                <button
                  onClick={confirmBook}
                  style={{
                    width: '100%',
                    background: 'var(--ink)',
                    border: 'none',
                    color: 'var(--paper)',
                    padding: 16,
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: 15.5,
                    cursor: 'pointer',
                  }}
                  className="lift"
                >
                  Confirm &amp; book — €{total}
                </button>
              </div>
            )}

            <div
              style={{
                background: 'var(--paper)',
                borderTop: '1px solid var(--line)',
                padding: '13px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--mono)',
                fontSize: 10,
                letterSpacing: '.06em',
                color: 'var(--mut)',
              }}
            >
              <Icon name="lock" size={13} />
              SECURE SSL/TLS CHECKOUT
            </div>
          </div>
          <button
            onClick={() => nav('/messages')}
            style={{
              width: '100%',
              marginTop: 12,
              background: 'none',
              border: '1px solid var(--line)',
              color: 'var(--ink)',
              padding: 13,
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
            className="lift"
          >
            <Icon name="message" size={16} />
            Message the organizer
          </button>
        </div>
      </div>
    </div>
  );
}
