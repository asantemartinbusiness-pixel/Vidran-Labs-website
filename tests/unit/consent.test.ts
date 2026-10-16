import { beforeEach, describe, expect, it } from "vitest";
import { CONSENT_KEY, clearConsent, hasConsent, readConsent, subscribe, writeConsent } from "@/lib/consent";

class MemoryStorage {
  private m = new Map<string, string>();
  getItem(k: string) {
    return this.m.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.m.set(k, v);
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
}

beforeEach(() => {
  (globalThis as unknown as { window: unknown }).window = { localStorage: new MemoryStorage() };
});

describe("consent store", () => {
  it("defaults to no consent for any optional category", () => {
    expect(readConsent()).toBeNull();
    expect(hasConsent("analytics")).toBe(false);
  });

  it("persists and revises choices", () => {
    writeConsent({ analytics: true });
    expect(hasConsent("analytics")).toBe(true);
    writeConsent({ analytics: false });
    expect(hasConsent("analytics")).toBe(false);
  });

  it("ignores corrupted or outdated stored values", () => {
    (globalThis as any).window.localStorage.setItem(CONSENT_KEY, "{not json");
    expect(readConsent()).toBeNull();
    (globalThis as any).window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: 0, categories: { analytics: true } }));
    expect(hasConsent("analytics")).toBe(false);
  });

  it("notifies subscribers on change and clear", () => {
    const seen: unknown[] = [];
    const off = subscribe((s) => seen.push(s?.categories ?? null));
    writeConsent({ analytics: true });
    clearConsent();
    off();
    writeConsent({ analytics: false });
    expect(seen).toEqual([{ analytics: true }, null]);
  });

  it("survives storage that throws (private mode)", () => {
    (globalThis as any).window = {
      get localStorage(): Storage {
        throw new Error("blocked");
      },
    };
    expect(() => writeConsent({ analytics: true })).not.toThrow();
    expect(readConsent()).toBeNull();
  });
});
