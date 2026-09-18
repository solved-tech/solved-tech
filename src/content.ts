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

export interface FounderProfile {
  name: string;
  role: string;
  image: string;
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
      image: "/team/razvan_cristofor.png",
      linkedin: "https://www.linkedin.com/in/razvan-cristofor-7ba16b105/",
    },
    {
      name: "Remus Baciu",
      role: "Co-founder — Senior Software Engineer",
      image: "/team/remus_baciu.png",
      linkedin: "https://www.linkedin.com/in/remus-baciu-4a11a7105/",
    },
  ],
};
