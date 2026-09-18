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

export interface SiteContent {
  products: ProductOffer[];
  founders: FounderProfile[];
}

export const contactConfig: ContactConfig = {
  displayPhone: "+44 20 0000 0000",
  phone: "+442000000000",
  whatsapp: "442000000000",
  email: "contact@solvedtech.co.uk",
  placeholder: true,
};
export interface SiteStatus {
  launched: boolean;
}

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

