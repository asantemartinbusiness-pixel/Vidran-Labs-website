export function Chevron() {
  return (
    <svg className="chevron" viewBox="0 0 10 10" aria-hidden="true" focusable="false">
      <path d="M1.5 3.5L5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function Arrow() {
  return (
    <svg className="btn__arrow" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      <path d="M1 7h11M8 3l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7v4.5M8 4.5v.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
