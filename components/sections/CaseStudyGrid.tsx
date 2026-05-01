// components/sections/CaseStudyGrid.tsx
"use client";

// Case study grid. Each card shows title + lede, expands inline to reveal
// Problem / Approach / Outcome / Tools. Editorial layout — two columns of
// medium density, with one "feature" card spanning full width for the
// strongest story (ICP / $5.5M).

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CaseStudy, Experience } from "@/data/profile";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Props = { studies: CaseStudy[]; experience: Experience[] };

// IDs we want to feature in the editorial layout. STORY002 = ICP/$5.5M,
// STORY007 = AI workflows. Both anchor opposite ends of the practice.
const FEATURE_IDS = ["STORY002", "STORY007"];

export function CaseStudyGrid({ studies, experience }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  // Helper: given a story, build "Tools / methods" by intersecting story
  // keywords with the role's domain and any achievement skill tags.
  const toolsFor = (story: CaseStudy) => {
    const role = experience.find((e) => e.id === story.roleId);
    const tools = new Set<string>();
    story.keywords.forEach((k) => tools.add(k));
    role?.domains.forEach((d) => tools.add(d));
    role?.achievements.forEach((a) =>
      a.skillTags.forEach((t) => {
        if (story.keywords.some((k) =>
          k.toLowerCase().includes(t.toLowerCase()) ||
          t.toLowerCase().includes(k.toLowerCase())
        )) tools.add(t);
      })
    );
    return Array.from(tools).slice(0, 8);
  };

  const toggle = (id: string) => setOpenId((p) => (p === id ? null : id));

  const features = studies.filter((s) => FEATURE_IDS.includes(s.id));
  const rest = studies.filter((s) => !FEATURE_IDS.includes(s.id));

  return (
    <section
      id="case-studies"
      className="relative bg-ink border-t hairline"
      aria-label="Case studies and signature work"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <SectionHeader
          index="04"
          eyebrow="Work"
          title="Selected work"
          intro="Each story follows the same arc: what was broken, what got built, what changed."
        />

        {/* Feature row — two large cards */}
        <div className="mt-12 grid lg:grid-cols-2 gap-6">
          {features.map((s, i) => (
            <CaseCard
              key={s.id}
              study={s}
              isOpen={openId === s.id}
              onToggle={() => toggle(s.id)}
              tools={toolsFor(s)}
              feature
              index={String(i + 1).padStart(2, "0")}
            />
          ))}
        </div>

        {/* Rest grid */}
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((s, i) => (
            <CaseCard
              key={s.id}
              study={s}
              isOpen={openId === s.id}
              onToggle={() => toggle(s.id)}
              tools={toolsFor(s)}
              index={String(i + 3).padStart(2, "0")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseCard({
  study,
  isOpen,
  onToggle,
  tools,
  feature = false,
  index,
}: {
  study: CaseStudy;
  isOpen: boolean;
  onToggle: () => void;
  tools: string[];
  feature?: boolean;
  index: string;
}) {
  return (
    <motion.article
      layout
      transition={{ layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
      className={`card-glass rounded-2xl overflow-hidden card-glass-hover ${
        feature ? "p-7 lg:p-9" : "p-6"
      }`}
    >
      <button
        onClick={onToggle}
        className="text-left w-full"
        aria-expanded={isOpen}
        aria-controls={`case-${study.id}`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[0.7rem] tracking-widest2 text-amber-glow">
            CASE / {index}
          </span>
          <span className="font-mono text-[0.65rem] tracking-widest2 text-parchment-mute">
            {study.company.toUpperCase()}
          </span>
        </div>
        <h3
          className={`text-parchment ${
            feature ? "display-md" : "font-display text-2xl leading-tight tracking-tight"
          }`}
        >
          {study.title}
        </h3>
        <p
          className={`mt-3 text-parchment-dim leading-relaxed ${
            feature ? "text-base" : "text-sm"
          }`}
        >
          {study.problem}
        </p>
        <div className="mt-5 flex items-center gap-2 text-amber-glow text-xs font-mono tracking-widest2">
          {isOpen ? "COLLAPSE" : "READ THE STORY"}
          <span
            className={`inline-block transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ↓
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`case-${study.id}`}
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-7 pt-6 border-t hairline space-y-5">
              <Block label="Approach" body={study.actions} />
              <Block label="Outcome" body={study.impact} highlight />
              {tools.length > 0 && (
                <div>
                  <p className="eyebrow mb-2">Tools & methods</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tools.map((t) => (
                      <span key={t} className="tag-chip">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function Block({
  label,
  body,
  highlight = false,
}: {
  label: string;
  body: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="eyebrow mb-2">{label}</p>
      <p
        className={`leading-relaxed ${
          highlight ? "text-amber-glow" : "text-parchment-dim"
        }`}
      >
        {body}
      </p>
    </div>
  );
}
