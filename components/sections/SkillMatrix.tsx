// components/sections/SkillMatrix.tsx
"use client";

// Skill matrix: clusters laid out as a typographic grid, each skill clickable.
// Selecting a skill surfaces the matching proof points from experience.
// Selecting again clears. Multi-skill selection is supported (OR logic).

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SkillCluster, Experience } from "@/data/profile";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Props = { clusters: SkillCluster[]; experience: Experience[] };

export function SkillMatrix({ clusters, experience }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Flatten all achievements w/ company so we can match against skill tags.
  const allAchievements = useMemo(
    () =>
      experience.flatMap((e) =>
        e.achievements.map((a) => ({
          ...a,
          company: e.company,
          roleTitle: e.title,
        }))
      ),
    [experience]
  );

  // Match proof points to selected skills. Match logic is fuzzy: a skill name
  // is "in" an achievement if any achievement skillTag contains a token of the
  // skill (or vice versa). This keeps selection feeling responsive even when
  // tag spellings differ ("Tableau" vs "Tableau dashboards").
  const matched = useMemo(() => {
    if (selected.size === 0) return [];
    const tokens = Array.from(selected).map((s) => s.toLowerCase());
    return allAchievements.filter((a) => {
      const haystack = [
        a.text,
        ...(a.skillTags || []),
      ]
        .join(" ")
        .toLowerCase();
      return tokens.some((t) => haystack.includes(t.toLowerCase()));
    });
  }, [selected, allAchievements]);

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <section
      id="skills"
      className="relative bg-dotgrid-soft border-t hairline"
      aria-label="Capabilities and skills"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <SectionHeader
          index="03"
          eyebrow="Capabilities"
          title="What I work with"
          intro="Tap any capability to see where it shows up in real engagements. Multi-select to layer themes."
        />

        {/* Selection bar */}
        <div className="mt-10 flex items-center gap-3 flex-wrap min-h-[2.5rem]">
          <span className="eyebrow">
            {selected.size === 0
              ? "Tap to filter →"
              : `Selected · ${selected.size}`}
          </span>
          {Array.from(selected).map((s) => (
            <button
              key={s}
              onClick={() => toggle(s)}
              className="tag-chip tag-chip-active"
              aria-label={`Remove ${s}`}
            >
              {s} ✕
            </button>
          ))}
          {selected.size > 0 && (
            <button
              onClick={() => setSelected(new Set())}
              className="text-[0.7rem] font-mono tracking-widest2 text-parchment-mute hover:text-amber-glow transition-colors ml-2"
            >
              CLEAR ALL
            </button>
          )}
        </div>

        {/* Cluster grid */}
        <div className="mt-12 grid lg:grid-cols-2 gap-x-12 gap-y-10">
          {clusters.map((cluster) => (
            <div key={cluster.cluster} className="border-t hairline pt-6">
              <h3 className="display-md text-parchment mb-4">
                {cluster.cluster}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {cluster.skills.map((s) => {
                  const isOn = selected.has(s.name);
                  return (
                    <li key={s.name}>
                      <button
                        onClick={() => toggle(s.name)}
                        className={`tag-chip transition-colors ${
                          isOn ? "tag-chip-active" : "hover:text-parchment hover:border-amber-glow/40"
                        }`}
                        title={s.detail}
                        aria-pressed={isOn}
                      >
                        {s.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Proof-point reveal */}
        <AnimatePresence initial={false}>
          {selected.size > 0 && (
            <motion.div
              key="proof"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-14 pt-10 border-t hairline">
                <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
                  <p className="eyebrow">
                    Matching proof points · {matched.length}
                  </p>
                  <p className="font-mono text-[0.7rem] text-parchment-mute tracking-widest2">
                    OR LOGIC
                  </p>
                </div>
                {matched.length === 0 ? (
                  <p className="text-parchment-mute">
                    No direct matches — try a different combination, or browse the
                    full timeline above.
                  </p>
                ) : (
                  <ul className="grid md:grid-cols-2 gap-4">
                    {matched.map((m) => (
                      <li
                        key={m.id}
                        className="card-glass rounded-lg p-5 card-glass-hover"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="metric-chip">{m.metric}</span>
                          <span className="font-mono text-[0.65rem] tracking-widest2 text-parchment-mute">
                            {m.company.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-parchment-dim leading-relaxed">
                          {m.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
