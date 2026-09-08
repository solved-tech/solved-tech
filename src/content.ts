export interface ContactConfig {
  displayPhone: string;
  phone: string;
  whatsapp: string;
  placeholder: boolean;
}

export interface ProductOffer {
  id: "website" | "app" | "customers" | "ai" | "other";
  question: string;
  title: string;
  answer: string;
  provides: string[];
}

export interface FounderProfile {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  placeholder: boolean;
}

export interface SiteContent {
  products: ProductOffer[];
  founders: FounderProfile[];
}

export const contactConfig: ContactConfig = {
  displayPhone: "+44 20 0000 0000",
  phone: "+442000000000",
  whatsapp: "442000000000",
  placeholder: true,
};

export const siteContent: SiteContent = {
  products: [
    {
      id: "ai",
      question: "Want to use AI?",
      title: "Useful digital assistants",
      answer: "Take routine work, calls and messages off your team.",
      provides: [
        "AI assistants",
        "Agentic workflows",
        "WhatsApp & voice agents",
        "Custom MCPs",
        "MCP integrations",
      ],
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
    },
    {
      id: "other",
      question: "Need something else?",
      title: "Whatever your business needs",
      answer: "If it does not fit a box, bring it anyway.",
      provides: [
        "Bespoke solutions",
        "Business automation",
        "Connected systems",
        "Unusual requests",
      ],
    },
  ],
  founders: [
    {
      name: "Founder One",
      role: "Co-founder — Product & Growth",
      image: "/team/founder-one-placeholder.svg",
      linkedin: "https://www.linkedin.com/",
      placeholder: true,
    },
    {
      name: "Founder Two",
      role: "Co-founder — Technology & Delivery",
      image: "/team/founder-two-placeholder.svg",
      linkedin: "https://www.linkedin.com/",
      placeholder: true,
    },
  ],
};
