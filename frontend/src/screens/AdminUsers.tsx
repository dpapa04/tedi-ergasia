import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { api } from '../services/api';
import type { User } from '../types';

/** Build a Blob from a string and trigger a browser download. */
function download(content: string, mime: string, filename: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);

  const reload = () => api.listUsers().then(setUsers);

  useEffect(() => {
    reload();
  }, []);

  const pendingCount = users.filter((u) => u.status === 'Pending').length;

  const exportXML = async () => download(await api.exportXML(), 'text/xml', 'events.xml');
  const exportJSON = async () => download(await api.exportJSON(), 'application/json', 'events.json');

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '44px 32px 90px' }}>
        {/* header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 24,
            marginBottom: 30,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 11,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: 10,
              }}
            >
              Administration
            </div>
            <h1
              style={{
                fontFamily: 'var(--display)',
                fontWeight: 700,
                fontSize: 'clamp(34px,4.4vw,52px)',
                letterSpacing: '-.035em',
                margin: 0,
                lineHeight: 0.98,
              }}
            >
              User management
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={exportXML}
              style={{
                background: 'var(--white)',
                border: '1px solid var(--line)',
                color: 'var(--ink)',
                padding: '11px 18px',
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 13.5,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              className="lift"
            >
              <Icon name="download" size={15} />
              Export XML
            </button>
            <button
              onClick={exportJSON}
              style={{
                background: 'var(--white)',
                border: '1px solid var(--line)',
                color: 'var(--ink)',
                padding: '11px 18px',
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 13.5,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              className="lift"
            >
              <Icon name="download" size={15} />
              Export JSON
            </button>
          </div>
        </div>

        {/* stat tiles */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 26 }}>
          <div
            style={{
              background: 'var(--white)',
              border: '1px solid var(--line)',
              borderRadius: 16,
              padding: '16px 22px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 9.5,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: 'var(--mut-2)',
              }}
            >
              Total users
            </div>
            <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 28, marginTop: 4 }}>
              {users.length}
            </div>
          </div>
          <div
            style={{
              background: 'var(--ink)',
              color: 'var(--paper)',
              borderRadius: 16,
              padding: '16px 22px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 9.5,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: 'var(--mut-dk2)',
              }}
            >
              Pending approval
            </div>
            <div
              style={{
                fontFamily: 'var(--display)',
                fontWeight: 800,
                fontSize: 28,
                marginTop: 4,
                color: 'var(--accent)',
              }}
            >
              {pendingCount}
            </div>
          </div>
        </div>

        {/* users table */}
        <div
          style={{
            background: 'var(--white)',
            border: '1px solid var(--line)',
            borderRadius: 20,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2.2fr 1.4fr 1fr 1fr auto',
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
            <span>User</span>
            <span>Contact</span>
            <span>Role</span>
            <span>Status</span>
            <span style={{ textAlign: 'right' }}>Action</span>
          </div>

          {users.map((u) => {
            const approved = u.status === 'Approved';
            const statusBg = approved ? 'rgba(6,167,125,.12)' : 'rgba(224,161,0,.14)';
            const statusFg = approved ? '#06A77D' : '#9A6B00';
            return (
              <div
                key={u.u}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2.2fr 1.4fr 1fr 1fr auto',
                  gap: 16,
                  padding: '16px 24px',
                  borderBottom: '1px solid var(--line-2)',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'var(--ink)',
                      color: 'var(--paper)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 14,
                      flex: 'none',
                    }}
                  >
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14.5 }}>{u.name}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--mut)' }}>
                      @{u.u}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--mut)' }}>
                  {u.email}
                  <br />
                  <span style={{ color: 'var(--mut-2)' }}>
                    {u.city} · ΑΦΜ {u.afm}
                  </span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{u.role}</div>
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 10,
                      letterSpacing: '.05em',
                      background: statusBg,
                      color: statusFg,
                      padding: '5px 11px',
                      borderRadius: 999,
                    }}
                  >
                    {u.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  {u.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => api.approveUser(u.id ?? '').then(reload)}
                        style={{
                          background: 'var(--sports)',
                          border: 'none',
                          color: '#fff',
                          width: 34,
                          height: 34,
                          borderRadius: 9,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        className="lift"
                        title="Approve"
                      >
                        <Icon name="check" size={16} strokeWidth={2.2} />
                      </button>
                      <button
                        onClick={() => api.rejectUser(u.id ?? '').then(reload)}
                        style={{
                          background: 'var(--white)',
                          border: '1px solid var(--line)',
                          color: 'var(--accent)',
                          width: 34,
                          height: 34,
                          borderRadius: 9,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        className="lift"
                        title="Reject"
                      >
                        <Icon name="x" size={15} strokeWidth={2.2} />
                      </button>
                    </>
                  )}
                  <button
                    style={{
                      background: 'var(--white)',
                      border: '1px solid var(--line)',
                      color: 'var(--mut)',
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    className="lift"
                    title="View"
                  >
                    <Icon name="eye" size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
