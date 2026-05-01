// components/ui/SectionBridge.tsx
// A small editorial mark that sits ON the hairline between two sections —
// adds zero vertical space, but gives the eye an anchor as it scrolls
// from one section to the next. Reads as a magazine "next chapter" tick.
//
// The parent section needs `relative` and a `border-t hairline` for this
// to land correctly.

type Props = { index: string };

export function SectionBridge({ index }: Props) {
  return (
    <div
      aria-hidden
      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 px-4 py-1 rounded-full bg-ink/90 backdrop-blur-sm"
    >
      <span className="block h-px w-6 bg-amber-glow/40" />
      <span className="font-mono text-[0.65rem] tracking-widest2 text-amber-glow">
        {index}
      </span>
      <span className="block h-px w-6 bg-amber-glow/40" />
    </div>
  );
}
