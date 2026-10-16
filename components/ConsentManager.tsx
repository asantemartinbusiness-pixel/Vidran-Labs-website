"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { optionalConsentCategories } from "@/content/site";
import { readConsent, writeConsent } from "@/lib/consent";

const OPEN_EVENT = "vl:open-consent";

export function CookieSettingsButton() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))} aria-haspopup="dialog">
      Cookie settings
    </button>
  );
}

/**
 * Consent banner + preferences dialog. The banner appears only when optional
 * categories are configured and the visitor has not yet decided. Optional
 * technology must stay unloaded until hasConsent(category) is true.
 */
export function ConsentManager() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [choices, setChoices] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);
  const hasOptional = optionalConsentCategories.length > 0;

  useEffect(() => {
    const existing = readConsent();
    setChoices(existing?.categories ?? {});
    setShowBanner(hasOptional && !existing);

    const open = () => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setChoices(readConsent()?.categories ?? {});
      setSaved(false);
      dialogRef.current?.showModal();
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, [hasOptional]);

  const close = () => {
    dialogRef.current?.close();
  };

  const decide = (categories: Record<string, boolean>) => {
    writeConsent(categories);
    setChoices(categories);
    setShowBanner(false);
    setSaved(true);
  };

  const all = (value: boolean) => Object.fromEntries(optionalConsentCategories.map((c) => [c.id, value]));

  return (
    <>
      {showBanner ? (
        <section className="consent-banner" aria-labelledby="consent-banner-title">
          <h2 id="consent-banner-title" className="notice__title">
            Cookie preferences
          </h2>
          <p className="notice__body">
            We use optional cookies only with your permission. See our <Link className="link" href="/cookie-policy/">cookie policy</Link>.
          </p>
          <div className="btn-group" style={{ marginTop: "var(--space-4)" }}>
            <button type="button" className="btn" onClick={() => decide(all(true))}>
              Accept optional
            </button>
            <button type="button" className="btn btn--secondary" onClick={() => decide(all(false))}>
              Reject optional
            </button>
            <button type="button" className="btn btn--text" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
              Choose
            </button>
          </div>
        </section>
      ) : null}

      <dialog
        ref={dialogRef}
        className="dialog"
        aria-labelledby="consent-dialog-title"
        onClose={() => returnFocus.current?.focus()}
      >
        <div className="dialog__inner">
          <h2 id="consent-dialog-title" className="dialog__title">
            Cookie settings
          </h2>

          <div className="consent-row">
            <strong>Strictly necessary</strong>
            <span className="meta">Always on</span>
            <p className="consent-row__desc">
              Remembers the choices you make here. Stored only in your browser.
            </p>
          </div>

          {hasOptional ? (
            optionalConsentCategories.map((c) => (
              <div className="consent-row" key={c.id}>
                <label htmlFor={`consent-${c.id}`}>
                  <strong>{c.label}</strong>
                </label>
                <input
                  id={`consent-${c.id}`}
                  type="checkbox"
                  checked={choices[c.id] === true}
                  onChange={(e) => setChoices((prev) => ({ ...prev, [c.id]: e.target.checked }))}
                />
                <p className="consent-row__desc">{c.description}</p>
              </div>
            ))
          ) : (
            <p className="notice__body">
              This website does not use analytics, advertising or other optional cookies, so there is nothing to switch on or
              off. If that changes, optional categories will appear here and stay off until you allow them.
            </p>
          )}

          <p role="status" className="form-footnote">
            {saved ? "Your preferences have been saved." : ""}
          </p>

          <div className="btn-group">
            {hasOptional ? (
              <button type="button" className="btn" onClick={() => decide(choices)}>
                Save preferences
              </button>
            ) : null}
            <button type="button" className={hasOptional ? "btn btn--secondary" : "btn"} onClick={close}>
              Close
            </button>
            <Link className="link" href="/cookie-policy/" onClick={close}>
              Cookie policy
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
