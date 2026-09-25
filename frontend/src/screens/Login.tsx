import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Icon } from '../components/Icon';

export function Login() {
  const nav = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* ---------------- left dark panel ---------------- */}
      <div
        style={{
          background: 'var(--ink)',
          color: 'var(--paper)',
          position: 'relative',
          overflow: 'hidden',
          padding: 48,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 20% 10%,rgba(255,77,28,.22),transparent 60%)',
          }}
        />
        <div style={{ position: 'relative' }}>
          <Logo size={22} onDark onClick={() => nav('/')} />
        </div>
        <div style={{ position: 'relative' }}>
          <h2
            style={{
              fontFamily: 'var(--display)',
              fontWeight: 700,
              fontSize: 46,
              lineHeight: 1.0,
              letterSpacing: '-.035em',
              margin: '0 0 18px',
            }}
          >
            Your seat is<br />waiting.
          </h2>
          <p style={{ fontSize: 16, color: 'var(--mut-dk)', maxWidth: 340, margin: 0, lineHeight: 1.55 }}>
            Pick up where you left off — your bookings, messages and recommendations, all in one place.
          </p>
        </div>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'var(--mono)',
            fontSize: 11,
            letterSpacing: '.06em',
            color: 'var(--mut-dk2)',
          }}
        >
          <Icon name="lock" size={14} />
          SECURED WITH SSL / TLS ENCRYPTION
        </div>
      </div>

      {/* ---------------- right form ---------------- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 11,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 12,
            }}
          >
            Welcome back
          </div>
          <h1
            style={{
              fontFamily: 'var(--display)',
              fontWeight: 700,
              fontSize: 34,
              letterSpacing: '-.03em',
              margin: '0 0 30px',
            }}
          >
            Log in
          </h1>
          <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--mut)', marginBottom: 7 }}>
            Username
          </label>
          <input
            defaultValue="maria21"
            style={{
              width: '100%',
              padding: '14px 16px',
              border: '1px solid var(--line)',
              borderRadius: 12,
              background: 'var(--white)',
              fontSize: 15,
              outline: 'none',
              marginBottom: 18,
            }}
          />
          <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--mut)', marginBottom: 7 }}>
            Password
          </label>
          <input
            type="password"
            defaultValue="password"
            style={{
              width: '100%',
              padding: '14px 16px',
              border: '1px solid var(--line)',
              borderRadius: 12,
              background: 'var(--white)',
              fontSize: 15,
              outline: 'none',
              marginBottom: 14,
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 24,
              fontSize: 13,
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--mut)', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent)', width: 15, height: 15 }} />
              Remember me
            </label>
            <span style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>Forgot password?</span>
          </div>
          <button
            onClick={() => nav('/browse')}
            style={{
              width: '100%',
              background: 'var(--accent)',
              border: 'none',
              color: '#fff',
              padding: 15,
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 15.5,
              cursor: 'pointer',
            }}
            className="lift"
          >
            Log in
          </button>
          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: 'var(--mut)' }}>
            New to skene?{' '}
            <span
              onClick={() => nav('/register')}
              style={{
                color: 'var(--ink)',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
                textUnderlineOffset: 3,
              }}
            >
              Create an account
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
