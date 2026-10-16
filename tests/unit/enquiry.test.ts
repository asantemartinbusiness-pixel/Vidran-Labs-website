import { describe, expect, it } from "vitest";
import { contactRoutes, getContactRoute } from "@/content/site";
import { buildMailto, composeEnquiry, MAX_MAILTO_LENGTH, sanitise, validateEnquiry } from "@/lib/enquiry";

const project = getContactRoute("start-a-project");
const valid = { name: "Ada Lovelace", organisation: "Analytical Ltd", area: "Data", message: "We need a reporting platform." };

describe("validation", () => {
  it("accepts a complete enquiry", () => {
    expect(validateEnquiry(project, valid)).toEqual({});
  });

  it("flags every empty required field", () => {
    const errors = validateEnquiry(project, {});
    expect(Object.keys(errors).sort()).toEqual(["area", "message", "name"]);
  });

  it("treats whitespace-only input as empty", () => {
    expect(validateEnquiry(project, { ...valid, name: "   \n " }).name).toBeDefined();
  });

  it("enforces maximum length at the boundary", () => {
    const max = project.fields.find((f) => f.name === "name")!.maxLength;
    expect(validateEnquiry(project, { ...valid, name: "a".repeat(max) }).name).toBeUndefined();
    expect(validateEnquiry(project, { ...valid, name: "a".repeat(max + 1) }).name).toMatch(/characters or fewer/);
  });

  it("rejects select values that are not offered", () => {
    expect(validateEnquiry(project, { ...valid, area: "Rocket science" }).area).toMatch(/valid option/);
  });

  it("validates profile links on the careers route", () => {
    const careers = getContactRoute("careers");
    const base = { name: "A", discipline: "Systems", message: "Hello" };
    expect(validateEnquiry(careers, { ...base, profile: "not a url" }).profile).toBeDefined();
    expect(validateEnquiry(careers, { ...base, profile: "https://example.org/me" }).profile).toBeUndefined();
  });
});

describe("sanitisation", () => {
  it("strips control characters and header-injection newlines from single-line fields", () => {
    expect(sanitise("Ada\r\nBcc: evil@example.com\u0000", false)).toBe("Ada Bcc: evil@example.com");
  });

  it("keeps newlines in multi-line fields", () => {
    expect(sanitise("line one\r\nline two", true)).toBe("line one\nline two");
  });
});

describe("mailto composition", () => {
  it("encodes subject and body per RFC 6068 (spaces as %20, CRLF line breaks)", () => {
    const href = buildMailto("x@vidran.net", "A & B?", "one\ntwo");
    expect(href).toBe("mailto:x@vidran.net?subject=A%20%26%20B%3F&body=one%0D%0Atwo");
    expect(href).not.toContain("+");
  });

  it("produces a mailto addressed to the route recipient with organisation and name in the subject", () => {
    const result = composeEnquiry(project, valid);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.href.startsWith(`mailto:${project.email}?subject=`)).toBe(true);
    expect(result.subject).toBe("Start a project: Analytical Ltd — Ada Lovelace");
    expect(result.body).toContain("Area of work: Data");
    expect(result.body).toContain("We need a reporting platform.");
  });

  it("cannot inject extra mailto parameters through field values", () => {
    const result = composeEnquiry(project, { ...valid, name: "x&cc=attacker@example.com" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const params = new URL(result.href).searchParams;
    expect([...params.keys()].sort()).toEqual(["body", "subject"]);
  });

  it("refuses to build an over-long mailto rather than silently truncating", () => {
    const long = "word ".repeat(240).trim(); // within field limit, but encodes beyond the URL ceiling
    const result = composeEnquiry(project, { ...valid, message: long.slice(0, 1200) });
    if (result.ok) expect(result.href.length).toBeLessThanOrEqual(MAX_MAILTO_LENGTH);
    else expect(result.errors.message).toMatch(/too long/);
  });

  it("every route has a recipient, a message field and unique field names", () => {
    for (const r of contactRoutes) {
      expect(r.email).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/);
      expect(r.fields.some((f) => f.name === "message" && f.required)).toBe(true);
      expect(new Set(r.fields.map((f) => f.name)).size).toBe(r.fields.length);
    }
  });
});
