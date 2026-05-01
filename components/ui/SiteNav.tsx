// components/ui/SiteNav.tsx
// Sticky, hairline-thin top nav. Fully static — no client state.
import Link from "next/link";
import { profile } from "@/data/profile";

export function SiteNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-ink/70 border-b hairline"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
        <Link
          href="#top"
          className="font-display text-lg tracking-tight hover:text-amber-glow transition-colors flex items-center"
        >
          {profile.profile.name}
          {/* Subtitle is decorative — hide on small screens so the nav stays
              single-line on a 390px phone. */}
          <span className="hidden lg:inline ml-2 font-mono text-[0.7rem] text-parchment-mute tracking-widest2">
            ▸ ANALYTICS · AI · BI
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-sm text-parchment-dim">
          <a href="#highlights" className="hover:text-amber-glow transition-colors">Highlights</a>
          <a href="#experience" className="hover:text-amber-glow transition-colors">Experience</a>
          <a href="#skills" className="hover:text-amber-glow transition-colors">Skills</a>
          <a href="#case-studies" className="hover:text-amber-glow transition-colors">Work</a>
          <a href="#role-fit" className="hover:text-amber-glow transition-colors">Role Fit</a>
          <a href="#contact" className="btn-ghost !py-2 !px-4 !text-xs">
            Contact
          </a>
        </div>
        <a
          href="#contact"
          className="md:hidden btn-ghost !py-1.5 !px-3 !text-xs"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
