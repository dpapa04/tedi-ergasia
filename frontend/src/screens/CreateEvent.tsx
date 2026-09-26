import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { api } from '../services/api';

interface TicketRow {
  name: string;
  price: string;
  quantity: string;
}

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: 12.5,
  fontWeight: 600,
  color: 'var(--mut)',
  marginBottom: 7,
};

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '13px 15px',
  border: '1px solid var(--line)',
  borderRadius: 11,
  background: 'var(--paper)',
  fontSize: 14.5,
  outline: 'none',
};

const cardStyle: CSSProperties = {
  background: 'var(--white)',
  border: '1px solid var(--line)',
  borderRadius: 22,
  padding: 32,
  marginBottom: 22,
};

const cardLabelStyle: CSSProperties = {
  fontFamily: 'var(--mono)',
  fontSize: 10.5,
  letterSpacing: '.12em',
  textTransform: 'uppercase',
  color: 'var(--mut-2)',
};

const ticketInputStyle: CSSProperties = {
  padding: '11px 13px',
  border: '1px solid var(--line)',
  borderRadius: 10,
  background: 'var(--paper)',
  fontSize: 14,
  outline: 'none',
};

export function CreateEvent() {
  const nav = useNavigate();
  const [capacity, setCapacity] = useState('350');
  const [tickets, setTickets] = useState<TicketRow[]>([
    { name: 'General Admission', price: '28', quantity: '250' },
    { name: 'Student', price: '18', quantity: '70' },
  ]);
  const [error, setError] = useState('');

  const allocated = tickets.reduce((a, t) => a + (Number(t.quantity) || 0), 0);
  const overCapacity = allocated > (Number(capacity) || 0);

  const updateTicket = (index: number, field: keyof TicketRow, value: string) => {
    setTickets((rows) => rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const removeTicket = (index: number) => {
    setTickets((rows) => rows.filter((_, i) => i !== index));
  };

  const addTicket = () => {
    setTickets((rows) => [...rows, { name: '', price: '', quantity: '' }]);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      await api.createEvent({
        title: values.title,
        eventType: values.eventType,
        categories: String(values.categories).split(',').map((category) => category.trim()).filter(Boolean),
        description: values.description,
        venue: values.venue,
        address: values.address,
        city: values.city,
        country: values.country,
        startDateTime: values.startDateTime,
        endDateTime: values.endDateTime,
        capacity: Number(values.capacity),
        tickets: tickets.map((ticket) => ({ name: ticket.name.trim(), price: Number(ticket.price), quantity: Number(ticket.quantity) })),
        status: values.submitAction === 'publish' ? 'PUBLISHED' : 'DRAFT',
      });
      nav('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save event.');
    }
  };

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 840, margin: '0 auto', padding: '36px 32px 90px' }}>
        <button
          onClick={() => nav('/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--mut)',
            fontSize: 13.5,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            marginBottom: 22,
            padding: 0,
          }}
        >
          <Icon name="chevronLeft" size={15} />
          Back to events
        </button>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 10 }}>
          New event
        </div>
        <h1 style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 42, letterSpacing: '-.035em', margin: '0 0 30px' }}>
          Create an event
        </h1>

        <form onSubmit={submit}>
        <div style={cardStyle}>
          <div style={{ ...cardLabelStyle, marginBottom: 18 }}>Basics</div>
          <label style={labelStyle}>Title</label>
          <input name="title" required placeholder="e.g. Nocturnal — Live" style={{ ...inputStyle, marginBottom: 18 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
            <div>
              <label style={labelStyle}>Event type</label>
              <select name="eventType" style={inputStyle}>
                <option>Concert</option>
                <option>Theatre</option>
                <option>Sports</option>
                <option>Seminar</option>
                <option>Cinema</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Categories</label>
              <input name="categories" required placeholder="Music, Live Performance" style={inputStyle} />
            </div>
          </div>
          <label style={labelStyle}>Description</label>
          <textarea
            rows={3}
            placeholder="Tell guests what to expect…"
            name="description"
            required
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'var(--sans)' }}
          />
        </div>

        <div style={cardStyle}>
          <div style={{ ...cardLabelStyle, marginBottom: 18 }}>Venue &amp; time</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Venue</label>
              <input name="venue" required placeholder="Technopolis" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input name="city" required placeholder="Athens" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Address</label>
              <input name="address" required placeholder="25 Central Avenue" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Country</label>
              <input name="country" required defaultValue="Greece" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Starts</label>
              <input name="startDateTime" required type="datetime-local" style={{ ...inputStyle, color: 'var(--mut)' }} />
            </div>
            <div>
              <label style={labelStyle}>Ends</label>
              <input name="endDateTime" required type="datetime-local" style={{ ...inputStyle, color: 'var(--mut)' }} />
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <span style={cardLabelStyle}>Capacity &amp; tickets</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: overCapacity ? 'var(--accent)' : 'var(--sports)' }}>
              {allocated} / {capacity} allocated
            </span>
          </div>
          <label style={labelStyle}>Total capacity</label>
          <input
            value={capacity}
            name="capacity"
            required
            onChange={(ev) => setCapacity(ev.target.value)}
            style={{ ...inputStyle, width: 160, marginBottom: 20 }}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr auto',
              gap: 12,
              fontFamily: 'var(--mono)',
              fontSize: 10,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              color: 'var(--mut-2)',
              marginBottom: 10,
            }}
          >
            <span>Ticket name</span>
            <span>Price €</span>
            <span>Quantity</span>
            <span></span>
          </div>
          {tickets.map((t, i) => (
            <div
              key={i}
              style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 12, marginBottom: 10, alignItems: 'center' }}
            >
              <input required value={t.name} onChange={(ev) => updateTicket(i, 'name', ev.target.value)} style={ticketInputStyle} />
              <input required type="number" min="0" value={t.price} onChange={(ev) => updateTicket(i, 'price', ev.target.value)} style={ticketInputStyle} />
              <input required type="number" min="1" value={t.quantity} onChange={(ev) => updateTicket(i, 'quantity', ev.target.value)} style={ticketInputStyle} />
              <button
                type="button"
                onClick={() => removeTicket(i)}
                style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid var(--line)', background: 'var(--white)', cursor: 'pointer', color: 'var(--mut)' }}
                className="lift"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTicket}
            style={{
              background: 'none',
              border: '1px dashed var(--line)',
              color: 'var(--ink)',
              padding: '11px 16px',
              borderRadius: 11,
              fontWeight: 600,
              fontSize: 13.5,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              marginTop: 4,
            }}
            className="lift"
          >
            <Icon name="plus" size={15} />
            Add ticket type
          </button>
        </div>

        {error && <div style={{ color: 'var(--accent)', marginBottom: 14 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            type="submit"
            name="submitAction"
            value="draft"
            style={{ background: 'var(--white)', border: '1px solid var(--line)', color: 'var(--ink)', padding: '14px 26px', borderRadius: 999, fontWeight: 600, fontSize: 14.5, cursor: 'pointer' }}
            className="lift"
          >
            Save as draft
          </button>
          <button
            type="submit"
            name="submitAction"
            value="publish"
            style={{ background: 'var(--accent)', border: 'none', color: '#fff', padding: '14px 28px', borderRadius: 999, fontWeight: 600, fontSize: 14.5, cursor: 'pointer' }}
            className="lift"
          >
            Publish event
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}
