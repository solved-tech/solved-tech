import type { PrivacyContent, ServicePage, SiteContent, VorbioProduct } from "./content";

export const romanianMeta = {
  home: {
    title: "Solved Tech — Site-uri simple pentru afaceri mici",
    description:
      "Solved Tech construiește site-uri simple pentru afaceri mici. Preț fix, fără jargon, și o ofertă înainte să începem.",
  },
  privacy: {
    title: "Notă de confidențialitate — Solved Tech",
    description: "Cum tratează Solved Tech datele cu caracter personal pe care ni le trimiteți când ne contactați.",
  },
  vorbio: {
    title: "Vorbio — asistent AI pentru voce și WhatsApp — Solved Tech",
    description:
      "Vorbio este un asistent AI de la Solved Tech care răspunde la apelurile vocale și la conversațiile de pe WhatsApp pentru afacerea dumneavoastră, reține ce are nevoie clientul și predă restul echipei.",
  },
} as const;

export const siteContentRo: SiteContent = {
  products: [
    {
      id: "customers",
      question: "Vă trebuie mai mulți clienți?",
      title: "SEO și campanii plătite",
      outcome: "Oamenii potriviți vă găsesc atunci când sunt gata să acționeze.",
    },
    {
      id: "app",
      question: "Vă trebuie o aplicație?",
      title: "Aplicații web, mobile și desktop",
      outcome: "Un produs util, construit în jurul treburii pe care trebuie să o facă.",
    },
    {
      id: "ai",
      question: "Vreți să folosiți AI?",
      title: "Asistenți AI și integrări",
      outcome: "Scutiți echipa de munca de rutină, de apeluri și de mesaje.",
    },
    {
      id: "fix",
      question: "S-a stricat ceva?",
      title: "Repararea erorilor și îmbunătățiri",
      outcome: "Investigăm problema, o reproducem acolo unde se poate, stabilim remedierea și o testăm.",
    },
    {
      id: "other",
      question: "Vreți să automatizați un proces?",
      title: "Automatizări și integrări",
      outcome: "Reduceți munca repetitivă și conectați instrumentele pe care se bazează echipa.",
    },
  ],
  packages: [
    {
      id: "starter",
      name: "Start",
      summary:
        "Un site simplu pentru o afacere care are nevoie de un loc clar în care să explice ce face.",
      includes: [
        "Paginile stabilite în ofertă",
        "Ce faceți, cum vă pot contacta clienții și unde vă aflați",
        "Text clar, scris împreună cu dumneavoastră",
        "O ofertă fermă înainte să înceapă construcția",
      ],
    },
    {
      id: "business",
      name: "Business",
      summary: "Un site mai complet, atunci când aveți mai multe servicii de prezentat.",
      includes: [
        "Pagini separate pentru serviciile pe care vreți să le arătați",
        "O cale clară prin care clienții pot trimite o cerere",
        "Loc pentru fotografiile și textele pe care le aveți deja",
        "O predare, ca să vedeți exact ce ați primit",
      ],
    },
    {
      id: "shop",
      name: "Magazin",
      summary: "Un magazin online pentru o gamă mică de produse.",
      includes: [
        "Pagini de produs pentru gama stabilită",
        "O modalitate prin care clienții pot cumpăra sau întreba",
        "Paginile și parcursul de cumpărare menționate în ofertă",
        "Predarea, odată ce magazinul este gata de folosit",
      ],
    },
    {
      id: "care",
      name: "Întreținere lunară",
      summary: "Ajutor continuu după ce site-ul este public, convenit ca plan lunar.",
      includes: [
        "Mici actualizări de text și imagini, la cererea dumneavoastră",
        "Cineva căruia îi scrieți când site-ul are nevoie de atenție",
        "Găzduirea și domeniul, așa cum sunt descrise în ofertă",
        "Orice lucrare mai mare se ofertează separat",
      ],
    },
  ],
  founders: [
    {
      name: "Razvan Cristofor",
      role: "Cofondator",
      image: "/team/razvan_cristofor-520.webp",
      imageSources: [
        { path: "/team/razvan_cristofor-520.webp", width: 520 },
        { path: "/team/razvan_cristofor-1040.webp", width: 1040 },
      ],
      linkedin: "https://www.linkedin.com/in/razvan-cristofor-7ba16b105/",
      bio: [
        "Cu peste 5 ani de experiență în SEO și aplicații web, construiesc site-uri, magazine online și aplicații web, mobile, pentru Windows și pentru desktop.",
        "Construiesc și automatizări, integrări de AI și API, și lucrez la SEO și la performanță.",
      ],
    },
    {
      name: "Remus Baciu",
      role: "Cofondator",
      image: "/team/remus_baciu-520.webp",
      imageAlt: "Remus Baciu",
      imageSources: [
        { path: "/team/remus_baciu-520.avif", width: 520, type: "image/avif" },
        { path: "/team/remus_baciu-1040.avif", width: 1040, type: "image/avif" },
        { path: "/team/remus_baciu-520.webp", width: 520, type: "image/webp" },
        { path: "/team/remus_baciu-1040.webp", width: 1040, type: "image/webp" },
      ],
      linkedin: "https://linkedin.com/in/remus-baciu-4a11a7105",
      bio: [
        "Cu peste 11 ani la Sky, sunt Senior Software Engineer.",
        "Lucrez în Java, Python și Go și mă ocup de infrastructură și de CI/CD.",
        "Mă concentrez să rămân la curent cu tehnologia, să construiesc harness-uri pentru AI și să ajut companiile să își atingă obiectivele tehnice.",
      ],
    },
  ],
  caseStudies: [],
  faq: [
    {
      question: "Cât durează un site?",
      answer:
        "Depinde de site și de ce aveți deja. Stabilim un termen în ofertă, după ce știm dacă vreți un site simplu, unul mai complet sau un magazin. Nu promitem o dată înainte de asta.",
    },
    {
      question: "Pot edita site-ul singur?",
      answer:
        "Nu rămâneți blocați în afara site-ului. Pentru modificări de zi cu zi la text și imagini, planul lunar de întreținere este varianta simplă. Dacă vreți să editați paginile singuri, spunem în ofertă dacă acest lucru este practic pentru site-ul pe care îl construim.",
    },
    {
      question: "Ce trebuie să furnizez?",
      answer:
        "Ce face afacerea, cui i se adresează, cum ar trebui să vă contacteze clienții și orice logo, fotografii sau texte pe care le aveți deja. Dacă nu le aveți încă, spuneți-ne. Lucrăm cu ceea ce aveți.",
    },
    {
      question: "Ce se întâmplă cu găzduirea și domeniul?",
      answer:
        "Un site are nevoie de un nume de domeniu și de un loc unde să fie găzduit. Le putem aranja împreună, sau folosim un domeniu și o găzduire pe care le aveți deja. Oferta spune care variantă se aplică și ce include planul lunar de întreținere.",
    },
    {
      question: "Ce se întâmplă după ce site-ul este public?",
      answer:
        "Predăm site-ul și stabilim ce urmează. Planul lunar de întreținere acoperă ajutorul continuu, cum ar fi actualizările mici. Lucrările din afara planului se ofertează separat.",
    },
  ],
};

export const privacyContentRo: PrivacyContent = {
  title: "Notă de confidențialitate",
  updated: "28 octombrie 2026",
  sections: [
    {
      heading: "Cine suntem",
      paragraphs: [
        "Solved Tech este operat de Solved Tech Limited. Suntem operatorul de date pentru datele cu caracter personal descrise în această notă.",
      ],
    },
    {
      heading: "Ce colectăm și de ce",
      paragraphs: [
        "Când ne scrieți, primim datele de contact pe care le folosiți și conținutul mesajului. Folosim aceste informații ca să răspundem la cerere, să evaluăm lucrarea despre care întrebați și să pregătim o propunere.",
        "Ca să alegem versiunea în română sau în engleză a acestui site, browserul întreabă Cloudflare din ce țară vine conexiunea. Folosim doar codul țării. Nu primim și nu stocăm adresa IP, iar cererea se face fără cookie-uri. Până alegeți o limbă, codul țării rămâne în acest browser până închideți fila. Dacă alegeți o limbă din meniu, ținem minte alegerea în acest browser și nu o mai schimbăm noi. Dacă răspunsul nu vine repede, afișăm versiunea în engleză.",
        "Acest site nu folosește cookie-uri, scripturi de analiză sau formulare de contact.",
      ],
    },
    {
      heading: "Temeiul legal",
      paragraphs: [
        "Ne bazăm pe interesul nostru legitim de a răspunde la cereri de afaceri și, atunci când convenim să lucrăm împreună, pe demersurile pentru încheierea unui contract cu dumneavoastră.",
      ],
    },
    {
      heading: "Cine primește datele",
      paragraphs: [
        "Verificarea țării este făcută de Cloudflare în browserul dumneavoastră. E-mailul este prelucrat de furnizorul nostru de găzduire a e-mailului. Nu vindem și nu transmitem datele dumneavoastră pentru marketing.",
      ],
    },
    {
      heading: "Cât timp le păstrăm",
      paragraphs: [
        "Păstrăm corespondența legată de cereri timp de 24 de luni de la ultimul contact, sau pe durata unui contract și perioada necesară ulterior pentru contabilitate și obligații legale.",
      ],
    },
    {
      heading: "Drepturile dumneavoastră",
      paragraphs: [
        "Puteți cere accesul la datele dumneavoastră cu caracter personal, corectarea sau ștergerea lor, vă puteți opune prelucrării sau cere restricționarea ei și puteți solicita o copie a datelor pe care ni le-ați furnizat. Puteți depune o plângere și la Information Commissioner's Office, la ico.org.uk.",
      ],
    },
  ],
};

export const vorbioProductRo: VorbioProduct = {
  name: "Vorbio",
  eyebrow: "Voce AI și chat pentru WhatsApp",
  tagline: "Recepția dumneavoastră AI pentru voce și chat pe WhatsApp.",
  summary:
    "Vorbio răspunde la apelurile vocale și la conversațiile de pe WhatsApp, califică fiecare cerere și programează sau direcționează pasul următor. Echipa preia discuția, cu context, atunci când este nevoie.",
  highlights: [
    {
      title: "Conversații vocale naturale",
      detail:
        "Răspunde la apelurile vocale de pe WhatsApp în numele afacerii și conduce apelantul printr-o conversație clară, concentrată.",
    },
    {
      title: "Chat rapid și consecvent",
      detail:
        "Răspunde la mesajele de pe WhatsApp cu răspunsuri clare, în tonul afacerii, extrase doar din informațiile pe care le aprobați.",
    },
    {
      title: "Cereri calificate",
      detail:
        "Pune întrebările la care echipa are nevoie de răspuns și transformă conversația într-un rezumat util, structurat.",
    },
    {
      title: "Programări și pași următori",
      detail:
        "Se conectează la calendarul, CRM-ul sau inboxul convenit, astfel încât o cerere să poată deveni o programare, un lead sau o sarcină.",
    },
    {
      title: "Predare cu context",
      detail:
        "Predă unei persoane conversațiile neclare, sensibile sau de valoare mare, împreună cu transcrierea și detaliile reținute.",
    },
    {
      title: "Cunoștințe controlate",
      detail:
        "Lucrează din informațiile despre afacere și din regulile de conversație pe care le aprobați, cu limite clare pentru ceea ce poate face.",
    },
  ],
  workflow: [
    {
      title: "Răspunde",
      detail: "Vorbio preia apelul vocal sau conversația și se prezintă în numele afacerii.",
    },
    {
      title: "Înțelege",
      detail: "Pune întrebări de urmărire, concentrate, și reține detaliile care contează.",
    },
    {
      title: "Acționează",
      detail: "Răspunde, programează sau direcționează pasul următor convenit, prin instrumentele conectate.",
    },
    {
      title: "Predă",
      detail: "Echipa preia ori de câte ori conversația ajunge la o limită convenită.",
    },
  ],
  useCases: [
    "Cereri de servicii",
    "Programări și reprogramări",
    "Calificarea lead-urilor",
    "Primul răspuns în afara programului",
  ],
  controls: [
    {
      title: "Doar răspunsuri aprobate",
      detail: "Răspunsurile se sprijină pe informațiile și formulările pe care afacerea le-a aprobat.",
    },
    {
      title: "Reguli clare de escaladare",
      detail: "Dumneavoastră decideți ce subiecte, valori și situații ajung întotdeauna la o persoană.",
    },
    {
      title: "Conversații vizibile",
      detail: "Echipa poate revedea ce s-a întâmplat, poate rafina regulile și rămâne responsabilă pentru serviciu.",
    },
  ],
  steps: [
    {
      title: "Cartografiem conversațiile",
      detail:
        "Trecem în revistă apelurile și mesajele pe care le primiți deja și stabilim ce ar trebui să preia Vorbio și ce trebuie să ajungă la o persoană.",
    },
    {
      title: "Îl construim și îl testăm",
      detail:
        "Vorbio rulează pe propriul număr de WhatsApp, conectat la instrumentele convenite și testat pe exemple reale înainte să intre în funcțiune.",
    },
    {
      title: "Rămâneți în control",
      detail:
        "Îl urmăriți cum răspunde la conversații reale, ajustați formulările și regulile împreună cu noi și decideți până unde poate merge.",
    },
  ],
  note: "Un produs Solved Tech, configurat în jurul afacerii dumneavoastră. Păstrați numărul de WhatsApp și controlul asupra cunoștințelor, acțiunilor și regulilor de predare.",
};

export const servicePagesRo: ServicePage[] = [
  {
    slug: "seo-paid-campaigns",
    productId: "customers",
    title: "SEO și campanii plătite care aduc cereri",
    description:
      "SEO tehnic și campanii de căutare plătită, orientate spre vizite calificate, acțiuni măsurabile și raportare utilă.",
    intro:
      "Îmbunătățim felul în care oamenii potriviți vă găsesc afacerea și ce se întâmplă după ce ajung pe site. Lucrul începe de la ofertă, public și măsurare, apoi se concentrează pe schimbările de căutare și de campanie cele mai susceptibile să aducă cereri utile.",
    requests: [
      "Afacerea este greu de găsit pentru serviciile pe care le vindeți",
      "Căutarea plătită cheltuie bani fără cereri clare",
      "Un serviciu nou are nevoie de o pagină de destinație și de o campanie concentrate",
      "Nu puteți spune ce căutări sau reclame duc la apeluri și mesaje",
    ],
    deliverables: [
      "Un plan prioritizat pentru căutare și campanii",
      "Modificări tehnice și on-page, în limitele convenite",
      "Structura campaniei plătite, reclamele și țintirea, acolo unde este nevoie",
      "Urmărirea conversiilor și raportare a performanței, pe înțelesul tuturor",
    ],
    approved: true,
  },
  {
    slug: "software-development",
    productId: "app",
    title: "Dezvoltare de software pentru afacerea dumneavoastră",
    description:
      "Aplicații web, mobile și desktop, construite în jurul felului în care afacerea funcționează deja, de la prima delimitare până la predare.",
    intro:
      "Construim aplicații web, mobile și desktop în jurul felului în care afacerea funcționează deja. Spuneți-ne ce vreți să îmbunătățiți, iar noi vă ajutăm să definiți pasul următor.",
    requests: [
      "Un proces manual care a depășit foile de calcul",
      "Un portal pentru clienți sau un flux de programări",
      "Un instrument intern de care echipa are nevoie în fiecare zi",
      "O idee de produs care are nevoie de o primă versiune funcțională",
    ],
    deliverables: [
      "Un scop propus și o estimare înainte să înceapă lucrul",
      "Software funcțional, pe care îl puteți revizui devreme și des",
      "Testare față de scopul convenit",
      "Documentație și o predare pe care vă puteți baza",
    ],
    approved: true,
  },
  {
    slug: "ai-assistants",
    productId: "ai",
    title: "Asistenți AI pentru munca de zi cu zi",
    description:
      "Asistenți AI practici, care preiau mesajele de rutină, apelurile și administrarea, lucrând cu instrumentele pe care echipa le folosește deja.",
    intro:
      "Proiectăm asistenți AI în jurul unei sarcini clare de business, cum ar fi răspunsul la întrebări frecvente, preluarea cererilor sau actualizarea unui sistem. Echipa rămâne în control, iar noi testăm asistentul pe exemple reale înainte să intre în funcțiune.",
    requests: [
      "Întrebările clienților ocupă prea mult din timpul echipei",
      "Apelurile sau mesajele au nevoie de un prim răspuns consecvent",
      "Angajații copiază în mod repetat informații într-un CRM, un calendar sau un instrument de back-office",
      "Vreți să testați unde AI-ul poate economisi timp, fără să înlocuiască un întreg sistem",
    ],
    deliverables: [
      "O sarcină cartografiată, cu limite și puncte de predare către oameni",
      "Un asistent funcțional, conectat doar la instrumentele și informațiile convenite",
      "Teste cu cereri reprezentative, inclusiv cazuri neclare și nesigure",
      "Documentație, îndrumare pentru echipă și o predare supravegheată",
    ],
    approved: true,
  },
  {
    slug: "bug-fixing",
    productId: "fix",
    title: "Repararea erorilor în software-ul de business",
    description:
      "Ajutor pentru erori, integrări eșuate și probleme în aplicațiile existente, cu un diagnostic înainte să promitem vreo remediere.",
    intro:
      "Vă ajutăm cu erori, integrări eșuate și probleme în aplicațiile existente. Începem prin a înțelege problema și a o reproduce acolo unde se poate, apoi stabilim amploarea remedierii și felul în care va fi testată.",
    requests: [
      "O eroare de care clienții sau angajații se lovesc în continuare",
      "O integrare care a încetat să funcționeze după o modificare",
      "Software construit de o echipă care nu mai este disponibilă",
      "Un comportament lent sau nesigur, pe care nimeni nu l-a izolat",
    ],
    deliverables: [
      "Un diagnostic scris, cu cauza confirmată",
      "Un scop și o estimare convenite înainte să înceapă remedierea",
      "Remedierea, testată pe pașii care au declanșat problema",
      "O notă scurtă de predare, care descrie ce s-a schimbat",
    ],
    approved: true,
  },
  {
    slug: "automation",
    productId: "other",
    title: "Automatizare de business și integrări",
    description:
      "Reduceți munca repetitivă și conectați instrumentele pe care se bazează echipa, cu AI folosit doar acolo unde se potrivește.",
    intro:
      "Reduceți munca repetitivă și conectați instrumentele afacerii. Vă ajutăm să cartografiați procesul, să identificăm ce poate fi automatizat și să construim conexiunile de care are nevoie echipa. AI-ul este o opțiune atunci când se potrivește sarcinii.",
    requests: [
      "Date copiate manual între două sisteme",
      "Rapoarte asamblate manual în fiecare săptămână",
      "Instrumente care ar trebui să comunice între ele, dar nu o fac",
      "Aprobări și notificări care depind de memoria cuiva",
    ],
    deliverables: [
      "O hartă a procesului actual și a ceea ce poate fi automatizat",
      "Un scop și o estimare convenite înainte să înceapă lucrul",
      "Integrarea sau automatizarea, testată cu fluxurile reale de date",
      "Documentație despre ce rulează unde și cum se modifică",
    ],
    approved: true,
  },
];
