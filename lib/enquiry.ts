import type { ContactRoute, EnquiryField } from "./types";

export type EnquiryValues = Record<string, string>;
export type EnquiryErrors = Record<string, string>;

/** Conservative ceiling: some mail clients truncate or reject longer mailto URLs. */
export const MAX_MAILTO_LENGTH = 2000;

// Strip control characters (except tab/newline) that could be used for header
// injection or that render badly in mail clients.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function sanitise(value: string, multiline: boolean): string {
  let v = value.replace(CONTROL_CHARS, "").replace(/\r\n?/g, "\n");
  if (!multiline) v = v.replace(/\s*\n\s*/g, " ");
  return v.trim();
}

export function validateField(field: EnquiryField, raw: string | undefined): string | null {
  const value = sanitise(raw ?? "", field.kind === "textarea");
  if (field.required && value.length === 0) return `Enter ${field.label.toLowerCase()}.`;
  if (value.length > field.maxLength) return `${field.label} must be ${field.maxLength} characters or fewer.`;
  if (field.kind === "select" && value && field.options && !field.options.includes(value)) {
    return `Choose a valid option for ${field.label.toLowerCase()}.`;
  }
  if (field.autoComplete === "url" && value && !/^https?:\/\/[^\s]+\.[^\s]+$/i.test(value)) {
    return "Enter a full link starting with https://";
  }
  return null;
}

export function validateEnquiry(route: ContactRoute, values: EnquiryValues): EnquiryErrors {
  const errors: EnquiryErrors = {};
  for (const field of route.fields) {
    const error = validateField(field, values[field.name]);
    if (error) errors[field.name] = error;
  }
  return errors;
}

export function buildSubject(route: ContactRoute, values: EnquiryValues): string {
  const org = sanitise(values.organisation ?? "", false);
  const name = sanitise(values.name ?? "", false);
  const who = [org, name].filter(Boolean).join(" — ");
  return who ? `${route.subjectPrefix}: ${who}` : route.subjectPrefix;
}

export function buildBody(route: ContactRoute, values: EnquiryValues): string {
  const lines: string[] = [];
  for (const field of route.fields) {
    if (field.name === "message") continue;
    const value = sanitise(values[field.name] ?? "", false);
    if (value) lines.push(`${field.label}: ${value}`);
  }
  const msg = sanitise(values.message ?? "", true);
  if (msg) lines.push("", msg);
  lines.push("", "—", `Sent via the ${route.label} pathway on vidran.net`);
  return lines.join("\n");
}

/** RFC 6068 mailto. encodeURIComponent encodes spaces as %20 (not "+"), as required. */
export function buildMailto(email: string, subject: string, body?: string): string {
  const params = [`subject=${encodeURIComponent(subject)}`];
  if (body) params.push(`body=${encodeURIComponent(body.replace(/\n/g, "\r\n"))}`);
  return `mailto:${email}?${params.join("&")}`;
}

export function composeEnquiry(route: ContactRoute, values: EnquiryValues) {
  const errors = validateEnquiry(route, values);
  if (Object.keys(errors).length > 0) return { ok: false as const, errors };
  const subject = buildSubject(route, values);
  const body = buildBody(route, values);
  const href = buildMailto(route.email, subject, body);
  if (href.length > MAX_MAILTO_LENGTH) {
    return {
      ok: false as const,
      errors: { message: "Your message is too long to hand to an email app. Shorten it, or email us directly and attach details." },
    };
  }
  return { ok: true as const, subject, body, href };
}
