// components/sections/Hero.tsx
// First impression: name, role + location subhead, one paragraph of voice,
// résumé/email links. No CTAs, no metric ledger — that work belongs in the
// sections below. A subtle scroll cue at the bottom invites the next move.

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

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-32 pb-20 lg:pt-40 lg:pb-24 relative">
        <div className="max-w-3xl">
          <h1 className="display-xl text-parchment animate-fade-up">
            {profile.name}
          </h1>

          <p className="mt-4 font-mono text-sm tracking-widest2 text-parchment-mute animate-fade-up [animation-delay:120ms]">
            ANALYTICS &amp; AI STRATEGY LEADER &middot; BOSTON, MA
          </p>

          <p className="mt-8 text-lg lg:text-xl leading-relaxed text-parchment-dim animate-fade-up [animation-delay:240ms]">
            I take ambiguous business problems and turn them into the data
            foundations, KPI systems, and dashboards that leaders run their
            week on &mdash; then I retire the manual layer underneath with
            AI-enabled workflows. Eight-plus years of it, mostly in
            go-to-market and operations. Currently consulting independently.
          </p>

          <p className="mt-7 text-sm text-parchment-mute animate-fade-up [animation-delay:340ms]">
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
      </div>

      {/* Scroll cue: a thin amber line drifting downward, anchored on the
          hairline that separates hero from the next section. Pure CSS
          animation, respects prefers-reduced-motion via the global rule. */}
      <a
        href="#highlights"
        aria-label="Scroll to highlights"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 group"
      >
        <span className="block w-px h-10 bg-gradient-to-b from-transparent via-amber-glow/60 to-transparent animate-scroll-hint" />
      </a>
    </section>
  );
}
