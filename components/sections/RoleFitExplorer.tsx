// components/sections/RoleFitExplorer.tsx
"use client";

// "Where does Ed fit on your team?" interactive selector. Each role-fit
// theme comes from the canonical positioning_variants in the database. The
// proof points and case-study refs are pre-computed at build time so this
// component stays small and fast.

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RoleFit, CaseStudy } from "@/data/profile";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionBridge } from "@/components/ui/SectionBridge";

type Props = { roleFit: RoleFit[]; caseStudies: CaseStudy[] };

export function RoleFitExplorer({ roleFit, caseStudies }: Props) {
  const [activeId, setActiveId] = useState(roleFit[0]?.id ?? "");
  const active = roleFit.find((r) => r.id === activeId) ?? roleFit[0];

  const matchedStudies = useMemo(
    () =>
      active?.caseStudyIds
        .map((id) => caseStudies.find((c) => c.id === id))
        .filter((x): x is CaseStudy => Boolean(x)) ?? [],
    [active, caseStudies]
  );

  if (!active) return null;

  return (
    <section
      id="role-fit"
      className="relative bg-dotgrid-soft border-t hairline"
      aria-label="Role fit explorer"
    >
      <SectionBridge index="05" />
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <SectionHeader
          index="05"
          eyebrow="Role fit"
          title="Where I fit on a team"
          intro="The work spans nine adjacent role families. Pick one to see the matching positioning, the strongest evidence, and the case studies that apply."
        />

        <div className="mt-10 grid lg:grid-cols-12 gap-10">
          {/* Theme rail */}
          <nav
            className="lg:col-span-4"
            aria-label="Role themes"
            role="tablist"
          >
            <ul className="border-t hairline">
              {roleFit.map((r) => {
                const isActive = r.id === activeId;
                return (
                  <li key={r.id}>
                    <button
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveId(r.id)}
                      className="w-full text-left py-4 px-1 border-b hairline group transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={`font-mono text-[0.7rem] tracking-widest2 transition-colors ${
                            isActive ? "text-amber-glow" : "text-parchment-mute"
                          }`}
                        >
                          {r.id.replace("POS", "")}
                        </span>
                        <span
                          className={`flex-1 font-display text-lg tracking-tight transition-colors ${
                            isActive
                              ? "text-amber-glow"
                              : "text-parchment-dim group-hover:text-parchment"
                          }`}
                        >
                          {r.label}
                        </span>
                        <span
                          className={`text-amber-glow transition-opacity ${
                            isActive ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          →
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Detail panel */}
          <div className="lg:col-span-8 lg:pl-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="eyebrow mb-3">Positioning</p>
                <h3 className="display-lg text-parchment">
                  {active.headline}
                </h3>
                <p className="mt-5 text-parchment-dim leading-relaxed text-lg max-w-2xl">
                  {active.summary}
                </p>

                {/* Target roles */}
                <div className="mt-8">
                  <p className="eyebrow mb-3">Target titles</p>
                  <div className="flex flex-wrap gap-2">
                    {active.targetRoles.map((t) => (
                      <span key={t} className="tag-chip">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Keywords */}
                <div className="mt-8">
                  <p className="eyebrow mb-3">Keywords</p>
                  <p className="font-mono text-sm text-parchment-dim leading-relaxed">
                    {active.keywords.join(" · ")}
                  </p>
                </div>

                {/* Proof points */}
                <div className="mt-10">
                  <p className="eyebrow mb-4">Strongest proof points</p>
                  <ul className="space-y-3">
                    {active.proofs.slice(0, 5).map((p) => (
                      <li
                        key={p.id}
                        className="card-glass rounded-lg p-5 card-glass-hover grid sm:grid-cols-[10rem_1fr] gap-4"
                      >
                        <div className="flex flex-col gap-1.5">
                          <span className="metric-chip self-start">{p.metric}</span>
                          <span className="font-mono text-[0.65rem] tracking-widest2 text-parchment-mute">
                            {p.company.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-parchment leading-relaxed text-sm">
                          {p.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Related case studies */}
                {matchedStudies.length > 0 && (
                  <div className="mt-10">
                    <p className="eyebrow mb-4">Related case studies</p>
                    <div className="flex flex-wrap gap-2">
                      {matchedStudies.map((s) => (
                        <a
                          key={s.id}
                          href="#case-studies"
                          className="tag-chip hover:tag-chip-active transition-colors"
                        >
                          → {s.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
