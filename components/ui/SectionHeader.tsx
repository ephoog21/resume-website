// components/ui/SectionHeader.tsx
// Editorial section header: indexed eyebrow + headline + optional subhead.
// Server component — no interactivity needed.
import type { ReactNode } from "react";

type Props = {
  index: string;          // "01", "02" — gives the page a magazine-spread cadence
  eyebrow: string;        // small mono caps label
  title: ReactNode;       // display headline
  intro?: ReactNode;      // optional one-liner under the title
  align?: "left" | "center";
};

export function SectionHeader({ index, eyebrow, title, intro, align = "left" }: Props) {
  return (
    <header className={align === "center" ? "text-center" : ""}>
      <div
        className={`flex items-center gap-4 mb-6 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="font-mono text-[0.72rem] tracking-widest2 text-amber-glow">
          {index}
        </span>
        <span className="h-px w-10 bg-amber-glow/40" />
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2 className="display-lg text-parchment max-w-3xl">{title}</h2>
      {intro && (
        <p
          className={`mt-5 text-parchment-dim leading-relaxed max-w-2xl ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {intro}
        </p>
      )}
    </header>
  );
}
