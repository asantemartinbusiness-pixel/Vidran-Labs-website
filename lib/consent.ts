/**
 * Consent store. Strictly necessary storage only by default; optional categories
 * are off until the visitor opts in. Loaders for optional technology must call
 * hasConsent(category) and subscribe() before injecting anything.
 */
export const CONSENT_KEY = "vl-consent";
export const CONSENT_VERSION = 1;

export interface ConsentState {
  version: number;
  decidedAt: string;
  categories: Record<string, boolean>;
}

type Listener = (state: ConsentState | null) => void;
const listeners = new Set<Listener>();

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function readConsent(): ConsentState | null {
  const s = storage();
  if (!s) return null;
  try {
    const raw = s.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed?.version !== CONSENT_VERSION || typeof parsed.categories !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(categories: Record<string, boolean>): ConsentState {
  const state: ConsentState = { version: CONSENT_VERSION, decidedAt: new Date().toISOString(), categories: { ...categories } };
  try {
    storage()?.setItem(CONSENT_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: choice applies for this page view only */
  }
  listeners.forEach((l) => l(state));
  return state;
}

export function clearConsent(): void {
  try {
    storage()?.removeItem(CONSENT_KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l(null));
}

export function hasConsent(category: string): boolean {
  return readConsent()?.categories[category] === true;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
