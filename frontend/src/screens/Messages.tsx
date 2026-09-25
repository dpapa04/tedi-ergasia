import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { api } from '../services/api';
import type { Message } from '../types';

export function Messages() {
  const [folder, setFolder] = useState<'inbox' | 'sent'>('inbox');
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [inboxCount, setInboxCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [unread, setUnread] = useState(0);

  const loadCounts = () => {
    api.listMessages('inbox').then((m) => setInboxCount(m.length));
    api.listMessages('sent').then((m) => setSentCount(m.length));
    api.unreadCount().then(setUnread);
  };

  useEffect(() => {
    api.listMessages(folder).then(setMsgs);
  }, [folder]);

  useEffect(() => {
    loadCounts();
  }, []);

  const remove = (id: number) => {
    api.deleteMessage(id).then(() => {
      api.listMessages(folder).then(setMsgs);
      loadCounts();
    });
  };

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '44px 32px 90px' }}>
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
          Inbox
        </div>
        <h1
          style={{
            fontFamily: 'var(--display)',
            fontWeight: 700,
            fontSize: 'clamp(34px,4.4vw,52px)',
            letterSpacing: '-.035em',
            margin: '0 0 28px',
            lineHeight: 0.98,
          }}
        >
          Messages
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, alignItems: 'start' }}>
          {/* sidebar */}
          <div
            style={{
              background: 'var(--white)',
              border: '1px solid var(--line)',
              borderRadius: 18,
              padding: 10,
            }}
          >
            <button
              onClick={() => setFolder('inbox')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                border: 'none',
                borderRadius: 12,
                background: folder === 'inbox' ? 'var(--ink)' : 'transparent',
                cursor: 'pointer',
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontWeight: 600,
                  fontSize: 14.5,
                  color: folder === 'inbox' ? 'var(--paper)' : 'var(--ink)',
                }}
              >
                <Icon name="message" size={17} />
                Inbox
              </span>
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  background: 'var(--accent)',
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: 999,
                }}
              >
                {unread}
              </span>
            </button>
            <button
              onClick={() => setFolder('sent')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 14px',
                border: 'none',
                borderRadius: 12,
                background: folder === 'sent' ? 'var(--ink)' : 'transparent',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14.5,
                color: folder === 'sent' ? 'var(--paper)' : 'var(--ink)',
              }}
            >
              <Icon name="send" size={17} />
              Sent
            </button>
            <div style={{ borderTop: '1px solid var(--line-2)', margin: '10px 6px' }} />
            <div
              style={{
                padding: '8px 14px',
                fontFamily: 'var(--mono)',
                fontSize: 9.5,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: 'var(--mut-2)',
              }}
            >
              {inboxCount} received · {sentCount} sent
            </div>
          </div>

          {/* list */}
          <div
            style={{
              background: 'var(--white)',
              border: '1px solid var(--line)',
              borderRadius: 18,
              overflow: 'hidden',
            }}
          >
            {msgs.map((m) => (
              <div
                key={m.id}
                className="msg-row"
                style={{
                  display: 'flex',
                  gap: 15,
                  padding: '18px 22px',
                  borderBottom: '1px solid var(--line-2)',
                  cursor: 'pointer',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: 'var(--ink)',
                    color: 'var(--paper)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 15,
                    flex: 'none',
                  }}
                >
                  {m.from.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 14.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      {m.from}
                      {m.unread && (
                        <span
                          style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }}
                        />
                      )}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: 11,
                        color: 'var(--mut-2)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {m.time}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginTop: 3 }}>{m.sub}</div>
                  <div
                    style={{
                      fontSize: 13,
                      color: 'var(--mut)',
                      marginTop: 4,
                      lineHeight: 1.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {m.body}
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 9,
                      fontFamily: 'var(--mono)',
                      fontSize: 10,
                      letterSpacing: '.06em',
                      textTransform: 'uppercase',
                      color: 'var(--accent)',
                      background: 'rgba(255,77,28,.07)',
                      padding: '4px 9px',
                      borderRadius: 999,
                    }}
                  >
                    <Icon name="tag" size={11} />
                    {m.ev}
                  </div>
                </div>
                <button
                  onClick={() => remove(m.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--mut-2)',
                    cursor: 'pointer',
                    flex: 'none',
                    padding: 4,
                  }}
                  className="lift"
                  title="Delete"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
