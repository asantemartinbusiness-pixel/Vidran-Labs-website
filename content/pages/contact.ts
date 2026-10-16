import type { PageDoc } from "@/lib/types";

const howItWorks =
  "Completing this form prepares an email in your own email app, addressed to the right team. Nothing is sent or stored by this website — you review and send the message yourself.";

export const contactPages: PageDoc[] = [
  {
    path: "/contact/",
    title: "Contact",
    description: "Find the right contact route for Vidran Labs: start a project, institutional and procurement, partnerships, support, media, careers and research.",
    template: "standard",
    metaProvenance: "provisional",
    blocks: [
      {
        type: "hero",
        provenance: "indexed",
        eyebrow: "Contact",
        title: "Find the right contact route",
        lede: "Choosing the route that matches your enquiry gets it to the people who can act on it.",
      },
      {
        type: "routes",
        provenance: "indexed",
        title: "How can we help?",
        routes: ["start-a-project", "institutional", "partnerships", "support"],
      },
      {
        type: "routes",
        provenance: "provisional",
        eyebrow: "Other routes",
        title: "Media, careers and research",
        routes: ["media", "careers", "research", "sage-early-access"],
      },
      {
        type: "enquiry",
        provenance: "provisional",
        route: "general",
        title: "General enquiry",
        intro: howItWorks,
      },
    ],
  },
  {
    path: "/start-a-project/",
    title: "Start a Project",
    description: "Start a project with Vidran Labs — software, AI, automation, data and digital infrastructure engineering.",
    template: "standard",
    metaProvenance: "provisional",
    blocks: [
      {
        type: "hero",
        provenance: "indexed",
        eyebrow: "Contact · Start a project",
        title: "Start a project",
        lede: "Tell us about the system you need to build, fix or modernise.",
      },
      {
        type: "steps",
        provenance: "provisional",
        eyebrow: "What happens next",
        title: "From first message to proposal",
        items: [
          { title: "You describe the problem", body: "What exists today, what needs to change and the constraints you work within." },
          { title: "We ask good questions", body: "A short conversation to understand users, risks, timelines and success criteria." },
          { title: "We propose a scope", body: "A written proposal with approach, deliverables, assumptions and exclusions." },
        ],
      },
      { type: "enquiry", provenance: "provisional", route: "start-a-project", title: "Project enquiry", intro: howItWorks },
    ],
  },
  {
    path: "/institutional-procurement/",
    title: "Institutional & Procurement",
    description: "Procurement information for governments, regulated institutions and enterprise buyers working with Vidran Labs.",
    template: "standard",
    metaProvenance: "provisional",
    blocks: [
      {
        type: "hero",
        provenance: "indexed",
        eyebrow: "Contact · Institutional",
        title: "Institutional & procurement",
        lede: "For public-sector bodies, regulated institutions and enterprises with formal procurement processes.",
      },
      {
        type: "definitions",
        provenance: "provisional",
        eyebrow: "Working with institutions",
        title: "What to expect",
        items: [
          { term: "Formal responses", detail: "We respond to requests for information, proposals and tenders in the format specified." },
          { term: "Documentation on request", detail: "Company, security and data-handling documentation can be requested as part of due diligence." },
          { term: "Accessibility and security", detail: "Deliverables are designed to WCAG 2.2 AA and to the security requirements set in your specification." },
          { term: "Knowledge transfer", detail: "Handover, training and operating documentation are included so institutions are not locked in." },
        ],
      },
      {
        type: "notice",
        provenance: "provisional",
        tone: "info",
        title: "Certifications and registrations",
        body: "This page makes no claims of certifications, framework agreements or vendor registrations. Please request current documentation for your procurement process.",
      },
      { type: "enquiry", provenance: "provisional", route: "institutional", title: "Procurement enquiry", intro: howItWorks },
    ],
  },
  {
    path: "/partnerships/",
    title: "Partnerships",
    description: "Technology, research, delivery and ecosystem partnerships with Vidran Labs.",
    template: "standard",
    metaProvenance: "provisional",
    blocks: [
      {
        type: "hero",
        provenance: "indexed",
        eyebrow: "Contact · Partnerships",
        title: "Partnerships",
        lede: "We collaborate with organisations that share our commitment to dependable technology and regional capability.",
      },
      {
        type: "cards",
        provenance: "provisional",
        eyebrow: "Partnership types",
        title: "Ways to work together",
        columns: 2,
        items: [
          { title: "Technology", body: "Platform, hardware and software providers whose products complement our engineering and Sage." },
          { title: "Research", body: "Universities and institutes working on shared questions from our research agenda.", href: "/research-agenda/" },
          { title: "Delivery", body: "Firms that bring sector or specialist expertise to joint engagements." },
          { title: "Ecosystem & community", body: "Organisations building skills and opportunity in the regional technology community." },
        ],
      },
      {
        type: "notice",
        provenance: "provisional",
        tone: "info",
        title: "No partners are listed",
        body: "Named partnerships will be listed only once confirmed and approved for publication by both parties.",
      },
      { type: "enquiry", provenance: "provisional", route: "partnerships", title: "Partnership enquiry", intro: howItWorks },
    ],
  },
  {
    path: "/support/",
    title: "Support",
    description: "Support for current Vidran Labs clients and engagements.",
    template: "standard",
    metaProvenance: "provisional",
    blocks: [
      {
        type: "hero",
        provenance: "indexed",
        eyebrow: "Contact · Support",
        title: "Support",
        lede: "Help for current clients and active engagements.",
      },
      {
        type: "definitions",
        provenance: "provisional",
        eyebrow: "Before you write",
        title: "Help us help you quickly",
        items: [
          { term: "Use your agreed channel first", detail: "If your engagement has a named contact or service desk, use it — it reaches the team that knows your system." },
          { term: "Include a reference", detail: "A project or engagement reference lets us route your request immediately." },
          { term: "Describe the impact", detail: "Tell us who is affected and whether the service is degraded or unavailable." },
          { term: "Never send secrets", detail: "Do not include passwords, keys or personal data. We will arrange a secure channel if needed." },
        ],
      },
      {
        type: "notice",
        provenance: "provisional",
        tone: "info",
        title: "Response times",
        body: "Response commitments are defined in your engagement agreement. This website does not create or modify any service-level commitment.",
      },
      { type: "enquiry", provenance: "provisional", route: "support", title: "Support request", intro: howItWorks },
    ],
  },
];
