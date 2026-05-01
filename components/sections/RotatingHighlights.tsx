// components/sections/RotatingHighlights.tsx
"use client";

// Rotating highlight reel: auto-advances every ~5s, but each card stays long
// enough to actually read. A persistent "index ledger" on the right shows
// where you are in the sequence and lets users jump. No carousel libraries —
// pure state + Framer Motion for the cross-fade.

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Highlight } from "@/data/profile";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionBridge } from "@/components/ui/SectionBridge";

const ROTATE_MS = 5500;

export function RotatingHighlights({ highlights }: { highlights: Highlight[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((a) => (a + 1) % highlights.length);
  }, [highlights.length]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, ROTATE_MS);
    return () => clearInterval(t);
  }, [paused, next]);

  const current = highlights[active];

  return (
    <section
      id="highlights"
      className="relative bg-dotgrid-soft border-t hairline"
      aria-label="Signature highlights"
    >
      <SectionBridge index="01" />
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <SectionHeader
          index="01"
          eyebrow="Highlights"
          title="Selected highlights"
          intro="A rotating cut of the work. Every entry ties to a real engagement and a real outcome."
        />

        <div
          className="mt-10 grid lg:grid-cols-12 gap-10 lg:gap-12 items-stretch"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {/* Card stage */}
          <div className="lg:col-span-8 relative min-h-[360px]">
            <AnimatePresence mode="wait">
              <motion.article
                key={current.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="card-glass rounded-2xl p-8 lg:p-10 h-full flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="metric-chip">{current.metric}</span>
                  <span className="font-mono text-[0.65rem] text-parchment-mute tracking-widest2">
                    {String(active + 1).padStart(2, "0")} /{" "}
                    {String(highlights.length).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="display-md text-parchment max-w-2xl">
                  {current.title}
                </h3>
                <p className="mt-5 text-parchment-dim leading-relaxed text-base lg:text-lg max-w-2xl">
                  {current.context}
                </p>
                <div className="mt-auto pt-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {current.skillTags.slice(0, 6).map((t) => (
                      <span key={t} className="tag-chip">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="font-mono text-[0.7rem] text-parchment-mute tracking-widest2 uppercase">
                    {current.company}
                  </p>
                </div>
              </motion.article>
            </AnimatePresence>

            {/* Progress hairline */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-amber-glow/15 overflow-hidden rounded-full">
              <motion.div
                key={current.id + (paused ? "-p" : "-r")}
                className="h-full bg-amber-glow"
                initial={{ width: "0%" }}
                animate={{ width: paused ? "0%" : "100%" }}
                transition={{
                  duration: paused ? 0 : ROTATE_MS / 1000,
                  ease: "linear",
                }}
              />
            </div>
          </div>

          {/* Side index ledger */}
          <ol
            className="lg:col-span-4 flex flex-col"
            aria-label="Highlight index"
          >
            {highlights.map((h, i) => {
              const isActive = i === active;
              return (
                <li key={h.id}>
                  <button
                    onClick={() => setActive(i)}
                    className="w-full text-left py-3.5 px-1 border-b hairline group transition-colors hover:bg-ink-50/40"
                    aria-pressed={isActive}
                  >
                    <div className="flex items-baseline gap-4">
                      <span
                        className={`font-mono text-[0.7rem] tracking-widest2 ${
                          isActive ? "text-amber-glow" : "text-parchment-mute"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm leading-snug truncate transition-colors ${
                            isActive
                              ? "text-amber-glow"
                              : "text-parchment-dim group-hover:text-parchment"
                          }`}
                        >
                          {h.title}
                        </p>
                        <p className="font-mono text-[0.65rem] text-parchment-mute tracking-wider mt-0.5 truncate">
                          {h.metric}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
