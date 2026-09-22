import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { z } from "zod";

const metin = z.string().max(5000);

const siteContentInputSchema = z.object({
  site: z
    .object({
      name: metin,
      title: metin,
      email: metin,
      phone: metin,
      address: metin,
      hours: metin,
      copyright: metin,
    })
    .partial()
    .optional(),

  home: z
    .object({
      badge: metin,
      headline: metin,
      headlineAccent: metin,
      headlineSuffix: metin,
      description: metin,
      cta: metin,
      cardTitle: metin,
      cardSubtitle: metin,
      quote: metin,
      quoteAuthor: metin,
      credentials: z.array(z.union([metin, z.object({ label: metin, value: metin.optional() })])),
    })
    .partial()
    .optional(),

  metrics: z
    .array(z.object({ val: metin, label: metin }))
    .optional(),

  services: z
    .array(
      z.object({
        title: metin,
        desc: metin,
        duration: metin,
        method: metin,
        alt: metin.optional(),
        tag: metin.optional(),
      }),
    )
    .optional(),

  about: z
    .object({
      title: metin,
      intro: metin,
      credentials: z.array(
        z.object({ year: metin, title: metin, detail: metin }),
      ),
    })
    .partial()
    .optional(),

  approach: z
    .object({
      title: metin,
      intro: metin,
      principles: z.array(z.object({ title: metin, desc: metin })),
    })
    .partial()
    .optional(),

  articles: z
    .array(
      z.object({
        title: metin,
        category: metin,
        readTime: metin,
        date: metin,
        excerpt: metin.optional(),
      }),
    )
    .optional(),

  faq: z.array(z.object({ q: metin, a: metin })).optional(),

  contact: z
    .object({
      title: metin,
      intro: metin,
      formName: metin,
      formEmail: metin,
      formSubject: metin,
      formMessage: metin,
      formSubmit: metin,
    })
    .partial()
    .optional(),
});

export interface SiteContent {
  site: {
    name: string;
    title: string;
    email: string;
    phone?: string;
    address: string;
    hours?: string;
    copyright: string;
  };
  home: {
    badge: string;
    headline: string;
    headlineAccent: string;
    headlineSuffix: string;
    description: string;
    cta: string;
    cardTitle: string;
    cardSubtitle: string;
    quote: string;
    quoteAuthor: string;
    credentials: (string | { label: string; value?: string })[];
  };
  metrics: { val: string; label: string }[];
  services: {
    title: string;
    desc: string;
    duration: string;
    method: string;
    alt?: string;
    tag?: string;
  }[];
  about: {
    title: string;
    intro: string;
    credentials: { year: string; title: string; detail: string }[];
  };
  approach: {
    title: string;
    intro: string;
    principles: { title: string; desc: string }[];
  };
  articles: {
    title: string;
    category: string;
    readTime: string;
    date: string;
    excerpt?: string;
  }[];
  faq: { q: string; a: string }[];
  contact: {
    title: string;
    intro: string;
    formName: string;
    formEmail: string;
    formSubject?: string;
    formMessage: string;
    formSubmit: string;
  };
}

const DEFAULTS: SiteContent = {
  site: {
    name: "Atelier Psykhe",
    title: "Psikanalitik Psikoterapi",
    email: "atolye@psykhe.com",
    phone: "+90 212 000 00 00",
    address: "Istanbul",
    hours: "Hafta ici 10.00 - 19.00",
    copyright: "Tum haklari saklidir.",
  },
  home: {
    badge: "ATELIER PSYKHE",
    headline: "Terapi, mermerden",
    headlineAccent: "yontmaktir.",
    headlineSuffix: "fazlaligi",
    description:
      "Psikanalitik surecte, zihnin karanlik koridorlarinda kaybolmus parcalari aydinliga cikariz.",
    cta: "Sureci Baslat",
    cardTitle: "Ic Dunyanin Haritasi",
    cardSubtitle: "Psikanalitik Psikoterapi",
    quote: "Her insan, icinde bir baska formu barindiran bir mermer bloktur.",
    quoteAuthor: "Uzm. Psk. Ornek Psikolog",
    credentials: ["TPD Uyeligi", "Psikanaliz Dernegi", "ISST Akreditasyon", "Psikanalist Sertifika"],
  },
  metrics: [
    { val: "12+", label: "Yil Klinik Deneyim" },
    { val: "4500+", label: "Tamamlanmis Seans" },
    { val: "8+", label: "Akademik Yayin" },
    { val: "%100", label: "Etik Taahhut" },
  ],
  services: [
    {
      title: "Bireysel Psikoterapi",
      desc: "Stres, kaygi, depresyon ve anlam arayisinda bireysel farkindalik yolculugu.",
      duration: "50 dk",
      method: "Psikanalitik / Psikodinamik",
    },
  ],
  about: {
    title: "Hakkimda",
    intro: "Psikanalitik yolculugum, insanin bilincdisindaki desenleri okuma merakiyla basladi.",
    credentials: [
      { year: "2012", title: "Psikoloji Lisansi", detail: "Universite mezuniyeti" },
    ],
  },
  approach: {
    title: "Yaklasim",
    intro: "Psikanalitik calisma bir teknikten cok bir tutumdur.",
    principles: [
      { title: "Serbest Cagrisim", desc: "Soz, yargilanmadan dolasir." },
    ],
  },
  articles: [
    { title: "Ruyalarin Kral Yolu", category: "Kuram", readTime: "10 dk", date: "Mayis 2026" },
  ],
  faq: [
    { q: "Ilk seansta ne olur?", a: "Ilk gorusme bir tanisma ve on degerlendirmedir." },
  ],
  contact: {
    title: "Iletisim",
    intro: "Ic yolculugunuza sessiz bir adimla baslayin.",
    formName: "Adiniz",
    formEmail: "E-posta",
    formMessage: "Mesajiniz",
    formSubmit: "Gonder",
  },
};

function birlestir<T extends Record<string, unknown>>(
  varsayilan: T,
  gelen?: Partial<T>,
): T {
  if (!gelen) return varsayilan;
  const cikti = { ...varsayilan };
  for (const [k, v] of Object.entries(gelen)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    (cikti as Record<string, unknown>)[k] = v;
  }
  return cikti;
}

let cached: SiteContent | null = null;

export function getContent(): SiteContent {
  if (cached) return cached;

  const defaultsPath = join(process.cwd(), "content", "site.json");
  let base: SiteContent = DEFAULTS;

  if (existsSync(defaultsPath)) {
    try {
      const raw = JSON.parse(readFileSync(defaultsPath, "utf-8"));
      const parsed = siteContentInputSchema.safeParse(raw);

      if (parsed.success) {
        const g = parsed.data;
        base = {
          site: birlestir(DEFAULTS.site, g.site),
          home: birlestir(DEFAULTS.home, g.home),
          metrics:
            g.metrics && g.metrics.length > 0
              ? (g.metrics as SiteContent["metrics"])
              : DEFAULTS.metrics,
          services:
            g.services && g.services.length > 0
              ? (g.services as SiteContent["services"])
              : DEFAULTS.services,
          about: birlestir(DEFAULTS.about, g.about),
          approach: birlestir(DEFAULTS.approach, g.approach),
          articles:
            g.articles && g.articles.length > 0
              ? (g.articles as SiteContent["articles"])
              : DEFAULTS.articles,
          faq:
            g.faq && g.faq.length > 0
              ? (g.faq as SiteContent["faq"])
              : DEFAULTS.faq,
          contact: birlestir(DEFAULTS.contact, g.contact),
        };
      } else {
        base = {
          site: birlestir(DEFAULTS.site, raw.site),
          home: birlestir(DEFAULTS.home, raw.home),
          metrics: Array.isArray(raw.metrics) && raw.metrics.length > 0 ? raw.metrics : DEFAULTS.metrics,
          services: Array.isArray(raw.services) && raw.services.length > 0 ? raw.services : DEFAULTS.services,
          about: birlestir(DEFAULTS.about, raw.about),
          approach: birlestir(DEFAULTS.approach, raw.approach),
          articles: Array.isArray(raw.articles) && raw.articles.length > 0 ? raw.articles : DEFAULTS.articles,
          faq: Array.isArray(raw.faq) && raw.faq.length > 0 ? raw.faq : DEFAULTS.faq,
          contact: birlestir(DEFAULTS.contact, raw.contact),
        };
      }
    } catch (e) {
      console.error("[content] site.json okunamadi, varsayilanlar kullaniliyor:", e);
    }
  }

  const overridesPath = join(process.cwd(), "content", "content.json");
  if (existsSync(overridesPath)) {
    try {
      const raw = JSON.parse(readFileSync(overridesPath, "utf-8"));
      const parsed = siteContentInputSchema.safeParse(raw);

      if (parsed.success && Object.keys(parsed.data).length > 0) {
        const g = parsed.data;
        base = {
          site: birlestir(base.site, g.site),
          home: birlestir(base.home, g.home),
          metrics:
            g.metrics && g.metrics.length > 0
              ? (g.metrics as SiteContent["metrics"])
              : base.metrics,
          services:
            g.services && g.services.length > 0
              ? (g.services as SiteContent["services"])
              : base.services,
          about: birlestir(base.about, g.about),
          approach: birlestir(base.approach, g.approach),
          articles:
            g.articles && g.articles.length > 0
              ? (g.articles as SiteContent["articles"])
              : base.articles,
          faq:
            g.faq && g.faq.length > 0
              ? (g.faq as SiteContent["faq"])
              : base.faq,
          contact: birlestir(base.contact, g.contact),
        };
      }
    } catch (e) {
      console.error("[content] content.json gecersiz, atlaniyor:", e);
    }
  }

  cached = base;
  return cached;
}
