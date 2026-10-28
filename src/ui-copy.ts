import type { Locale } from "./locale";

export interface ProcessStageCopy {
  id: "understand" | "shape" | "build" | "maintain";
  title: string;
  detail: string;
}

export interface JourneyStepCopy {
  title: string;
  body: string;
}

export interface ProofCopy {
  title: string;
  detail: string;
}

export interface UiCopy {
  htmlLang: string;
  skipToContent: string;
  heroQuoteSubject: string;
  quoteSubject: string;
  quoteLabel: string;
  yourProject: string;
  howItHappens: string;
  whatYouTellUs: string;
  whatYouNeedDone: string;
  stages: readonly ProcessStageCopy[];
  whatYouGet: string;
  workYouCanUse: string;
  pauseMotion: string;
  resumeMotion: string;
  homeLabel: string;
  openMenu: string;
  closeMenu: string;
  primaryNavigation: string;
  languageLabel: string;
  languageCurrent: (name: string) => string;
  languageEnglish: string;
  languageRomanian: string;
  navWebsites: string;
  navServices: string;
  navApproach: string;
  navTeam: string;
  navQuote: string;
  privacyNotice: string;
  backToTop: string;
  caseSituation: string;
  caseWhatWeDid: string;
  caseDelivered: string;
  caseResult: string;
  caseTechnologies: string;
  caseRecentWork: string;
  caseHeading: string;
  faqEyebrow: string;
  faqHeading: string;
  viewService: string;
  portraitAlt: (name: string) => string;
  heroEyebrow: string;
  heroHeading: string;
  heroLead: string;
  heroTrust: string;
  packagesHeading: string;
  packagesIntro: string;
  servicesEyebrow: string;
  servicesHeading: string;
  servicesIntro: string;
  approachEyebrow: string;
  approachHeading: string;
  journey: readonly JourneyStepCopy[];
  journeyNote: string;
  teamEyebrow: string;
  teamHeading: string;
  contactHeading: string;
  contactLead: string;
  contactCaution: string;
  emailLabel: string;
  contactPrivacy: string;
  trialContact: string;
  privacyUpdated: (date: string) => string;
  privacyContactHeading: string;
  privacyContactBefore: string;
  privacyContactAfter: string;
  typicalRequests: string;
  whatYouReceive: string;
  serviceNavigation: string;
  seeHowWeWork: string;
  backToServices: string;
  serviceContactHeading: string;
  serviceContactBody: string;
  vorbioDemoSubject: string;
  vorbioDemoLabel: string;
  illustrativeConversation: string;
  voiceAndChat: string;
  incomingVoiceCall: string;
  customer: string;
  sampleQuestion: string;
  sampleAnswer: string;
  nextAction: string;
  bookingCaptured: string;
  bookingReady: string;
  vorbioProofLabel: string;
  vorbioProof: readonly ProofCopy[];
  vorbioFlowEyebrow: string;
  vorbioFlowHeading: string;
  vorbioCapabilityEyebrow: string;
  vorbioCapabilityHeading: string;
  vorbioFitsEyebrow: string;
  vorbioFitsHeading: string;
  vorbioControlEyebrow: string;
  vorbioControlHeading: string;
  vorbioControlBody: string;
  vorbioStepsEyebrow: string;
  vorbioStepsHeading: string;
  vorbioContactEyebrow: string;
  vorbioContactHeading: string;
  vorbioContactBody: string;
}

const en: UiCopy = {
  htmlLang: "en-GB",
  skipToContent: "Skip to content",
  heroQuoteSubject: "Free quote",
  quoteSubject: "Website quote",
  quoteLabel: "Get a free quote",
  yourProject: "Your project",
  howItHappens: "How it happens",
  whatYouTellUs: "What you tell us",
  whatYouNeedDone: "What you need done, and what done looks like.",
  stages: [
    { id: "understand", title: "Listen", detail: "What you need" },
    { id: "shape", title: "Agree", detail: "The work and a quote" },
    { id: "build", title: "Build", detail: "The solution" },
    { id: "maintain", title: "Hand over", detail: "Ready to use" },
  ],
  whatYouGet: "What you get",
  workYouCanUse: "Work your business can use.",
  pauseMotion: "Pause diagram motion",
  resumeMotion: "Resume diagram motion",
  homeLabel: "Solved Tech home",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  primaryNavigation: "Primary navigation",
  languageLabel: "Language",
  languageCurrent: (name) => `Language, ${name}`,
  languageEnglish: "English",
  languageRomanian: "Romanian",
  navWebsites: "Websites",
  navServices: "Services",
  navApproach: "How we work",
  navTeam: "Team",
  navQuote: "Get a quote",
  privacyNotice: "Privacy notice",
  backToTop: "Back to top",
  caseSituation: "Situation",
  caseWhatWeDid: "What we did",
  caseDelivered: "Delivered",
  caseResult: "Result",
  caseTechnologies: "Technologies",
  caseRecentWork: "Recent work",
  caseHeading: "Problems we have solved",
  faqEyebrow: "Before you get in touch",
  faqHeading: "Questions we are often asked",
  viewService: "View service",
  portraitAlt: (name) => `Portrait of ${name}`,
  heroEyebrow: "Small or large",
  heroHeading: "Tech solutions for any business.",
  heroLead: "Fixed price, no jargon. Tell us what you need, and we quote it before we start.",
  heroTrust: "You speak with the people who do the work.",
  packagesHeading: "Simple website packages.",
  packagesIntro:
    "Starter, Business, Shop, and a monthly care plan. Each one is quoted before we build. We do not list a price until we know what you need.",
  servicesEyebrow: "Also available",
  servicesHeading: "Other ways we can help.",
  servicesIntro:
    "Websites come first. Apps, AI, bug fixing and automation are here when you need them later.",
  approachEyebrow: "How we work",
  approachHeading: "Assess, agree, build, hand over.",
  journey: [
    {
      title: "Tell us what is happening.",
      body: "Describe the problem or the goal. No polished brief needed.",
    },
    {
      title: "We assess and agree the scope.",
      body: "You get a short written assessment, a proposed scope and an estimate before work starts.",
    },
    {
      title: "We build and test.",
      body: "You see progress early and we test against the agreed scope.",
    },
    {
      title: "Handover you can rely on.",
      body: "We hand over with documentation and agree what happens after delivery.",
    },
  ],
  journeyNote: "For a bug, the first step is a diagnosis. We confirm the cause before we promise a fix.",
  teamEyebrow: "Who you will work with",
  teamHeading: "Meet the founders",
  contactHeading: "Tell us about the website you need.",
  contactLead:
    "Email what your business does, who the site is for, and whether you want a simple site, a fuller site or a shop. We reply with a quote. There is no form on this page.",
  contactCaution: "Please do not send passwords or confidential customer data in your first message.",
  emailLabel: "Email",
  contactPrivacy: "How we handle the details you send us",
  trialContact: "Trial contact details:",
  privacyUpdated: (date) => `Last updated ${date}`,
  privacyContactHeading: "Contact",
  privacyContactBefore: "Email ",
  privacyContactAfter: " with any question about this notice or to exercise your rights.",
  typicalRequests: "Typical requests",
  whatYouReceive: "What you receive",
  serviceNavigation: "Service navigation",
  seeHowWeWork: "See how we work",
  backToServices: "Back to all services",
  serviceContactHeading: "Tell us what is happening",
  serviceContactBody:
    "Describe the problem or the goal, which system is involved and what outcome you want. Please do not send passwords or confidential customer data in your first message.",
  vorbioDemoSubject: "Vorbio demo",
  vorbioDemoLabel: "Arrange a live demo",
  illustrativeConversation: "Illustrative conversation",
  voiceAndChat: "Voice + chat",
  incomingVoiceCall: "Incoming voice call",
  customer: "Customer",
  sampleQuestion: "Can I book a service visit for Thursday?",
  sampleAnswer: "I can help with that. Which service do you need?",
  nextAction: "Next action",
  bookingCaptured: "Booking request captured",
  bookingReady: "Ready for calendar check or team handover",
  vorbioProofLabel: "Vorbio product scope",
  vorbioProof: [
    { title: "Voice + chat", detail: "One WhatsApp conversation" },
    { title: "Connected actions", detail: "Calendar, CRM or inbox" },
    { title: "Human handover", detail: "At the boundaries you set" },
  ],
  vorbioFlowEyebrow: "The operating model",
  vorbioFlowHeading: "From first hello to a useful next step.",
  vorbioCapabilityEyebrow: "Capability",
  vorbioCapabilityHeading: "Built for the whole first conversation.",
  vorbioFitsEyebrow: "Good first fits",
  vorbioFitsHeading: "Start where response time and consistency matter.",
  vorbioControlEyebrow: "Human by design",
  vorbioControlHeading: "AI that knows where its job ends.",
  vorbioControlBody:
    "Vorbio is not given an open brief. We define its knowledge, actions and handover points with you before it speaks to customers.",
  vorbioStepsEyebrow: "Implementation",
  vorbioStepsHeading: "Configured around your real conversations.",
  vorbioContactEyebrow: "See it work",
  vorbioContactHeading: "Bring us one conversation your team handles every day.",
  vorbioContactBody:
    "We will map how Vorbio should answer, what it should capture and exactly when it should hand over—then arrange a focused demonstration.",
};

const ro: UiCopy = {
  htmlLang: "ro",
  skipToContent: "Sari la conținut",
  heroQuoteSubject: "Ofertă gratuită",
  quoteSubject: "Ofertă pentru site",
  quoteLabel: "Cereți o ofertă gratuită",
  yourProject: "Proiectul vostru",
  howItHappens: "Cum decurge",
  whatYouTellUs: "Ce ne spuneți",
  whatYouNeedDone: "Ce trebuie făcut și cum arată rezultatul.",
  stages: [
    { id: "understand", title: "Ascultăm", detail: "De ce aveți nevoie" },
    { id: "shape", title: "Stabilim", detail: "Lucrarea și oferta" },
    { id: "build", title: "Construim", detail: "Soluția" },
    { id: "maintain", title: "Predăm", detail: "Gata de folosit" },
  ],
  whatYouGet: "Ce primiți",
  workYouCanUse: "O lucrare pe care afacerea o poate folosi.",
  pauseMotion: "Opriți animația diagramei",
  resumeMotion: "Reluați animația diagramei",
  homeLabel: "Pagina Solved Tech",
  openMenu: "Deschideți meniul",
  closeMenu: "Închideți meniul",
  primaryNavigation: "Navigare principală",
  languageLabel: "Limbă",
  languageCurrent: (name) => `Limbă, ${name}`,
  languageEnglish: "engleză",
  languageRomanian: "română",
  navWebsites: "Site-uri",
  navServices: "Servicii",
  navApproach: "Cum lucrăm",
  navTeam: "Echipa",
  navQuote: "Cereți o ofertă",
  privacyNotice: "Notă de confidențialitate",
  backToTop: "Înapoi sus",
  caseSituation: "Situația",
  caseWhatWeDid: "Ce am făcut",
  caseDelivered: "Livrat",
  caseResult: "Rezultat",
  caseTechnologies: "Tehnologii",
  caseRecentWork: "Lucrări recente",
  caseHeading: "Probleme pe care le-am rezolvat",
  faqEyebrow: "Înainte să ne scrieți",
  faqHeading: "Întrebări pe care le primim des",
  viewService: "Vedeți serviciul",
  portraitAlt: (name) => `Portretul lui ${name}`,
  heroEyebrow: "Mică sau mare",
  heroHeading: "Soluții tehnice pentru orice afacere.",
  heroLead: "Preț fix, fără jargon. Spuneți-ne de ce aveți nevoie, iar noi vă trimitem oferta înainte să începem.",
  heroTrust: "Vorbiți direct cu oamenii care fac treaba.",
  packagesHeading: "Pachete simple de site-uri.",
  packagesIntro:
    "Start, Business, Magazin și un plan lunar de întreținere. Fiecare pachet primește o ofertă înainte să construim. Nu afișăm un preț până nu știm de ce aveți nevoie.",
  servicesEyebrow: "În plus",
  servicesHeading: "Alte moduri în care vă putem ajuta.",
  servicesIntro:
    "Site-urile sunt pe primul loc. Aplicațiile, AI-ul, repararea erorilor și automatizările sunt aici atunci când aveți nevoie de ele mai târziu.",
  approachEyebrow: "Cum lucrăm",
  approachHeading: "Evaluăm, stabilim, construim, predăm.",
  journey: [
    {
      title: "Spuneți-ne ce se întâmplă.",
      body: "Descrieți problema sau obiectivul. Nu trebuie să pregătiți un brief elaborat.",
    },
    {
      title: "Evaluăm și convenim asupra scopului.",
      body: "Primiți o evaluare scrisă, scurtă, un scop propus și o estimare înainte să înceapă lucrul.",
    },
    {
      title: "Construim și testăm.",
      body: "Vedeți progresul din timp, iar noi testăm față de scopul convenit.",
    },
    {
      title: "O predare pe care vă puteți baza.",
      body: "Predăm cu documentație și stabilim ce se întâmplă după livrare.",
    },
  ],
  journeyNote:
    "Pentru o eroare, primul pas este diagnosticul. Confirmăm cauza înainte să promitem o remediere.",
  teamEyebrow: "Cu cine veți lucra",
  teamHeading: "Cunoașteți fondatorii",
  contactHeading: "Spuneți-ne de ce site aveți nevoie.",
  contactLead:
    "Scrieți-ne ce face afacerea, pentru cine este site-ul și dacă vreți un site simplu, unul mai complet sau un magazin. Răspundem cu o ofertă. Pe această pagină nu există formular.",
  contactCaution: "Vă rugăm să nu trimiteți parole sau date confidențiale ale clienților în primul mesaj.",
  emailLabel: "E-mail",
  contactPrivacy: "Cum tratăm datele pe care ni le trimiteți",
  trialContact: "Date de contact de probă:",
  privacyUpdated: (date) => `Ultima actualizare ${date}`,
  privacyContactHeading: "Contact",
  privacyContactBefore: "Scrieți la ",
  privacyContactAfter: " pentru orice întrebare despre această notă sau pentru a vă exercita drepturile.",
  typicalRequests: "Cereri tipice",
  whatYouReceive: "Ce primiți",
  serviceNavigation: "Navigare în serviciu",
  seeHowWeWork: "Vedeți cum lucrăm",
  backToServices: "Înapoi la toate serviciile",
  serviceContactHeading: "Spuneți-ne ce se întâmplă",
  serviceContactBody:
    "Descrieți problema sau obiectivul, ce sistem este implicat și ce rezultat vreți. Vă rugăm să nu trimiteți parole sau date confidențiale ale clienților în primul mesaj.",
  vorbioDemoSubject: "Demonstrație Vorbio",
  vorbioDemoLabel: "Stabiliți o demonstrație",
  illustrativeConversation: "Conversație ilustrativă",
  voiceAndChat: "Voce + chat",
  incomingVoiceCall: "Apel vocal primit",
  customer: "Client",
  sampleQuestion: "Pot programa o vizită joi?",
  sampleAnswer: "Vă pot ajuta. De ce serviciu aveți nevoie?",
  nextAction: "Următorul pas",
  bookingCaptured: "Cererea de programare a fost notată",
  bookingReady: "Gata de verificat în calendar sau de predat echipei",
  vorbioProofLabel: "Ce acoperă Vorbio",
  vorbioProof: [
    { title: "Voce + chat", detail: "O conversație pe WhatsApp" },
    { title: "Acțiuni conectate", detail: "Calendar, CRM sau inbox" },
    { title: "Predare către om", detail: "La limitele pe care le stabiliți" },
  ],
  vorbioFlowEyebrow: "Modelul de lucru",
  vorbioFlowHeading: "De la prima replică până la un pas următor util.",
  vorbioCapabilityEyebrow: "Capacitate",
  vorbioCapabilityHeading: "Construit pentru întreaga primă conversație.",
  vorbioFitsEyebrow: "Unde se potrivește întâi",
  vorbioFitsHeading: "Începeți acolo unde contează timpul de răspuns și consecvența.",
  vorbioControlEyebrow: "Om, din proiect",
  vorbioControlHeading: "Un AI care știe unde se termină treaba lui.",
  vorbioControlBody:
    "Vorbio nu primește un brief deschis. Îi definim cunoștințele, acțiunile și punctele de predare împreună cu dumneavoastră, înainte să vorbească cu clienții.",
  vorbioStepsEyebrow: "Implementare",
  vorbioStepsHeading: "Configurat în jurul conversațiilor reale.",
  vorbioContactEyebrow: "Vedeți-l la lucru",
  vorbioContactHeading: "Aduceți-ne o conversație pe care echipa o poartă în fiecare zi.",
  vorbioContactBody:
    "Stabilim cum ar trebui să răspundă Vorbio, ce ar trebui să rețină și exact când trebuie să predea discuția, apoi organizăm o demonstrație concentrată.",
};

export const uiCopy = (locale: Locale): UiCopy => {
  switch (locale) {
    case "en":
      return en;
    case "ro":
      return ro;
    default: {
      const exhaustive: never = locale;
      return exhaustive;
    }
  }
};
