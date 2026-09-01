"use client";

import { PageShell, useAtelierReveal } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

export function ArticlesClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useAtelierReveal();
  const [featured, ...rest] = c.articles;

  return (
    <PageShell
      scopeRef={scopeRef}
      eyebrow="arsiv"
      titleLines={["Yazi", "katalogu."]}
      siteName={c.site.name}
      siteTitle={c.site.title}
    >
      {/* Featured -- framed exhibit */}
      {featured && (
        <section className="pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <article
              data-reveal
              className="group mx-auto max-w-3xl cursor-pointer border border-[#d4af37]/20 p-10 transition-colors duration-700 hover:border-[#d4af37]/45 md:p-14"
            >
              <div className="flex items-baseline justify-between gap-6">
                <p className="text-[8px] font-light uppercase tracking-[0.5em] text-[#d4af37]/50">
                  one cikan - {featured.category}
                </p>
                <p className="text-[9px] font-light uppercase tracking-[0.3em] text-[#e8e0d0]/25">
                  {featured.date || featured.readTime}
                </p>
              </div>
              <h2 className="mt-6 font-serif text-2xl font-light italic leading-[1.35] text-[#e8e0d0]/90 transition-colors duration-700 group-hover:text-[#d4af37] sm:text-3xl md:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-8 text-[9px] font-light uppercase tracking-[0.4em] text-[#d4af37]/60">
                Okumaya basla &rarr;
              </p>
            </article>
          </div>
        </section>
      )}

      {/* Index list */}
      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            {rest.map((a, idx) => (
              <article
                key={idx}
                data-reveal
                className="group cursor-pointer border-b border-[#d4af37]/8 py-10 transition-colors duration-500 first:border-t hover:bg-[#111009]/40"
              >
                <div className="flex items-baseline gap-6 px-2 md:gap-10 md:px-6">
                  <span className="w-12 shrink-0 font-serif text-3xl font-light italic text-[#d4af37]/20 transition-colors duration-500 group-hover:text-[#d4af37]/60">
                    {String(idx + 2).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                      <h3 className="font-serif text-lg font-light italic text-[#e8e0d0]/75 transition-colors duration-500 group-hover:text-[#e8e0d0] sm:text-xl md:text-2xl">
                        {a.title}
                      </h3>
                    </div>
                    <div className="mt-3 flex gap-6 text-[8px] font-light uppercase tracking-[0.4em] text-[#d4af37]/35">
                      <span>{a.category}</span>
                      <span className="text-[#e8e0d0]/20">{a.date || a.readTime}</span>
                    </div>
                  </div>
                  <span
                    className="shrink-0 -translate-x-2 text-[#d4af37]/0 transition-[transform,color] duration-300 group-hover:translate-x-0 group-hover:text-[#d4af37]/70"
                    aria-hidden="true"
                  >
                    &rarr;
                  </span>
                </div>
              </article>
            ))}

            <p
              data-reveal
              className="mt-14 text-center text-[9px] font-light uppercase tracking-[0.4em] text-[#e8e0d0]/20"
            >
              arsivin tamami yakinda dijital koleksiyonda
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
