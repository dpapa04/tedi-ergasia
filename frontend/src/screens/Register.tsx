import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Icon } from '../components/Icon';
import { api } from '../services/api';

const sectionLabel: React.CSSProperties = {
  fontFamily: 'var(--mono)',
  fontSize: 10.5,
  letterSpacing: '.12em',
  textTransform: 'uppercase',
  color: 'var(--mut-2)',
  marginBottom: 18,
};

const fieldLabel: React.CSSProperties = {
  display: 'block',
  fontSize: 12.5,
  fontWeight: 600,
  color: 'var(--mut)',
  marginBottom: 7,
};

const fieldInput: React.CSSProperties = {
  width: '100%',
  padding: '13px 15px',
  border: '1px solid var(--line)',
  borderRadius: 11,
  background: 'var(--paper)',
  fontSize: 14.5,
  outline: 'none',
};

export function Register() {
  const nav = useNavigate();
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      await api.register({ ...values, country: 'Greece' });
      setRegistered(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit registration.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '36px 32px 80px' }}>
        <div style={{ marginBottom: 34 }}>
          <Logo size={21} onClick={() => nav('/')} />
        </div>

        {registered ? (
          <div
            style={{
              background: 'var(--white)',
              border: '1px solid var(--line)',
              borderRadius: 24,
              padding: '54px 48px',
              textAlign: 'center',
              maxWidth: 520,
              margin: '40px auto',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(255,77,28,.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 22px',
              }}
            >
              <Icon name="clock" size={30} color="var(--accent)" />
            </div>
            <h1
              style={{
                fontFamily: 'var(--display)',
                fontWeight: 700,
                fontSize: 30,
                letterSpacing: '-.03em',
                margin: '0 0 12px',
              }}
            >
              Application received
            </h1>
            <p style={{ fontSize: 15.5, color: 'var(--mut)', lineHeight: 1.6, margin: '0 0 28px' }}>
              Thanks, Nikos. Your registration is <strong style={{ color: 'var(--ink)' }}>pending approval</strong> by an
              administrator. We'll email you the moment your account is activated — usually within a few hours.
            </p>
            <button
              onClick={() => nav('/login')}
              style={{
                background: 'var(--ink)',
                border: 'none',
                color: 'var(--paper)',
                padding: '13px 28px',
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
              }}
              className="lift"
            >
              Back to log in
            </button>
          </div>
        ) : (
          <>
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
              Join skene
            </div>
            <h1
              style={{
                fontFamily: 'var(--display)',
                fontWeight: 700,
                fontSize: 40,
                letterSpacing: '-.035em',
                margin: '0 0 8px',
              }}
            >
              Create your account
            </h1>
            <p style={{ fontSize: 15.5, color: 'var(--mut)', margin: '0 0 34px' }}>
              One account to discover events and to organize your own.
            </p>
            <form onSubmit={submit} style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 24, padding: 34 }}>
              <div style={sectionLabel}>Account</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={fieldLabel}>Username</label>
                  <input name="username" required placeholder="e.g. nikos_k" style={fieldInput} />
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      color: 'var(--sports)',
                      marginTop: 7,
                    }}
                  >
                    <Icon name="check" size={13} />
                    nikos_k is available
                  </span>
                </div>
                <div>
                  <label style={fieldLabel}>Password</label>
                  <input name="password" required type="password" placeholder="••••••••" style={fieldInput} />
                </div>
                <div>
                  <label style={fieldLabel}>Confirm password</label>
                  <input name="confirmPassword" required type="password" placeholder="••••••••" style={fieldInput} />
                </div>
              </div>
              <div style={sectionLabel}>Personal details</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={fieldLabel}>First name</label>
                  <input name="firstName" required style={fieldInput} />
                </div>
                <div>
                  <label style={fieldLabel}>Last name</label>
                  <input name="lastName" required style={fieldInput} />
                </div>
                <div>
                  <label style={fieldLabel}>Email</label>
                  <input name="email" required type="email" style={fieldInput} />
                </div>
                <div>
                  <label style={fieldLabel}>Phone</label>
                  <input name="phone" required style={fieldInput} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={fieldLabel}>Address</label>
                  <input name="address" required style={fieldInput} />
                </div>
                <div>
                  <label style={fieldLabel}>City</label>
                  <input name="city" required style={fieldInput} />
                </div>
                <div>
                  <label style={fieldLabel}>Tax ID (ΑΦΜ)</label>
                  <input name="vatNumber" required style={fieldInput} />
                </div>
              </div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  marginTop: 24,
                  fontSize: 13.5,
                  color: 'var(--mut)',
                  cursor: 'pointer',
                  lineHeight: 1.5,
                }}
              >
                <input
                  type="checkbox"
                  style={{ accentColor: 'var(--accent)', width: 16, height: 16, marginTop: 1, flex: 'none' }}
                />
                I agree to the Terms of Service and acknowledge the Privacy Policy.
              </label>
              {error && <div style={{ color: 'var(--accent)', marginTop: 20 }}>{error}</div>}
              <button type="submit"
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
                  marginTop: 24,
                }}
                className="lift"
              >
                Create account
              </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: 'var(--mut)' }}>
              Already have an account?{' '}
              <span
                onClick={() => nav('/login')}
                style={{
                  color: 'var(--ink)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                }}
              >
                Log in
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
