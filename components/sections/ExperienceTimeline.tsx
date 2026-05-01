// components/sections/ExperienceTimeline.tsx
"use client";

// Editorial timeline. Left rail: company + dates as a chronological spine.
// Right rail: expandable role cards with description, domain tags, and the
// achievements (each anchored by its hard metric).
//
// Default: every role expanded. Users can collapse individual roles or use
// the domain filters to focus the view. Education sits in a small footnote
// block at the bottom.

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Experience, Education } from "@/data/profile";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionBridge } from "@/components/ui/SectionBridge";

type Props = { experience: Experience[]; education: Education[] };

// Curate a small filter palette. We pull the most repeated domain themes from
// the data so users have a meaningful reduction.
const FILTERS = [
  { key: "all", label: "All work" },
  { key: "AI", label: "AI & Automation" },
  { key: "GTM", label: "GTM / RevOps" },
  { key: "BI", label: "BI & Reporting" },
  { key: "Market", label: "Market Intelligence" },
  { key: "Product", label: "Product / Workflow" },
];

const filterMatchers: Record<string, (e: Experience) => boolean> = {
  all: () => true,
  AI: (e) =>
    /AI|LLM|automation|workflow apps|client portal|product development|portal/i.test(
      [e.title, e.description, ...e.domains].join(" ")
    ),
  GTM: (e) =>
    /GTM|RevOps|funnel|attribution|pipeline|partner|ICP|segmentation|conversion/i.test(
      [e.title, e.description, ...e.domains].join(" ")
    ),
  BI: (e) =>
    /BI|reporting|dashboard|Tableau|KPI|executive/i.test(
      [e.title, e.description, ...e.domains].join(" ")
    ),
  Market: (e) =>
    /TAM|territory|market|whitespace|competitive|pricing|packaging/i.test(
      [e.title, e.description, ...e.domains].join(" ")
    ),
  Product: (e) =>
    /product|portal|application|app|workflow|Co-Founder|ecommerce/i.test(
      [e.title, e.description, ...e.domains].join(" ")
    ),
};

export function ExperienceTimeline({ experience, education }: Props) {
  const [filter, setFilter] = useState("all");
  // Map of role id -> open state. Default open.
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(experience.map((e) => [e.id, true]))
  );

  const filtered = useMemo(() => {
    const matcher = filterMatchers[filter] || filterMatchers.all;
    return experience.filter(matcher);
  }, [filter, experience]);

  const toggle = (id: string) =>
    setOpen((p) => ({ ...p, [id]: !p[id] }));

  return (
    <section
      id="experience"
      className="relative bg-ink border-t hairline"
      aria-label="Experience timeline"
    >
      <SectionBridge index="02" />
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <SectionHeader
          index="02"
          eyebrow="Career"
          title="Experience"
          intro="From BI Analyst II to Senior Strategic Analyst to independent consultant — eight years across analytics, GTM, and applied AI."
        />

        {/* Filter chips */}
        <div
          className="mt-10 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter experience by theme"
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`tag-chip transition-colors ${
                filter === f.key ? "tag-chip-active" : "hover:text-parchment"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Timeline. Constrained max-width so the cards sit in roughly the
            same horizontal band as the section headline — keeps the editorial
            rhythm. */}
        <ol className="mt-10 relative max-w-5xl">
          {/* Vertical spine */}
          <div
            className="absolute top-2 bottom-2 left-[7.5rem] w-px bg-gradient-to-b from-amber-glow/40 via-amber-glow/15 to-transparent hidden md:block"
            aria-hidden
          />

          <AnimatePresence mode="popLayout">
            {filtered.map((role, idx) => {
              const isOpen = open[role.id];
              return (
                <motion.li
                  key={role.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative md:grid md:grid-cols-[7.5rem_1fr] md:gap-8 mb-10 last:mb-0"
                >
                  {/* Date column */}
                  <div className="relative md:pt-1 mb-3 md:mb-0">
                    <p className="font-mono text-[0.7rem] text-parchment-mute tracking-widest2">
                      {role.startLabel}
                    </p>
                    <p className="font-mono text-[0.7rem] text-parchment-mute tracking-widest2">
                      ↓ {role.endLabel}
                    </p>
                    {/* Spine dot */}
                    <span
                      className="hidden md:block absolute -right-[1.25rem] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-glow shadow-[0_0_0_4px_rgba(232,180,92,0.15)]"
                      aria-hidden
                    />
                  </div>

                  {/* Card */}
                  <article className="card-glass rounded-xl overflow-hidden card-glass-hover">
                    <button
                      onClick={() => toggle(role.id)}
                      className="w-full text-left p-6 lg:p-7"
                      aria-expanded={isOpen}
                      aria-controls={`role-body-${role.id}`}
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="min-w-0">
                          <p className="font-mono text-[0.7rem] tracking-widest2 text-amber-glow uppercase">
                            {role.company}
                          </p>
                          <h3 className="mt-1 display-md text-parchment">
                            {role.title}
                          </h3>
                          <p className="mt-2 text-sm text-parchment-mute font-mono tracking-wider">
                            {role.location}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 mt-1 w-8 h-8 rounded-full border hairline grid place-items-center text-parchment-dim transition-transform ${
                            isOpen ? "rotate-45" : ""
                          }`}
                          aria-hidden
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                          </svg>
                        </span>
                      </div>

                      <p className="mt-4 text-parchment-dim leading-relaxed">
                        {role.description}
                      </p>

                      {/* Domain tags always visible */}
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {role.domains.slice(0, 6).map((d) => (
                          <span key={d} className="tag-chip">
                            {d}
                          </span>
                        ))}
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && role.achievements.length > 0 && (
                        <motion.div
                          id={`role-body-${role.id}`}
                          key="body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 lg:px-7 pb-7 pt-1">
                            <div className="border-t hairline pt-5">
                              <p className="eyebrow mb-4">Selected achievements</p>
                              <ul className="space-y-4">
                                {role.achievements.map((a) => (
                                  <li key={a.id} className="grid sm:grid-cols-[10rem_1fr] gap-3">
                                    <span className="metric-chip self-start">
                                      {a.metric}
                                    </span>
                                    <div>
                                      <p className="text-parchment leading-relaxed">
                                        {a.text}
                                      </p>
                                      {a.skillTags.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                          {a.skillTags.slice(0, 5).map((t) => (
                                            <span key={t} className="tag-chip">
                                              {t}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </article>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>

        {filtered.length === 0 && (
          <p className="mt-10 text-parchment-mute text-center">
            No roles match this filter. Try “All work”.
          </p>
        )}

        {/* Education footnote */}
        {education.length > 0 && (
          <aside className="mt-16 pt-10 border-t hairline" aria-label="Education">
            <p className="eyebrow mb-4">Education</p>
            <div className="grid md:grid-cols-2 gap-6">
              {education.map((ed) => (
                <div key={ed.id} className="flex gap-5">
                  <p className="font-mono text-[0.7rem] text-parchment-mute tracking-widest2 pt-1 whitespace-nowrap">
                    {ed.startLabel} → {ed.endLabel}
                  </p>
                  <div>
                    <p className="text-parchment">{ed.degree}</p>
                    <p className="text-parchment-mute text-sm">{ed.school} · {ed.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
