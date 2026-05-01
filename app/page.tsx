// app/page.tsx
// Page composition. Server component by default — heavy interactive bits
// (timeline expand, role-fit explorer, skill matrix filter, case study expand)
// live in their own client components and are loaded lazily where reasonable.

import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { RotatingHighlights } from "@/components/sections/RotatingHighlights";
import { SiteNav } from "@/components/ui/SiteNav";
import { ContactSection } from "@/components/sections/ContactSection";
import { profile } from "@/data/profile";

// These three sections are interactive (filters, expand/collapse). Render the
// initial markup on the server, hydrate client logic only for these chunks.
const ExperienceTimeline = dynamic(
  () => import("@/components/sections/ExperienceTimeline").then((m) => m.ExperienceTimeline),
  { ssr: true }
);
const SkillMatrix = dynamic(
  () => import("@/components/sections/SkillMatrix").then((m) => m.SkillMatrix),
  { ssr: true }
);
const CaseStudyGrid = dynamic(
  () => import("@/components/sections/CaseStudyGrid").then((m) => m.CaseStudyGrid),
  { ssr: true }
);
const RoleFitExplorer = dynamic(
  () => import("@/components/sections/RoleFitExplorer").then((m) => m.RoleFitExplorer),
  { ssr: true }
);

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <main className="relative">
        <Hero data={profile} />
        <RotatingHighlights highlights={profile.highlights} />
        <ExperienceTimeline experience={profile.experience} education={profile.education} />
        <SkillMatrix clusters={profile.skillClusters} />
        <CaseStudyGrid studies={profile.caseStudies} experience={profile.experience} />
        <RoleFitExplorer roleFit={profile.roleFit} caseStudies={profile.caseStudies} />
        <ContactSection profile={profile.profile} />
      </main>
    </>
  );
}
