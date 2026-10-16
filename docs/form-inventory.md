# Form & enquiry-pathway inventory

## 1. Classification

The original pages could not be inspected, so it is unknown whether each pathway was a Contact Form 7 / Forminator
form or a structured email link (gap G-10). The reconstruction implements every pathway as a **structured email
composer**: an accessible, validated form that builds an RFC 6068 `mailto:` link and hands it to the visitor's
email app.

Why this choice:

- **Honest.** The site never claims a message was sent. It reports only what it can know: that a prepared email was
  handed to the mail app. There is no simulated success.
- **No personal data at rest.** Nothing is transmitted to or stored by a Vidran server, so there is no submission
  database, no log of personal data, and no endpoint to abuse. Rate limiting and bot protection are therefore not
  applicable; spam exposure is equivalent to a published email address.
- **Static-first.** No backend to operate or secure.

Trade-off: it depends on the visitor having an email client configured. Mitigations: "Copy message" fallback,
"Open email again", the recipient address is always shown, and a `<noscript>` direct link.

## 2. Pathways

All recipients are **placeholders pending confirmation** (G-03). Release gate blocks until each is `verified`.

| Pathway | Hosted on | Recipient (provisional) | Subject format | Fields (required*) |
|---|---|---|---|---|
| General | `/contact/` | hello@vidran.net | `General enquiry: {Org} — {Name}` | Name*, Organisation, Message* |
| Start a project | `/start-a-project/` | projects@vidran.net | `Start a project: …` | Name*, Organisation, Area of work* (select), Timeline (select), Message* |
| Institutional & procurement | `/institutional-procurement/` | procurement@vidran.net | `Institutional & procurement: …` | Name*, Institution*, Tender/reference, Message* |
| Partnerships | `/partnerships/` | partnerships@vidran.net | `Partnership enquiry: …` | Name*, Organisation*, Partnership type* (select), Message* |
| Support | `/support/` | support@vidran.net | `Support request: …` | Name*, Organisation, Engagement reference, Impact* (select), Message* |
| Sage early access | `/products/sage/early-access/` | sage@vidran.net | `Sage early access: …` | Name*, Organisation, Interest* (select), Message* |
| Careers | `/careers/` | careers@vidran.net | `Careers enquiry: …` | Name*, Discipline*, Profile link (URL), Message* |
| Media | `/newsroom/` | media@vidran.net | `Media enquiry: …` | Name*, Outlet*, Deadline, Message* |
| Research collaboration | `/research/` | research@vidran.net | `Research collaboration: …` | Name*, Institution*, Message* |

Every pathway also offers a direct `mailto:` link with the subject pre-filled. Definitions: `content/site.ts`.

## 3. Behaviour

| Aspect | Implementation |
|---|---|
| Validation | `lib/enquiry.ts`: required, trimmed, max length (text 80–300, message 1200), select whitelist, URL format. Re-validates each field after the first failed attempt. |
| Sanitisation | Control characters stripped; line breaks collapsed in single-line fields (prevents header-style injection into the body); parameters encoded with `encodeURIComponent` so `&cc=` etc. cannot add mailto headers. Unit-tested. |
| URL limit | Refuses (with a clear message) to build a mailto longer than 2,000 characters instead of truncating. |
| Errors | Error summary (`role="alert"`) receives focus and links to each field; fields get `aria-invalid` and `aria-describedby` pointing at inline errors and hints. |
| Success state | `role="status"`, focused: "Your email app should now open… Nothing has been sent yet." Offers Open again / Copy message / Start over. |
| Duplicate submission | Form is replaced by the status panel after hand-off. |
| Privacy | Footnote on every form; Privacy policy describes the mechanism. |
| Consent | Not required: no data is processed by the website. |

## 4. Contract for a future server integration (not built)

If Vidran Labs wants enquiries delivered to a CRM or shared inbox without relying on the visitor's mail client,
add a server route `POST /api/enquiry` with this contract:

- **Request:** `{ route: ContactRouteId, values: Record<string,string>, website: "" }` (empty honeypot field).
- **Validation:** reuse `validateEnquiry()` server-side — the same function the client uses.
- **Abuse controls:** per-IP rate limit (e.g. 5/10 min), honeypot, optional Turnstile/hCaptcha; reject bodies > 8 KB.
- **Delivery:** server-side provider SDK (e.g. Postmark/SES) with `ENQUIRY_PROVIDER_KEY` and per-route recipient
  env vars; `reply-to` set to a visitor email field (which would then become required).
- **Responses:** `202` accepted · `400` with field errors · `429` rate limited · `503` provider failure (UI must say
  the message was **not** sent and show the direct email address).
- **Logging:** route id, status and timing only — never field values.
- **Privacy:** update the privacy policy (retention, processor) before enabling. Requires leaving static-only hosting.

## 5. Test coverage

Unit (`tests/unit/enquiry.test.ts`): required/empty/whitespace, boundary length (max and max+1), invalid select,
URL validation, control-character and newline stripping, RFC 6068 encoding, parameter-injection attempt, over-long
mailto, route integrity.
E2E (`tests/e2e/forms.spec.ts`, desktop + mobile): all 9 pathways render with labelled controls and correct direct
link; empty submission → focused summary with correct count; summary links focus fields; errors clear on
correction; valid submission → encoded mailto with exact subject/body, Unicode and `&`; status focused and truthful;
no double submission; maxlength enforcement; URL validation.

Not applicable (no network submission): network/provider failure, rate-limit and server-side spam tests. No real
emails were sent during testing — the mail client hand-off is not followed in the headless browser.
