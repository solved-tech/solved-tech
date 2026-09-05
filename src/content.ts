export type ContactMethodId = "call" | "whatsapp" | "voice" | "quote";

export interface ContactConfig {
  phone: string | null;
  whatsapp: string | null;
  quoteEmail: string | null;
}

export interface SiteContent {
  services: Array<{ title: string; summary: string; detail: string }>;
  contactMethods: Array<{
    id: ContactMethodId;
    label: string;
    note: string;
  }>;
}

export const contactConfig: ContactConfig = {
  phone: null,
  whatsapp: null,
  quoteEmail: null,
};

export const siteContent: SiteContent = {
  services: [
    {
      title: "Be easier to find",
      summary: "Help the right customers discover your business.",
      detail:
        "Paid Google adverts and improvements to your website and its pages that help them appear in search results.",
    },
    {
      title: "Turn visits into business",
      summary: "Give customers a clear path from browsing to buying.",
      detail:
        "Online shops and websites designed to turn visits into enquiries or sales.",
    },
    {
      title: "Build what customers need",
      summary: "Turn a useful idea into dependable software people can use.",
      detail:
        "Websites, subscription-based online software, and apps for phones and computers.",
    },
    {
      title: "Make your systems cooperate",
      summary: "Connect the tools your business relies on.",
      detail:
        "Secure connections that let your business tools share information and work together.",
    },
    {
      title: "Give repetitive work away",
      summary: "Free your team from routine tasks and repeated answers.",
      detail:
        "Routine jobs that run by themselves, links that let digital assistants use your tools, and assistants that handle voice calls or WhatsApp conversations.",
    },
  ],
  contactMethods: [
    {
      id: "call",
      label: "Call",
      note: "Talk through what you need.",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      note: "Send a message when it suits you.",
    },
    {
      id: "voice",
      label: "Voice note",
      note: "Explain the problem in your own words.",
    },
    {
      id: "quote",
      label: "Request a quote",
      note: "Share the essentials and get a clear next step.",
    },
  ],
};

export const getContactState = (config: ContactConfig) =>
  config.phone && config.whatsapp && config.quoteEmail ? "ready" : "preview";
