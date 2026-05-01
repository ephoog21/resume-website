// components/sections/SkillMatrix.tsx
// Static skill matrix: capabilities laid out in a typographic grid grouped
// by cluster. No interactivity — proof points live in the Highlights and
// Work sections; this view is for scanning the surface area.

import type { SkillCluster } from "@/data/profile";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionBridge } from "@/components/ui/SectionBridge";

type Props = { clusters: SkillCluster[] };

export function SkillMatrix({ clusters }: Props) {
  return (
    <section
      id="skills"
      className="relative bg-dotgrid-soft border-t hairline"
      aria-label="Capabilities and skills"
    >
      <SectionBridge index="03" />
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <SectionHeader
          index="03"
          eyebrow="Capabilities"
          title="What I work with"
          intro="The surface area, grouped by how it gets used."
        />

        <div className="mt-10 grid lg:grid-cols-2 gap-x-12 gap-y-10">
          {clusters.map((cluster) => (
            <div key={cluster.cluster} className="border-t hairline pt-6">
              <h3 className="display-md text-parchment mb-4">
                {cluster.cluster}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {cluster.skills.map((s) => (
                  <li key={s.name}>
                    <span
                      className="tag-chip"
                      title={s.detail}
                    >
                      {s.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
