import type { ContactRoute, EnquiryField, NavItem } from "@/lib/types";

export const site = {
  name: "Vidran Labs",
  legalName: "Vidran Labs Solutions, Inc.",
  // Owner-supplied positioning (reconstruction brief).
  tagline: "Technology for Systems That Matter.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://vidran.net").replace(/\/$/, ""),
  locale: "en",
  region: "Caribbean",
} as const;

/** Primary navigation. Top-level labels and order are from the brief. */
export const primaryNav: NavItem[] = [
  {
    label: "Products",
    href: "/products/",
    children: [
      { label: "All products", href: "/products/", description: "Products and platforms from Vidran Labs" },
      { label: "Sage", href: "/products/sage/", description: "Pre-release operating-system initiative" },
      { label: "Sage documentation", href: "/products/sage/documentation/", description: "Technical notes and references" },
      { label: "Sage early access", href: "/products/sage/early-access/", description: "Register interest in evaluation" },
    ],
  },
  { label: "Solutions", href: "/solutions/" },
  { label: "Industries", href: "/industries/" },
  {
    label: "Research",
    href: "/research/",
    children: [
      { label: "Research", href: "/research/", description: "How Vidran Labs approaches research" },
      { label: "Research agenda", href: "/research-agenda/", description: "Open questions we are working on" },
      { label: "Responsible technology", href: "/responsible-technology/", description: "Principles that govern our work" },
    ],
  },
  { label: "Work", href: "/work/" },
  {
    label: "Insights",
    href: "/insights/",
    children: [
      { label: "Insights", href: "/insights/", description: "Essays and analysis" },
      { label: "Newsroom", href: "/newsroom/", description: "Announcements and media" },
    ],
  },
  {
    label: "Company",
    href: "/company/",
    children: [
      { label: "Company", href: "/company/", description: "Who we are" },
      { label: "Mission", href: "/mission/", description: "Why Vidran Labs exists" },
      { label: "Careers", href: "/careers/", description: "Work with us" },
    ],
  },
  {
    label: "Contact",
    href: "/contact/",
    children: [
      { label: "Contact", href: "/contact/", description: "Find the right contact route" },
      { label: "Start a project", href: "/start-a-project/", description: "Scope new work with our team" },
      { label: "Institutional & procurement", href: "/institutional-procurement/", description: "Public sector and enterprise buyers" },
      { label: "Partnerships", href: "/partnerships/", description: "Collaborate with Vidran Labs" },
      { label: "Support", href: "/support/", description: "Help with an existing engagement" },
    ],
  },
];

export const headerCta = { label: "Start a project", href: "/start-a-project/" };

/** Sage product environment, in reading order. */
export const sageNav: NavItem[] = [
  { label: "Overview", href: "/products/sage/" },
  { label: "Interface", href: "/products/sage/interface/" },
  { label: "Architecture", href: "/products/sage/architecture/" },
  { label: "Security", href: "/products/sage/security/" },
  { label: "Compatibility", href: "/products/sage/compatibility/" },
  { label: "Roadmap", href: "/products/sage/roadmap/" },
  { label: "Documentation", href: "/products/sage/documentation/" },
  { label: "Release notes", href: "/products/sage/release-notes/" },
  { label: "FAQ", href: "/products/sage/faq/" },
  { label: "Developer platform", href: "/products/sage/developer-platform/" },
  { label: "Early access", href: "/products/sage/early-access/" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Products",
    items: [
      { label: "Products", href: "/products/" },
      { label: "Sage", href: "/products/sage/" },
      { label: "Sage roadmap", href: "/products/sage/roadmap/" },
      { label: "Developer platform", href: "/products/sage/developer-platform/" },
      { label: "Early access", href: "/products/sage/early-access/" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Company", href: "/company/" },
      { label: "Mission", href: "/mission/" },
      { label: "Work", href: "/work/" },
      { label: "Careers", href: "/careers/" },
      { label: "Newsroom", href: "/newsroom/" },
    ],
  },
  {
    title: "Expertise",
    items: [
      { label: "Solutions", href: "/solutions/" },
      { label: "Industries", href: "/industries/" },
      { label: "Research", href: "/research/" },
      { label: "Research agenda", href: "/research-agenda/" },
      { label: "Insights", href: "/insights/" },
    ],
  },
  {
    title: "Contact",
    items: [
      { label: "Contact", href: "/contact/" },
      { label: "Start a project", href: "/start-a-project/" },
      { label: "Institutional & procurement", href: "/institutional-procurement/" },
      { label: "Partnerships", href: "/partnerships/" },
      { label: "Support", href: "/support/" },
    ],
  },
];

export const legalNav: NavItem[] = [
  { label: "Responsible technology", href: "/responsible-technology/" },
  { label: "Accessibility", href: "/accessibility/" },
  { label: "Privacy policy", href: "/privacy-policy/" },
  { label: "Cookie policy", href: "/cookie-policy/" },
  { label: "Terms of service", href: "/terms-service/" },
];

/* ------------------------------------------------------------------ */
/* Contact pathways                                                    */
/* ------------------------------------------------------------------ */

const nameField: EnquiryField = { name: "name", label: "Your name", kind: "text", required: true, maxLength: 120, autoComplete: "name" };
const orgField: EnquiryField = { name: "organisation", label: "Organisation", kind: "text", required: false, maxLength: 160, autoComplete: "organization" };
const message = (label: string, hint?: string): EnquiryField => ({
  name: "message",
  label,
  kind: "textarea",
  required: true,
  maxLength: 1200,
  hint,
  requiredMessage: "Enter your message.",
});

/**
 * Recipient addresses could NOT be recovered from the source site (see
 * docs/form-inventory.md). The addresses below are placeholders on the
 * company domain, marked provisional; the release gate fails until each is
 * confirmed by Vidran Labs and its provenance set to "verified".
 */
export const contactRoutes: ContactRoute[] = [
  {
    id: "general",
    label: "General enquiries",
    summary: "Questions about Vidran Labs that don't fit another route.",
    href: "/contact/",
    email: "hello@vidran.net",
    emailProvenance: "provisional",
    subjectPrefix: "General enquiry",
    fields: [nameField, orgField, message("How can we help?")],
  },
  {
    id: "start-a-project",
    label: "Start a project",
    summary: "Scope new software, AI, automation, data or infrastructure work.",
    href: "/start-a-project/",
    email: "projects@vidran.net",
    emailProvenance: "provisional",
    subjectPrefix: "Start a project",
    fields: [
      nameField,
      orgField,
      {
        name: "area",
        label: "Area of work",
        kind: "select",
        required: true,
        maxLength: 60,
        options: ["Software engineering", "Artificial intelligence", "Automation", "Data", "Digital infrastructure", "Not sure yet"],
      },
      {
        name: "timeline",
        label: "Intended timeline",
        kind: "select",
        required: false,
        maxLength: 40,
        options: ["Exploring", "Within 3 months", "3–6 months", "6+ months"],
      },
      message("Describe the system or problem", "What exists today, what needs to change, and any constraints."),
    ],
  },
  {
    id: "institutional",
    label: "Institutional & procurement",
    summary: "Government, regulated-sector and enterprise procurement enquiries.",
    href: "/institutional-procurement/",
    email: "procurement@vidran.net",
    emailProvenance: "provisional",
    subjectPrefix: "Institutional & procurement",
    fields: [
      nameField,
      { ...orgField, required: true, label: "Institution or organisation" },
      { name: "reference", label: "Tender or reference number", kind: "text", required: false, maxLength: 80 },
      message("Enquiry details", "Include procurement stage, deadlines and documentation you require."),
    ],
  },
  {
    id: "partnerships",
    label: "Partnerships",
    summary: "Technology, research, delivery and ecosystem partnerships.",
    href: "/partnerships/",
    email: "partnerships@vidran.net",
    emailProvenance: "provisional",
    subjectPrefix: "Partnership enquiry",
    fields: [
      nameField,
      { ...orgField, required: true },
      {
        name: "type",
        label: "Partnership type",
        kind: "select",
        required: true,
        maxLength: 40,
        options: ["Technology", "Research", "Delivery", "Ecosystem or community", "Other"],
      },
      message("Proposed collaboration"),
    ],
  },
  {
    id: "support",
    label: "Support",
    summary: "Help for current clients and engagements.",
    href: "/support/",
    email: "support@vidran.net",
    emailProvenance: "provisional",
    subjectPrefix: "Support request",
    fields: [
      nameField,
      orgField,
      { name: "reference", label: "Project or engagement reference", kind: "text", required: false, maxLength: 80 },
      {
        name: "priority",
        label: "Impact",
        kind: "select",
        required: true,
        maxLength: 40,
        options: ["Question", "Degraded service", "Service unavailable"],
      },
      message("Describe the issue", "What happened, when, and what you expected. Do not include passwords or secrets."),
    ],
  },
  {
    id: "sage-early-access",
    label: "Sage early access",
    summary: "Register interest in evaluating Sage as it develops.",
    href: "/products/sage/early-access/",
    email: "sage@vidran.net",
    emailProvenance: "provisional",
    subjectPrefix: "Sage early access",
    fields: [
      nameField,
      orgField,
      {
        name: "role",
        label: "Your interest",
        kind: "select",
        required: true,
        maxLength: 40,
        options: ["Developer", "Researcher", "Institution", "Hardware partner", "Other"],
      },
      message("What would you evaluate Sage for?"),
    ],
  },
  {
    id: "careers",
    label: "Careers",
    summary: "Talent enquiries and expressions of interest.",
    href: "/careers/",
    email: "careers@vidran.net",
    emailProvenance: "provisional",
    subjectPrefix: "Careers enquiry",
    fields: [
      nameField,
      { name: "discipline", label: "Discipline", kind: "text", required: true, maxLength: 120, hint: "For example: systems engineering, research, design." },
      { name: "profile", label: "Portfolio or profile link", kind: "text", required: false, maxLength: 300, autoComplete: "url" },
      message("Tell us about your work"),
    ],
  },
  {
    id: "media",
    label: "Media",
    summary: "Press and media enquiries.",
    href: "/newsroom/",
    email: "media@vidran.net",
    emailProvenance: "provisional",
    subjectPrefix: "Media enquiry",
    fields: [nameField, { ...orgField, required: true, label: "Publication or outlet" }, { name: "deadline", label: "Deadline", kind: "text", required: false, maxLength: 80 }, message("Your enquiry")],
  },
  {
    id: "research",
    label: "Research collaboration",
    summary: "Academic and institutional research collaboration.",
    href: "/research/",
    email: "research@vidran.net",
    emailProvenance: "provisional",
    subjectPrefix: "Research collaboration",
    fields: [nameField, { ...orgField, required: true, label: "Institution" }, message("Research area and proposed collaboration")],
  },
];

export function getContactRoute(id: string): ContactRoute {
  const route = contactRoutes.find((r) => r.id === id);
  if (!route) throw new Error(`Unknown contact route: ${id}`);
  return route;
}

/**
 * Optional (non-essential) cookie categories in use. The reconstruction loads no
 * analytics, advertising or third-party scripts, so this is empty and the consent
 * banner is not shown. Add a category here *and* gate its loader through
 * lib/consent.ts before introducing any optional technology.
 */
export const optionalConsentCategories: { id: string; label: string; description: string }[] = [];
