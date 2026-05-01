// components/sections/ContactSection.tsx
// Contact + footer. Editorial closing spread: a strong open-to statement,
// the actual email/LinkedIn, and a tiny colophon. Server component.

import type { ProfileData } from "@/data/profile";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Props = { profile: ProfileData["profile"] };

export function ContactSection({ profile }: Props) {
  const linkedinHref = profile.linkedin.startsWith("http")
    ? profile.linkedin
    : `https://${profile.linkedin}`;

  return (
    <section
      id="contact"
      className="relative bg-ink border-t hairline"
      aria-label="Contact"
    >
      {/* Soft amber wash to close the page warmly */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 80% 100%, rgba(232, 180, 92, 0.08), transparent 70%)",
        }}
        aria-hidden
      />
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <SectionHeader
          index="06"
          eyebrow="Get in touch"
          title={
            <>
              Open to{" "}
              <span className="serif-italic text-amber-glow">senior analytics,</span>{" "}
              BI leadership, AI strategy, GTM analytics, and consulting.
            </>
          }
          intro="Best ways to reach me below. I read every note — most replies land within a day."
        />

        <div className="mt-14 grid lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Contact methods */}
          <div className="lg:col-span-7">
            <ul className="border-t hairline">
              <ContactRow
                label="Email"
                value={profile.email}
                href={`mailto:${profile.email}`}
              />
              <ContactRow
                label="LinkedIn"
                value={profile.linkedin}
                href={linkedinHref}
                external
              />
              <ContactRow
                label="Phone"
                value={profile.phone}
                href={`tel:${profile.phone.replace(/[^\d]/g, "")}`}
              />
              <ContactRow label="Based" value={profile.location} />
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={`mailto:${profile.email}?subject=Hello%20Ed`}
                className="btn-primary"
              >
                Start a conversation
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path
                    d="M3 7h8m-3-3 3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              {/*
                Placeholder for the resume PDF. Drop the actual file at
                /public/resume.pdf and the link works automatically.
              */}
              <a href="/resume.pdf" className="btn-ghost">
                Download resume PDF
              </a>
            </div>
          </div>

          {/* Personal note column */}
          <aside className="lg:col-span-5">
            <div className="card-glass rounded-2xl p-7">
              <p className="eyebrow mb-4">Off the clock</p>
              <p className="font-display text-xl leading-snug text-parchment">
                {profile.personalNotes}
              </p>
            </div>

            <p className="mt-8 text-sm text-parchment-mute leading-relaxed">
              Looking for a fractional engagement instead of a full-time role?
              That works too — most current consulting is scoped in 4–12 week
              blocks with clear deliverables.
            </p>
          </aside>
        </div>

        {/* Colophon */}
        <footer className="mt-24 pt-8 border-t hairline flex flex-wrap items-center justify-between gap-4 text-[0.7rem] font-mono tracking-widest2 text-parchment-mute">
          <p>
            © {new Date().getFullYear()} {profile.name.toUpperCase()} · ALL RIGHTS RESERVED
          </p>
          <p>
            BUILT WITH NEXT.JS · DEPLOYED ON VERCEL · SET IN FRAUNCES & IBM PLEX
          </p>
        </footer>
      </div>
    </section>
  );
}

function ContactRow({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const inner = (
    <div className="flex items-baseline gap-6 py-5 border-b hairline group">
      <span className="font-mono text-[0.7rem] tracking-widest2 text-parchment-mute w-24 shrink-0">
        {label.toUpperCase()}
      </span>
      <span
        className={`flex-1 font-display text-xl lg:text-2xl tracking-tight ${
          href ? "text-parchment group-hover:text-amber-glow transition-colors" : "text-parchment"
        }`}
      >
        {value}
      </span>
      {href && (
        <span className="text-amber-glow opacity-0 group-hover:opacity-100 transition-opacity">
          →
        </span>
      )}
    </div>
  );
  return (
    <li>
      {href ? (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </li>
  );
}
