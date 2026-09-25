import type { CSSProperties } from 'react';

/* ============================================================
   Icon set — the exact stroke SVGs used throughout Kairos.
   All are 24×24, fill:none, stroke:currentColor.
   ============================================================ */

const PATHS: Record<string, string> = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  message: '<path d="M4 4h16v12H5.2L4 17.5z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  pin: '<path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  download: '<path d="M12 3v12M8 11l4 4 4-4M5 21h14"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/>',
  tag: '<path d="M4 8h16M8 4v4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.5"/>',
};

export interface IconProps {
  name: keyof typeof PATHS;
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: CSSProperties;
}

export function Icon({ name, size = 17, strokeWidth = 2, color = 'currentColor', style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      style={style}
      dangerouslySetInnerHTML={{ __html: PATHS[name] }}
    />
  );
}
