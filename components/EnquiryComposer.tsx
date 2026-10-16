"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { buildMailto, composeEnquiry, validateField, type EnquiryErrors, type EnquiryValues } from "@/lib/enquiry";
import type { ContactRoute } from "@/lib/types";

type Prepared = { href: string; subject: string; body: string };

export function EnquiryComposer({ route }: { route: ContactRoute }) {
  const uid = useId();
  const [values, setValues] = useState<EnquiryValues>({});
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [prepared, setPrepared] = useState<Prepared | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const fieldId = (name: string) => `${uid}-${name}`;
  const directHref = buildMailto(route.email, route.subjectPrefix);

  const update = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    // After a failed attempt, re-validate as the visitor corrects fields.
    if (submitted) {
      const field = route.fields.find((f) => f.name === name)!;
      setErrors((prev) => {
        const next = { ...prev };
        const err = validateField(field, value);
        if (err) next[name] = err;
        else delete next[name];
        return next;
      });
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (prepared) return; // guard against double activation
    setSubmitted(true);
    const result = composeEnquiry(route, values);
    if (!result.ok) {
      setErrors(result.errors);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setErrors({});
    setPrepared({ href: result.href, subject: result.subject, body: result.body });
    window.location.href = result.href;
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const copy = async () => {
    if (!prepared) return;
    const text = `To: ${route.email}\nSubject: ${prepared.subject}\n\n${prepared.body}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  const reset = () => {
    setPrepared(null);
    setValues({});
    setErrors({});
    setSubmitted(false);
    setCopyState("idle");
  };

  if (prepared) {
    return (
      <div ref={statusRef} tabIndex={-1} className="form-status" role="status" aria-live="polite">
        <p className="form-status__title">Your email app should now open with a prepared message.</p>
        <p>
          Nothing has been sent yet. Review the message in your email app and send it to <strong>{route.email}</strong>. If no
          email app opened, open it again or copy the message into any email service.
        </p>
        <div className="btn-group">
          <a className="btn" href={prepared.href}>
            Open email again
          </a>
          <button type="button" className="btn btn--secondary" onClick={copy}>
            Copy message
          </button>
          <button type="button" className="btn btn--text" onClick={reset}>
            Start over
          </button>
        </div>
        <p className="form-footnote" aria-live="polite">
          {copyState === "copied" ? "Message copied to your clipboard." : copyState === "failed" ? `Copy failed. Email ${route.email} directly.` : ""}
        </p>
      </div>
    );
  }

  const errorEntries = Object.entries(errors);

  return (
    <>
      <noscript>
        <p className="notice">
          <span>
            Email us at{" "}
            <a className="link" href={directHref}>
              {route.email}
            </a>
            .
          </span>
        </p>
      </noscript>
      <form className="enquiry" noValidate onSubmit={onSubmit} aria-describedby={`${uid}-how`}>
        {errorEntries.length > 0 ? (
          <div ref={summaryRef} tabIndex={-1} className="form-summary" role="alert" aria-labelledby={`${uid}-summary`}>
            <p id={`${uid}-summary`} className="form-summary__title">
              There {errorEntries.length === 1 ? "is a problem" : `are ${errorEntries.length} problems`} with your enquiry
            </p>
            <ul>
              {errorEntries.map(([name, msg]) => (
                <li key={name}>
                  <a href={`#${fieldId(name)}`}>{msg}</a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {route.fields.map((field) => {
          const id = fieldId(field.name);
          const error = errors[field.name];
          const describedBy = [field.hint ? `${id}-hint` : null, error ? `${id}-error` : null, field.kind === "textarea" ? `${id}-count` : null]
            .filter(Boolean)
            .join(" ");
          const common = {
            id,
            name: field.name,
            className: "field__control",
            required: field.required,
            "aria-required": field.required,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": describedBy || undefined,
            value: values[field.name] ?? "",
            autoComplete: field.autoComplete,
          } as const;
          return (
            <div key={field.name} className={`field${error ? " field--invalid" : ""}`}>
              <label className="field__label" htmlFor={id}>
                {field.label}
                {!field.required ? <span className="field__optional"> (optional)</span> : null}
              </label>
              {field.hint ? (
                <p id={`${id}-hint`} className="field__hint">
                  {field.hint}
                </p>
              ) : null}
              {error ? (
                <p id={`${id}-error`} className="field__error">
                  <span className="visually-hidden">Error:</span> {error}
                </p>
              ) : null}
              {field.kind === "textarea" ? (
                <>
                  <textarea {...common} rows={6} maxLength={field.maxLength} onChange={(e) => update(field.name, e.target.value)} />
                  <p id={`${id}-count`} className="field__count">
                    {(values[field.name] ?? "").length} / {field.maxLength} characters
                  </p>
                </>
              ) : field.kind === "select" ? (
                <select {...common} onChange={(e) => update(field.name, e.target.value)}>
                  <option value="">Select…</option>
                  {field.options!.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input {...common} type={field.autoComplete === "url" ? "url" : "text"} maxLength={field.maxLength} onChange={(e) => update(field.name, e.target.value)} />
              )}
            </div>
          );
        })}

        <div className="btn-group">
          <button type="submit" className="btn">
            Prepare email
          </button>
        </div>
        <p id={`${uid}-how`} className="form-footnote">
          Opens your email app with your message addressed to {route.label.toLowerCase()}. Nothing is sent or stored by this
          website. Prefer to write directly? Email{" "}
          <a href={directHref}>{route.email}</a>. See our <Link href="/privacy-policy/">privacy policy</Link>.
        </p>
      </form>
    </>
  );
}
