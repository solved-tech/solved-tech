export interface ContactConfig {
  displayPhone: string;
  phone: string;
  whatsapp: string;
  email: string;
  placeholder: boolean;
}

export interface ProductOffer {
  id: "fix" | "website" | "app" | "customers" | "ai" | "other";
  question: string;
  title: string;
  answer: string;
  provides: string[];
  cta: string;
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

export interface SiteContent {
  products: ProductOffer[];
  founders: FounderProfile[];
  caseStudies: CaseStudy[];
  faq: FaqEntry[];
}

export const contactConfig: ContactConfig = {
  displayPhone: "+44 7903 833061",
  phone: "+447903833061",
  whatsapp: "447903833061",
  email: "contact@solvedtech.co.uk",
  placeholder: false,
};
export type SiteStatus =
  | { launched: false }
  | { launched: true; productionOrigin: string };

export const siteStatus: SiteStatus = {
  launched: false,
};


export const siteContent: SiteContent = {
  products: [
    {
      id: "fix",
      question: "Something broken?",
      title: "Bug fixes and improvements to existing software",
      answer:
        "We investigate the problem, reproduce it where possible, agree the fix and test it.",
      provides: [
        "Bug diagnosis and fixes",
        "Failed integrations",
        "Software built by another team",
        "Regression testing",
        "Documented handover",
      ],
      cta: "Discuss a software issue",
    },
    {
      id: "ai",
      question: "Want to use AI?",
      title: "Useful digital assistants",
      answer: "Take routine work, calls and messages off your team.",
      provides: [
        "AI assistants",
        "Agentic workflows",
        "WhatsApp & voice agents",
        "AI connected to your tools (MCP)",
        "AI that reads and updates your systems",
      ],
      cta: "Talk to us",
    },
    {
      id: "customers",
      question: "Need more customers?",
      title: "SEO and paid campaigns",
      answer: "Help the right people find you when they are ready to act.",
      provides: [
        "Technical SEO",
        "On-page SEO",
        "Google Ads",
        "Conversion tracking",
      ],
      cta: "Talk to us",
    },
    {
      id: "website",
      question: "Need a website?",
      title: "Websites and online shops",
      answer:
        "A clear, fast place built to turn attention into action.",
      provides: [
        "Business websites",
        "Online shops",
        "Landing pages",
        "Ongoing improvements",
      ],
      cta: "Talk to us",
    },
    {
      id: "app",
      question: "Need an app?",
      title: "Web, mobile and desktop apps",
      answer: "A useful product built around the job it needs to do.",
      provides: [
        "Web apps",
        "Mobile apps",
        "Desktop apps",
        "SaaS platforms",
      ],
      cta: "Talk to us",
    },
    {
      id: "other",
      question: "Need to automate a process?",
      title: "Business automation and integrations",
      answer: "Reduce repetitive work and connect the tools your team relies on.",
      provides: [
        "Business automation",
        "Connected systems",
        "Data moving between your tools",
        "Bespoke solutions",
      ],
      cta: "Talk to us",
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
    },
    {
      name: "Remus Baciu",
      role: "Co-founder — Senior Software Engineer",
      image: "/team/remus_baciu-340.webp",
      imageSources: [],
      linkedin: "https://www.linkedin.com/in/remus-baciu-4a11a7105/",
    },
  ],
  caseStudies: [],
  faq: [
    {
      question: "Can you work on software built by another team?",
      answer:
        "Yes. We take on existing software, including code another team wrote or maintained. We start with a diagnosis: we look at the code and the problem with you, tell you what we find, and only then agree what we will change and how it will be tested.",
    },
    {
      question: "What do you need to investigate an issue?",
      answer:
        "A description of what you see and what you expected, the steps that trigger it if you can reproduce it, when it started, and how it affects your business. Logs, screenshots or error messages help if you have them. We will tell you if we need access or anything else.",
    },
    {
      question: "How do you estimate the work and agree the scope?",
      answer:
        "We assess the problem first, then give you a short written assessment, a proposed scope and an estimate before work starts. We agree the scope together. On larger work we review progress in short stages, so you can see what is working and adjust before the next stage.",
    },
    {
      question: "What happens after delivery?",
      answer:
        "We hand over with documentation and agree what happens next. If you want us to keep working on the system, we will scope and estimate that separately.",
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
  updated: "[[PRIVACY_UPDATED_DATE]]",
  sections: [
    {
      heading: "Who we are",
      paragraphs: [
        "Solved Tech is operated by [[COMPANY_LEGAL_NAME]], [[COMPANY_REGISTERED_ADDRESS]]. We are the data controller for the personal data described in this notice.",
      ],
    },
    {
      heading: "What we collect and why",
      paragraphs: [
        "When you call us, message us on WhatsApp or email us, we receive the contact details you use and the content of your message. We use this information to answer your enquiry, to assess the work you ask about and to prepare a proposal.",
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
        "Calls and WhatsApp messages are carried by [[PHONE_AND_WHATSAPP_PROVIDER]]. Email is processed by [[EMAIL_PROVIDER]]. We do not sell or share your details for marketing.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "We keep enquiry correspondence for [[RETENTION_PERIOD]] after our last contact, or for the duration of a contract and the period required afterwards for accounting and legal purposes.",
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
  productId: string;
  title: string;
  description: string;
  intro: string;
  requests: string[];
  deliverables: string[];
  approved: boolean;
}

export const servicePages: ServicePage[] = [
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

