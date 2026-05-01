// components/sections/Hero.tsx
// The marquee statement. Editorial layout — display serif headline broken
// into voice/cadence, supporting facts presented as a small "ledger" panel.
// Server component (no interactivity); the rotating ticker that lives further
// down the page handles the dynamic moment.

import type { ProfileData } from "@/data/profile";

type Props = { data: ProfileData };

export function Hero({ data }: Props) {
  const { profile, highlights } = data;
  const top = highlights.slice(0, 3);

  return (
    <section
      id="top"
      className="relative bg-dotgrid hero-glow overflow-hidden"
      aria-label="Introduction"
    >
      {/* Top corner mark — gives the page a tactile, printed feel. The
          right-hand mark hides on mobile so it doesn't crowd the nav. */}
      <div className="absolute top-20 left-6 lg:left-10 font-mono text-[0.65rem] tracking-widest2 text-parchment-mute">
        BOSTON · MA · {new Date().getFullYear()}
      </div>
      <div className="hidden md:block absolute top-20 right-6 lg:right-10 font-mono text-[0.65rem] tracking-widest2 text-parchment-mute">
        № 001 — PORTFOLIO
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-36 pb-28 lg:pt-44 lg:pb-36 relative">
        {/* Grid: headline column + ledger column */}
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-12 items-end">
          {/* Headline column */}
          <div className="lg:col-span-8">
            <p className="eyebrow mb-8 animate-fade-up">
              <span className="text-amber-glow">●</span>{" "}
              Available for senior analytics, BI, and AI strategy roles &
              consulting
            </p>

            {/* Display headline. Two parallel clauses, italic accent on each
                action verb. We let the natural line-height handle wrapping
                rather than forcing a <br /> — keeps it responsive without
                getting weird on tablet widths. */}
            <h1 className="display-xl text-parchment animate-fade-up [animation-delay:120ms] max-w-[18ch]">
              Analytics that{" "}
              <span className="serif-italic text-amber-glow">moves money.</span>{" "}
              AI that quietly{" "}
              <span className="serif-italic">does the work.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-parchment-dim animate-fade-up [animation-delay:240ms]">
              {profile.summary}
            </p>

            {/* CTA row */}
            <div className="mt-10 flex flex-wrap gap-3 animate-fade-up [animation-delay:340ms]">
              <a href="#experience" className="btn-primary">
                Explore experience
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M3 7h8m-3-3 3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="#skills" className="btn-ghost">View capabilities</a>
              {/*
                Replace this href with the path to a real PDF when ready, e.g.
                /Ed-Hoogasian-Resume.pdf placed in /public.
              */}
              <a
                href="/resume.pdf"
                className="btn-ghost"
                aria-label="Download resume PDF (placeholder — drop /public/resume.pdf)"
              >
                Download resume
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M7 2v8m0 0 3-3m-3 3-3-3M3 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          {/* Ledger column — three signature numbers, presented as a small
              datasheet. The mono type and inset hairlines push the
              "executive data leader" voice. */}
          <aside
            className="lg:col-span-4 animate-fade-up [animation-delay:460ms]"
            aria-label="Signature outcomes"
          >
            <div className="card-glass rounded-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <span className="eyebrow">Signature Ledger</span>
                <span className="font-mono text-[0.65rem] text-parchment-mute">
                  ITEMS · 03
                </span>
              </div>
              <ul className="divide-y hairline">
                {top.map((h, i) => (
                  <li key={h.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-display text-2xl text-amber-glow leading-none tracking-tight">
                        {h.metric.split(/[\s—]/)[0]}
                        {h.metric.includes("+") && !h.metric.split(/[\s—]/)[0].includes("+") ? "" : ""}
                      </p>
                      <span className="font-mono text-[0.6rem] text-parchment-mute tracking-widest2">
                        № 0{i + 1}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-parchment-dim leading-snug">
                      {h.title}
                    </p>
                    <p className="mt-1 text-[0.7rem] font-mono text-parchment-mute tracking-wider">
                      {h.company.toUpperCase()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick differentiator pull-quote */}
            <p className="mt-6 text-sm text-parchment-dim leading-relaxed pl-4 border-l border-amber-glow/40">
              {profile.differentiators[0]}
            </p>
          </aside>
        </div>

        {/* Bottom hairline ticker — silently lists capability anchors so the
            user senses range before they scroll. */}
        <div className="mt-20 lg:mt-28 pt-6 border-t hairline">
          <div className="flex items-center justify-between flex-wrap gap-y-3 text-[0.7rem] font-mono tracking-widest2 text-parchment-mute">
            <span>SQL · SNOWFLAKE · DBT · TABLEAU · POWER BI · LOOKER</span>
            <span className="hidden md:inline">PYTHON · OPENAI · CLAUDE · RAG · EVALS · GUARDRAILS</span>
            <span>SALESFORCE · DOCUSIGN · JIRA · EXCEL</span>
          </div>
        </div>
      </div>
    </section>
  );
}
