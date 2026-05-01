// components/sections/ContactSection.tsx
// Contact + footer. Editorial closing spread: a strong open-to statement,
// the actual email/LinkedIn, and a tiny colophon. Server component.

import type { ProfileData } from "@/data/profile";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionBridge } from "@/components/ui/SectionBridge";

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
      <SectionBridge index="06" />
      {/* Soft amber wash to close the page warmly */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 80% 100%, rgba(232, 180, 92, 0.08), transparent 70%)",
        }}
        aria-hidden
      />
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <SectionHeader
          index="06"
          eyebrow="Contact"
          title="Get in touch"
          intro="Best ways to reach me are below. I read every note — most replies land within a day."
        />

        <div className="mt-10 grid lg:grid-cols-12 gap-10 lg:gap-12">
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

            <div className="mt-10">
              <a href="/resume.pdf" className="btn-ghost">
                Download r&eacute;sum&eacute; PDF
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
