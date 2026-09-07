export interface ContactConfig {
  displayPhone: string;
  phone: string;
  whatsapp: string;
  placeholder: boolean;
}

export interface ProductOffer {
  id: "website" | "app" | "traffic" | "ai" | "other";
  question: string;
  title: string;
  answer: string;
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
      id: "website",
      question: "Need a website?",
      title: "Websites and online shops",
      answer:
        "A clear, fast place built to turn attention into action.",
    },
    {
      id: "app",
      question: "Need an app?",
      title: "Web, mobile and desktop apps",
      answer: "A useful product built around the job it needs to do.",
    },
    {
      id: "traffic",
      question: "Need more traffic?",
      title: "Search and paid campaigns",
      answer: "Help the right people find you when they are ready to act.",
    },
    {
      id: "ai",
      question: "Want to use AI in your business?",
      title: "Useful digital assistants",
      answer: "Take routine work, calls and messages off your team.",
    },
    {
      id: "other",
      question: "Need something else?",
      title: "Connected systems and custom builds",
      answer: "Bring us the problem. We will find the simplest useful answer.",
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
