import { getContent } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Hizmetler" };

export default function ServicesPage() {
  const c = getContent();
  return (
    <div className="font-sans bg-bg text-fg">
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-14">
            <div className="text-center space-y-4">
              <h1 className="font-display text-4xl font-light tracking-tight text-fg">Terapi Hizmetleri</h1>
              <p className="text-xs tracking-[0.15em] uppercase text-fg-muted">Seans bilgisi icin iletisime gecin</p>
            </div>
            <div className="mx-auto max-w-3xl grid gap-px border border-border/30 sm:grid-cols-2">
              {c.services.map((s, i) => (
                <div key={i} className="p-8 bg-bg hover:bg-bg-secondary/40 transition-colors duration-500 border border-border/30 space-y-4">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-primary/60">{s.method}</span>
                  <h2 className="font-display text-xl font-light text-fg">{s.title}</h2>
                  <p className="text-sm text-fg-muted leading-relaxed">{s.desc}</p>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-fg-muted/60">{s.duration}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
