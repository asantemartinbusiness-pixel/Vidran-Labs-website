import type { PageDoc } from "@/lib/types";

const legalPending = (doc: string) => ({
  type: "notice" as const,
  provenance: "provisional" as const,
  tone: "pending" as const,
  title: `Approved ${doc} text required`,
  body: `The published ${doc} could not be recovered from the source site, and the engineering team has no authority to draft legal terms. The statements below describe only how this website is built. They must be replaced or confirmed by Vidran Labs' legal counsel before publication.`,
});

export const trustPages: PageDoc[] = [
  {
    path: "/responsible-technology/",
    title: "Responsible Technology",
    description: "The principles Vidran Labs applies to the design, development and deployment of technology, including AI.",
    template: "standard",
    metaProvenance: "provisional",
    blocks: [
      {
        type: "hero",
        provenance: "provisional",
        eyebrow: "Trust",
        title: "Responsible technology",
        lede: "Systems that matter carry responsibilities. These principles shape how we design, build and deploy them.",
      },
      {
        type: "definitions",
        provenance: "provisional",
        eyebrow: "Principles",
        title: "What we commit to",
        items: [
          { term: "Human accountability", detail: "Automated and AI-assisted decisions remain the responsibility of identifiable people, with routes to review and appeal." },
          { term: "Honest capability", detail: "We describe what a system can do, what it cannot, and how sure we are — including the status of our own products." },
          { term: "Privacy and data minimisation", detail: "We collect and keep only the data a system needs, and protect it accordingly." },
          { term: "Security by design", detail: "Threats are considered from the first design decision, not after launch." },
          { term: "Accessibility", detail: "We design for people with different abilities, devices and connectivity." },
          { term: "Context awareness", detail: "We test assumptions against the communities and conditions a system will actually serve." },
        ],
      },
      {
        type: "prose",
        provenance: "provisional",
        eyebrow: "Applied AI",
        title: "How we approach AI",
        paragraphs: [
          "Before deploying AI in a client system we define its purpose and limits, evaluate it against representative data, document known failure modes, and design human review into the workflow where outcomes affect people.",
        ],
      },
    ],
  },
  {
    path: "/accessibility/",
    title: "Accessibility",
    description: "Accessibility statement for the Vidran Labs website, including the standard we target and how to report a barrier.",
    template: "legal",
    metaProvenance: "provisional",
    blocks: [
      { type: "hero", provenance: "provisional", eyebrow: "Trust", title: "Accessibility" },
      {
        type: "prose",
        provenance: "provisional",
        title: "Our commitment",
        paragraphs: [
          "We want everyone to be able to use this website. It is designed to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.",
          "This website has been tested with automated accessibility checks and manual keyboard testing during development. It has not yet been formally audited by an independent party.",
        ],
      },
      {
        type: "definitions",
        provenance: "provisional",
        title: "What you should be able to do",
        items: [
          { term: "Navigate by keyboard", detail: "All navigation, menus, forms and dialogs work without a mouse, with a visible focus indicator." },
          { term: "Use a screen reader", detail: "Pages use landmarks, headings and labelled controls." },
          { term: "Resize text", detail: "Text can be enlarged to 200% without loss of content." },
          { term: "Reduce motion", detail: "Animation is removed when your device requests reduced motion." },
        ],
      },
      {
        type: "prose",
        provenance: "provisional",
        title: "Reporting a barrier",
        paragraphs: ["If something on this website does not work for you, tell us through the [general contact route](/contact/). Please describe the page and the problem."],
      },
    ],
  },
  {
    path: "/privacy-policy/",
    title: "Privacy Policy",
    description: "Privacy policy for the Vidran Labs website.",
    template: "legal",
    metaProvenance: "provisional",
    blocks: [
      { type: "hero", provenance: "provisional", eyebrow: "Legal", title: "Privacy policy" },
      legalPending("privacy policy"),
      {
        type: "definitions",
        provenance: "provisional",
        title: "How this website handles information",
        items: [
          { term: "Enquiry pathways", detail: "Contact forms on this website prepare an email in your own email app. The website does not transmit or store what you type; your message reaches Vidran Labs only if you send it." },
          { term: "Analytics and advertising", detail: "This website does not load analytics, advertising or social-media tracking scripts." },
          { term: "Third-party content", detail: "Fonts and all assets are served from this website; no third-party embeds are loaded." },
          { term: "Server logs", detail: "The hosting provider may keep standard request logs. Retention depends on the hosting configuration and must be confirmed before publication." },
        ],
      },
    ],
  },
  {
    path: "/cookie-policy/",
    title: "Cookie Policy",
    description: "Cookie policy for the Vidran Labs website.",
    template: "legal",
    metaProvenance: "provisional",
    blocks: [
      { type: "hero", provenance: "provisional", eyebrow: "Legal", title: "Cookie policy" },
      legalPending("cookie policy"),
      {
        type: "definitions",
        provenance: "provisional",
        title: "Storage used by this website",
        items: [
          { term: "vl-consent (local storage)", detail: "Strictly necessary. Written only if optional categories are offered and you save a choice; it then remembers that choice in your browser. While no optional categories exist, nothing is stored." },
          { term: "Optional cookies", detail: "None. This website does not currently use analytics, advertising or other optional cookies, so no consent banner is shown." },
        ],
      },
      {
        type: "prose",
        provenance: "provisional",
        title: "Changing your preferences",
        paragraphs: ["You can review your preferences at any time using **Cookie settings** in the footer of every page. If optional technologies are introduced in future, they will remain off until you allow them."],
      },
    ],
  },
  {
    path: "/terms-service/",
    title: "Terms of Service",
    description: "Terms of service for the Vidran Labs website.",
    template: "legal",
    metaProvenance: "provisional",
    blocks: [
      { type: "hero", provenance: "provisional", eyebrow: "Legal", title: "Terms of service" },
      legalPending("terms of service"),
      {
        type: "prose",
        provenance: "provisional",
        title: "Website operator",
        paragraphs: ["This website is operated by Vidran Labs Solutions, Inc."],
      },
    ],
  },
  {
    path: "/opps/",
    title: "Page Not Found",
    description: "The page you were looking for could not be found.",
    template: "error",
    noindex: true,
    metaProvenance: "indexed",
    blocks: [
      {
        type: "hero",
        provenance: "indexed",
        eyebrow: "Error",
        title: "Page not found",
        lede: "The page you were looking for doesn't exist or has moved.",
        actions: [
          { label: "Go to the homepage", href: "/", variant: "primary" },
          { label: "Contact us", href: "/contact/", variant: "secondary" },
        ],
      },
      { type: "sitemap", provenance: "brief", title: "Popular destinations" },
    ],
  },
];
