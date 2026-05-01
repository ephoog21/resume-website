// components/sections/Hero.tsx
// The marquee statement. Editorial layout — display serif headline broken
// into voice/cadence, supporting facts presented as a small "ledger" panel.
// Server component (no interactivity); the rotating ticker that lives further
// down the page handles the dynamic moment.

import type { ProfileData } from "@/data/profile";

type Props = { data: ProfileData };

export function Hero({ data }: Props) {
  const { profile } = data;

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
        <div className="max-w-3xl">
          <h1 className="display-xl text-parchment animate-fade-up">
            {profile.name}
          </h1>

          <p className="mt-4 font-mono text-sm tracking-widest2 text-parchment-mute animate-fade-up [animation-delay:120ms]">
            ANALYTICS &amp; AI STRATEGY LEADER &middot; BOSTON, MA
          </p>

          <p className="mt-10 text-lg lg:text-xl leading-relaxed text-parchment-dim animate-fade-up [animation-delay:240ms]">
            I&rsquo;m an analytics leader with 8+ years building KPI systems,
            reporting platforms, and AI-enabled workflows for go-to-market and
            operations teams. Most of that time has been at security and
            proptech companies &mdash; Mimecast, Rapid7, Latch, CyberArk &mdash;
            turning ambiguous problems into data foundations, dashboards, and
            automations that leaders and frontline teams actually use.
            Currently consulting independently.
          </p>

          <p className="mt-8 text-sm text-parchment-mute animate-fade-up [animation-delay:340ms]">
            <a
              href="/resume.pdf"
              className="underline-offset-4 hover:text-amber-glow hover:underline transition-colors"
            >
              Download r&eacute;sum&eacute;
            </a>
            <span className="mx-3 text-parchment-mute/50">/</span>
            <a
              href={`mailto:${profile.email}`}
              className="underline-offset-4 hover:text-amber-glow hover:underline transition-colors"
            >
              {profile.email}
            </a>
          </p>
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
