export interface ContactConfig {
  email: string;
  placeholder: boolean;
}

export type ProductId =
  | "fix"
  | "ai"
  | "customers"
  | "website"
  | "app"
  | "other";

export interface ProductOffer {
  id: ProductId;
  question: string;
  title: string;
  outcome: string;
}

export interface FounderImageSource {
  path: string;
  width: number;
}

export interface FounderProfile {
  name: string;
  role: string;
  image: string;
  imageSources: FounderImageSource[];
  linkedin: string;
  bio: string[];
  website?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  situation: string;
  contribution: string;
  deliverable: string;
  technologies: string[];
  result: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface WebsitePackage {
  id: "starter" | "business" | "shop" | "care";
  name: string;
  summary: string;
  includes: string[];
}

export interface SiteContent {
  products: ProductOffer[];
  packages: WebsitePackage[];
  founders: FounderProfile[];
  caseStudies: CaseStudy[];
  faq: FaqEntry[];
}

export const contactConfig: ContactConfig = {
  email: "contact@solvedtech.co.uk",
  placeholder: false,
};

export type SiteStatus =
  | { launched: false }
  | { launched: true; productionOrigin: string };

export const siteStatus: SiteStatus = {
  launched: true,
  productionOrigin: "https://solvedtech.co.uk",
};


export const siteContent: SiteContent = {
  products: [
    {
      id: "website",
      question: "Need a simple website?",
      title: "Websites for small businesses",
      outcome: "A clear site for a London business, quoted before we start.",
    },
    {
      id: "customers",
      question: "Need more customers?",
      title: "SEO & paid campaigns",
      outcome: "Help the right people find you when they are ready to act.",
    },
    {
      id: "app",
      question: "Need an app?",
      title: "Web, mobile & desktop apps",
      outcome: "A useful product built around the job it needs to do.",
    },
    {
      id: "ai",
      question: "Want to use AI?",
      title: "AI Assistants and Integrations",
      outcome: "Take routine work, calls and messages off your team.",
    },
    {
      id: "fix",
      question: "Something broken?",
      title: "Bug fixes & improvements",
      outcome:
        "We investigate the problem, reproduce it where possible, agree the fix and test it.",
    },
    {
      id: "other",
      question: "Need to automate a process?",
      title: "Automation & integrations",
      outcome:
        "Reduce repetitive work and connect the tools your team relies on.",
    },
  ],
  packages: [
    {
      id: "starter",
      name: "Starter",
      summary:
        "A simple website for a London business that needs one clear place to explain what it does.",
      includes: [
        "The pages we agree in the quote",
        "What you do, how to get in touch, and where you are",
        "Plain-English wording, written with you",
        "A fixed quote before any build starts",
      ],
    },
    {
      id: "business",
      name: "Business",
      summary: "A fuller website when you have several services to explain.",
      includes: [
        "Separate pages for the services you want to show",
        "A clear way for customers to enquire",
        "Room for the photos and words you already have",
        "A handover so you can see what you have received",
      ],
    },
    {
      id: "shop",
      name: "Shop",
      summary: "An online shop for a small range of products.",
      includes: [
        "Product pages for the range we agree",
        "A way for customers to buy or enquire",
        "The pages and buying journey named in the quote",
        "A handover once the shop is ready to use",
      ],
    },
    {
      id: "care",
      name: "Monthly care",
      summary: "Ongoing help after the site is live, agreed as a monthly plan.",
      includes: [
        "Small text and picture updates you ask for",
        "Someone to email when the site needs attention",
        "Hosting and the domain arranged as the quote describes",
        "Anything larger quoted separately",
      ],
    },
  ],
  founders: [
    {
      name: "Razvan Cristofor",
      role: "Co-founder — Apps & SEO Expert",
      image: "/team/razvan_cristofor-520.webp",
      imageSources: [
        { path: "/team/razvan_cristofor-520.webp", width: 520 },
        { path: "/team/razvan_cristofor-1040.webp", width: 1040 },
      ],
      linkedin: "https://www.linkedin.com/in/razvan-cristofor-7ba16b105/",
      website: "https://razvancristofor.ro/",
      bio: [
        "Razvan Cristofor builds custom software. He turns complicated ideas and processes into software that is easy to use, and you work directly with him.",
        "He builds websites, online shops, and web, mobile, Windows and desktop apps. He also builds automations, AI and API integrations, and he works on SEO and performance.",
        "One piece of work connected orders, deliveries, negotiated prices, documents and team activity, with a screen for each role, from client and agent to manager, driver and administrator. He also built a custom studio website, with artist portfolios, a gallery, editorial pages and booking, kept fast and usable on a phone.",
      ],
    },
    {
      name: "Remus Baciu",
      role: "Co-founder — Senior Software Engineer",
      image: "/team/remus_baciu-340.webp",
      imageSources: [],
      linkedin: "https://linkedin.com/in/remus-baciu-4a11a7105",
      bio: [
        "Remus Baciu is a founder of Solved Tech, based in London. You deal directly with him, a senior engineer, not an agency.",
        "He is a Senior Software Engineer at Sky and has worked in software engineering for more than 11 years. He started as a Sky apprentice in 2015 and has been a Senior Software Engineer since November 2023.",
        "He works in Java, Python and Go, and he looks after infrastructure and CI/CD, the systems that build and release software.",
        "His focus has been staying up to date with technology, building AI harnesses, and helping businesses achieve their technical goals.",
      ],
    },
  ],
  caseStudies: [],
  faq: [
    {
      question: "How long does a website take?",
      answer:
        "It depends on the site and on what you already have. We agree a timescale in the quote, after we know whether you want a simple site, a fuller site or a shop. We do not promise a date before that.",
    },
    {
      question: "Can I edit the site myself?",
      answer:
        "You are not locked out of the site. For day-to-day wording and picture changes, the monthly care plan is the straightforward option. If you want to edit pages yourself, we say in the quote whether that is practical for the site we build.",
    },
    {
      question: "What do I need to provide?",
      answer:
        "What your business does, who it is for, how customers should get in touch, and any logo, photos or words you already have. If you do not have those yet, say so. We will work with what you do have.",
    },
    {
      question: "What about hosting and the domain?",
      answer:
        "A website needs a domain name and somewhere to be hosted. We can arrange both with you, or use a domain and host you already have. The quote says which, and what the monthly care plan includes.",
    },
    {
      question: "What happens after the site is live?",
      answer:
        "We hand the site over and agree what happens next. The monthly care plan covers ongoing help such as small updates. Work outside that plan is quoted separately.",
    },
  ],
};

export interface PrivacySection {
  heading: string;
  paragraphs: string[];
}

export interface PrivacyContent {
  title: string;
  updated: string;
  sections: PrivacySection[];
}

export const privacyContent: PrivacyContent = {
  title: "Privacy notice",
  updated: "18 September 2026",
  sections: [
    {
      heading: "Who we are",
      paragraphs: [
        "Solved Tech is operated by Solved Tech Limited, 31 Glendale Gardens, Wembley, England, HA9 8PR. We are the data controller for the personal data described in this notice.",
      ],
    },
    {
      heading: "What we collect and why",
      paragraphs: [
        "When you email us, we receive the contact details you use and the content of your message. We use this information to answer your enquiry, to assess the work you ask about and to prepare a proposal.",
        "This website does not use cookies, analytics scripts or contact forms.",
      ],
    },
    {
      heading: "Legal basis",
      paragraphs: [
        "We rely on our legitimate interest in responding to business enquiries and, where we agree to work together, on taking steps to enter into a contract with you.",
      ],
    },
    {
      heading: "Who receives your data",
      paragraphs: [
        "Email is processed by our email hosting provider. We do not sell or share your details for marketing.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "We keep enquiry correspondence for 24 months after our last contact, or for the duration of a contract and the period required afterwards for accounting and legal purposes.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "You can ask for access to, correction of or deletion of your personal data, object to or restrict our processing, and ask for a copy of the data you gave us. You can also complain to the Information Commissioner's Office at ico.org.uk.",
      ],
    },
  ],
};

export interface ServicePage {
  slug: string;
  productId: ProductId;
  title: string;
  description: string;
  intro: string;
  requests: string[];
  deliverables: string[];
  approved: boolean;
}

export interface VorbioHighlight {
  title: string;
  detail: string;
}

export interface VorbioProduct {
  name: string;
  eyebrow: string;
  tagline: string;
  summary: string;
  highlights: VorbioHighlight[];
  workflow: VorbioHighlight[];
  useCases: string[];
  controls: VorbioHighlight[];
  steps: VorbioHighlight[];
  note: string;
}

export const vorbioProduct: VorbioProduct = {
  name: "Vorbio",
  eyebrow: "AI voice + chat for WhatsApp",
  tagline: "Your AI front desk for WhatsApp voice and chat.",
  summary:
    "Vorbio answers WhatsApp voice calls and chats, qualifies each enquiry and books or routes the next step. Your team takes over with context when needed.",
  highlights: [
    {
      title: "Natural voice conversations",
      detail:
        "Answers WhatsApp voice calls in your business's name and guides the caller through a clear, focused conversation.",
    },
    {
      title: "Fast, consistent chat",
      detail:
        "Responds to WhatsApp messages with clear, on-brand answers drawn only from the information you approve.",
    },
    {
      title: "Qualified enquiries",
      detail:
        "Asks the questions your team needs answered and turns the conversation into a useful, structured summary.",
    },
    {
      title: "Bookings and next steps",
      detail:
        "Connects to the agreed calendar, CRM or inbox so an enquiry can become a booking, lead or task.",
    },
    {
      title: "Context-rich handover",
      detail:
        "Hands unclear, sensitive or high-value conversations to a person with the transcript and captured details attached.",
    },
    {
      title: "Controlled knowledge",
      detail:
        "Works from the business information and conversation rules you approve, with clear limits on what it can do.",
    },
  ],
  workflow: [
    {
      title: "Answer",
      detail: "Vorbio picks up the voice call or chat and introduces itself for your business.",
    },
    {
      title: "Understand",
      detail: "It asks focused follow-up questions and captures the details that matter.",
    },
    {
      title: "Act",
      detail: "It answers, books or routes the agreed next step through your connected tools.",
    },
    {
      title: "Hand over",
      detail: "Your team takes over whenever the conversation reaches an agreed boundary.",
    },
  ],
  useCases: [
    "Service enquiries",
    "Bookings and rescheduling",
    "Lead qualification",
    "Out-of-hours first response",
  ],
  controls: [
    {
      title: "Approved answers only",
      detail: "Its responses are grounded in the information and wording your business signs off.",
    },
    {
      title: "Clear escalation rules",
      detail: "You decide which topics, values and situations always move to a person.",
    },
    {
      title: "Visible conversations",
      detail: "Your team can review what happened, refine the rules and remain responsible for the service.",
    },
  ],
  steps: [
    {
      title: "We map the conversations",
      detail:
        "We review the calls and messages you already get and agree what Vorbio should handle and what must reach a person.",
    },
    {
      title: "We build and test it",
      detail:
        "Vorbio runs on your own WhatsApp number, connected to the agreed tools and tested against real examples before it goes live.",
    },
    {
      title: "You stay in control",
      detail:
        "You watch it answer real conversations, adjust the wording and rules with us, and decide how far it can go.",
    },
  ],
  note: "A Solved Tech product, configured around your business. You keep your WhatsApp number and control its knowledge, actions and handover rules.",
};

export const servicePages: ServicePage[] = [
  {
    slug: "websites-online-shops",
    productId: "website",
    title: "Simple websites for London small businesses",
    description:
      "Clear websites and small online shops for London businesses, with a fixed quote and plain-English handover.",
    intro:
      "We build straightforward websites for London small businesses. You tell us what you do and how customers should reach you. We agree the pages and a fixed quote before we build.",
    requests: [
      "You need a simple site that explains the business",
      "The current site no longer matches what you do",
      "Customers should be able to enquire without hunting for a number",
      "You want a small online shop for a limited range",
    ],
    deliverables: [
      "The pages and wording we agreed in the quote",
      "A site people can use on a phone or a computer",
      "A clear way for customers to get in touch or buy",
      "A handover that says what you have and how to reach us afterwards",
    ],
    approved: true,
  },
  {
    slug: "seo-paid-campaigns",
    productId: "customers",
    title: "SEO and paid campaigns that drive enquiries",
    description:
      "Technical SEO and paid search campaigns focused on qualified visits, measurable actions and useful reporting.",
    intro:
      "We improve how the right people find your business and what happens after they arrive. Work starts with the offer, audience and measurement, then focuses on the search and campaign changes most likely to produce useful enquiries.",
    requests: [
      "Your business is hard to find for the services you sell",
      "Paid search is spending money without clear enquiries",
      "A new service needs a focused landing page and campaign",
      "You cannot tell which searches or adverts lead to calls and messages",
    ],
    deliverables: [
      "A prioritised search and campaign plan",
      "Technical and on-page SEO changes within the agreed scope",
      "Paid campaign structure, adverts and targeting where required",
      "Conversion tracking and plain-English performance reporting",
    ],
    approved: true,
  },
  {
    slug: "software-development",
    productId: "app",
    title: "Software development for your business",
    description:
      "Web, mobile and desktop applications built around the way your business already works, from first scope to handover.",
    intro:
      "We build web, mobile and desktop applications around the way your business already works. Tell us what you want to improve, and we will help define the next step.",
    requests: [
      "A manual process that has outgrown spreadsheets",
      "A customer-facing portal or booking flow",
      "An internal tool your team needs every day",
      "A product idea that needs a first working version",
    ],
    deliverables: [
      "A proposed scope and estimate before work starts",
      "Working software you can review early and often",
      "Testing against the agreed scope",
      "Documentation and a handover you can rely on",
    ],
    approved: true,
  },
  {
    slug: "ai-assistants",
    productId: "ai",
    title: "AI assistants for everyday business work",
    description:
      "Practical AI assistants that handle routine messages, calls and admin while working with the tools your team already uses.",
    intro:
      "We design AI assistants around a clear business task, such as answering common questions, handling enquiries or updating a system. Your team stays in control, and we test the assistant against real examples before it goes live.",
    requests: [
      "Customer questions are taking too much of your team's time",
      "Calls or messages need a consistent first response",
      "Staff repeatedly copy information into a CRM, calendar or back-office tool",
      "You want to test where AI could save time without replacing a whole system",
    ],
    deliverables: [
      "A mapped task, boundaries and hand-off points for people",
      "A working assistant connected only to the agreed tools and information",
      "Tests using representative requests, including unclear and unsafe cases",
      "Documentation, team guidance and a monitored handover",
    ],
    approved: true,
  },
  {
    slug: "bug-fixing",
    productId: "fix",
    title: "Bug fixing for business software",
    description:
      "Help with bugs, failed integrations and problems in existing applications, with a diagnosis before any fix is promised.",
    intro:
      "Get help with bugs, failed integrations and problems in existing applications. We start by understanding the issue and reproducing it where possible, then agree the scope of the fix and how it will be tested.",
    requests: [
      "An error your customers or staff keep running into",
      "An integration that stopped working after a change",
      "Software built by a team that is no longer available",
      "Slow or unreliable behaviour nobody has pinned down",
    ],
    deliverables: [
      "A written diagnosis with the confirmed cause",
      "An agreed scope and estimate before the fix starts",
      "The fix, tested against the steps that triggered the problem",
      "A short handover note describing what changed",
    ],
    approved: true,
  },
  {
    slug: "automation",
    productId: "other",
    title: "Business automation and integrations",
    description:
      "Reduce repetitive work and connect the tools your team relies on, with AI used only where it fits the job.",
    intro:
      "Reduce repetitive work and connect your business tools. We help map the process, identify what can be automated and build the connections your team needs. AI is an option when it fits the job.",
    requests: [
      "Data copied by hand between two systems",
      "Reports assembled manually every week",
      "Tools that should talk to each other but do not",
      "Approvals and notifications that depend on someone remembering",
    ],
    deliverables: [
      "A map of the current process and what can be automated",
      "An agreed scope and estimate before work starts",
      "The integration or automation, tested with your real data flows",
      "Documentation of what runs where and how to change it",
    ],
    approved: true,
  },
];

