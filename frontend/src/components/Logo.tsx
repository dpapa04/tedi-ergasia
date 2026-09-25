/* Skene wordmark: accent "S" badge + display wordmark. */
export function Logo({
  size = 21,
  onDark = false,
  onClick,
}: {
  size?: number;
  onDark?: boolean;
  onClick?: () => void;
}) {
  const badge = Math.round(size * 1.24);
  const content = (
    <>
      <span
        style={{
          width: badge,
          height: badge,
          borderRadius: '50%',
          background: 'var(--accent)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: 'var(--display)',
          fontWeight: 800,
          fontSize: Math.round(size * 0.72),
        }}
      >
        S
      </span>
      <span
        style={{
          fontFamily: 'var(--display)',
          fontWeight: 800,
          fontSize: size,
          letterSpacing: '-0.02em',
          color: onDark ? 'var(--paper)' : 'var(--ink)',
        }}
      >
        skene
      </span>
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          padding: 0,
          color: onDark ? 'var(--paper)' : 'var(--ink)',
        }}
      >
        {content}
      </button>
    );
  }
  return <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>{content}</div>;
}
