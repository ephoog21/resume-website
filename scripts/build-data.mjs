// scripts/build-data.mjs
// Transforms the canonical resume database JSON into a typed, denormalized
// profile object the website consumes. Run via `npm run build:data`.
//
// Source of truth: /data/source/ed_hoogasian_resume_database.json
// Output:          /data/profile.json (consumed by /data/profile.ts)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "data", "source", "ed_hoogasian_resume_database.json");
const OUT = path.join(ROOT, "data", "profile.json");

const raw = JSON.parse(fs.readFileSync(SRC, "utf8"));

// ---------- helpers ----------
const splitTags = (s) =>
  (s || "")
    .split(/[;,]/)
    .map((t) => t.trim())
    .filter(Boolean);

// Sanitize an achievement string. The source DB occasionally contains
// editorial annotations meant for a tailoring engine — e.g. "30-50% or
// 40-50% depending on resume variant" exposes a tailoring fork that should
// never reach a customer. We collapse those forks to the conservative
// number and strip the meta-phrase. Both "X or Y" and "X / Y" forms appear
// in the source (the metric field uses slashes; bullet text uses "or").
const cleanText = (t) =>
  (t || "")
    // "30-50% or 40-50%" → "30-50%"  ·  "30-50% / 40-50%" → "30-50%"
    .replace(
      /(\d+-\d+%)\s*(?:or|\/)\s*\d+-\d+%(\s+depending on resume (?:variant|wording))?\.?/gi,
      "$1"
    )
    .replace(/\s*depending on resume (?:variant|wording)\.?/gi, "")
    .replace(/ {2,}/g, " ")
    .trim();

const fmtDate = (s) => {
  if (!s) return "";
  if (/present/i.test(s)) return "Present";
  // accept "YYYY-MM" or "YYYY-MM-DD"
  const [y, m] = s.split("-");
  if (!y) return s;
  if (!m) return y;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const idx = parseInt(m, 10) - 1;
  return `${months[idx] ?? m} ${y}`;
};

// rough month delta for sorting newest first
const startKey = (s) => {
  if (!s) return 0;
  const [y, m] = s.split("-");
  return parseInt(y, 10) * 12 + (parseInt(m || "1", 10) - 1);
};

// ---------- transform ----------
const profile = raw.profile;

const experience = raw.experience
  .filter((e) => !e.role_id.startsWith("EDU")) // education handled separately
  .map((e) => {
    const achievements = raw.achievements
      .filter((a) => a.role_id === e.role_id)
      .map((a) => ({
        id: a.achievement_id,
        text: cleanText(a.achievement),
        metric: cleanText(a.metric),
        skillTags: splitTags(a.skill_tags),
        bestFor: splitTags(a.best_for),
      }));
    return {
      id: e.role_id,
      company: e.company,
      title: e.title,
      start: e.start,
      end: e.end,
      startLabel: fmtDate(e.start),
      endLabel: /present/i.test(e.end || "") ? "Present" : fmtDate(e.end),
      location: e.location,
      description: e.canonical_description,
      domains: splitTags(e.domains),
      achievements,
    };
  })
  .sort((a, b) => startKey(b.start) - startKey(a.start));

const education = raw.experience
  .filter((e) => e.role_id.startsWith("EDU"))
  .map((e) => ({
    id: e.role_id,
    school: e.company,
    degree: e.title,
    location: e.location,
    start: e.start,
    end: e.end,
    startLabel: fmtDate(e.start),
    endLabel: fmtDate(e.end),
    description: e.canonical_description,
  }));

// Group skills into editorial clusters. The source `category` is fine but we
// remap to the seven clusters the brief calls for so the UI tells a cleaner
// story.
const clusterMap = {
  "Analytics & BI": [
    "SQL","Tableau","Power BI","Looker","KPI Frameworks","Executive Reporting",
    "Dashboard Design","Self-Service BI & Enablement","Forecasting",
    "Conversion & Driver Analysis","Excel / PowerPoint",
  ],
  "GTM / RevOps / Customer Analytics": [
    "GTM Analytics","Segmentation","TAM / Whitespace Analysis",
    "Territory & Quota Planning","Funnel Analytics & Attribution",
    "Market Intelligence","Partner Program Analytics",
    "Customer Success Analytics","Competitive Intelligence","Salesforce",
  ],
  "AI / LLM / Automation": [
    "AI/LLM Workflows","Prompt Engineering","RAG (Retrieval-Augmented Generation)",
    "Agentic Workflows","LLM Evals & Guardrails",
    "Structured Extraction & Document Workflows","Contextual Memory & Session Layering",
    "NLP / Unstructured Data Analysis","Automation","No-code / Low-code",
    "API Integration",
  ],
  "Data Engineering & Analytics Engineering": [
    "Snowflake","dbt","Data Warehousing","ETL/ELT","Data Quality & Validation",
    "Metric Governance","Analytics Engineering","Databricks","Python",
  ],
  "Leadership & Communication": [
    "Stakeholder Management","Cross-Functional Facilitation",
    "Discovery & Facilitation","Project / Program Ownership",
    "Operating Rhythm Design","Data Storytelling",
  ],
  "Product & Workflow Systems": [
    "Product Strategy","Technical Product Management","Jira","React",
  ],
  "Strategy & Pricing": [
    "Pricing & Packaging Analysis","Pricing Telemetry & SKU Rationalization",
  ],
};

const skillByName = Object.fromEntries(raw.skills.map((s) => [s.skill, s]));
const skillClusters = Object.entries(clusterMap)
  .map(([cluster, names]) => ({
    cluster,
    skills: names
      .filter((n) => skillByName[n])
      .map((n) => {
        const s = skillByName[n];
        return {
          name: s.skill,
          category: s.category,
          detail: s.synonyms_or_detail,
          evidence: s.evidence,
          roleIds: splitTags(s.role_ids),
        };
      }),
  }))
  .filter((c) => c.skills.length > 0);

// Catch any skills not assigned to a cluster, fold into "Strategy & Pricing"
const used = new Set(skillClusters.flatMap((c) => c.skills.map((s) => s.name)));
const leftover = raw.skills.filter((s) => !used.has(s.skill));
if (leftover.length > 0) {
  const last = skillClusters.find((c) => c.cluster === "Strategy & Pricing");
  for (const s of leftover) {
    last.skills.push({
      name: s.skill,
      category: s.category,
      detail: s.synonyms_or_detail,
      evidence: s.evidence,
      roleIds: splitTags(s.role_ids),
    });
  }
}

// Project stories → case studies. We map keywords/skill_tags to skill names
// where possible so the role-fit selector can light up related items.
const caseStudies = raw.project_stories.map((p) => {
  const role = raw.experience.find((e) => e.role_id === p.role_id);
  return {
    id: p.story_id,
    title: p.title,
    company: role?.company ?? "",
    roleId: p.role_id,
    problem: cleanText(p.problem),
    actions: cleanText(p.actions),
    impact: cleanText(p.impact),
    keywords: splitTags(p.keywords),
  };
});

// Highlights = the rotating ticker of signature wins. Pull from achievements
// with the strongest metrics + a few from the brief's high-impact list.
const highlightOrder = [
  "ACH001", // $5.5M+ ARR
  "ACH002", // 2,000+ hours
  "ACH004", // 15%+ conversion
  "ACH005", // executive Tableau
  "ACH006", // global MSP
  "ACH003", // TAM granularity
  "ACH010", // LLM workflows
  "ACH008", // secure portal
  "ACH011", // supply chain
  "ACH012", // earnings-call
];

// Map each highlight to the matching project_story when available — that
// gives us authoritative problem / actions / impact text in the user's own
// voice. For highlights without a parallel story, we hand-write the same
// three fields from the achievement context, conservatively.
const highlightStoryMap = {
  ACH001: "STORY002", // ICP / $5.5M
  ACH002: "STORY003", // workflow automation
  ACH003: "STORY004", // TAM
  ACH006: "STORY001", // MSP transition
  ACH008: "STORY005", // intake portal
  ACH010: "STORY007", // LLM workflows
  ACH011: "STORY009", // supply chain
};

// Hand-authored problem/approach/outcome for highlights without a story.
// Stays close to the source achievement language — no fabricated metrics.
const highlightFallbacks = {
  ACH004: {
    problem:
      "Outbound and follow-up effort wasn't matched to where it would actually convert — qualification was inconsistent and time-sensitive signals were getting missed.",
    approach:
      "Defined ideal prospect qualifications using internal/external data and anecdotal field input, then translated that into time-sensitive outreach guidance the front-line team could act on the same week.",
    outcome:
      "Conversion rates improved 15%+ and the qualification framework became reusable across new segments and campaigns.",
  },
  ACH005: {
    problem:
      "An annual partner-program initiative needed a single set of numbers everyone — from the executive board down to individual contributors — could trust and read on the same cadence.",
    approach:
      "Designed the KPI framework end-to-end and built automated Tableau reporting layered for each audience: board-level rollups, exec views, manager dashboards, and IC-level drilldowns.",
    outcome:
      "One reporting system became the operating rhythm for daily and weekly reviews across the org, replacing fragmented PowerPoints and ad-hoc pulls.",
  },
  ACH012: {
    problem:
      "Sales, strategy, and the executive team were each pulling competitive, market, and forecasting context from different places — slowing planning cycles and weakening external narratives.",
    approach:
      "Built data products spanning competitive intelligence, TAM, data-driven prospecting, lead conversion, territory planning, forecasting, and GTM funnel reporting on Salesforce + Tableau, including a CRM migration to make the foundation durable.",
    outcome:
      "Outputs generated millions in pipeline and won business and were referenced in earnings calls — the same datasets served front-line targeting and external storytelling.",
  },
};

// Curated soft-skill pull per highlight — what the work actually exercises
// beyond the technical tags. Drawn from the achievement language itself
// (cross-functional inputs, executive narrative, etc.); nothing invented.
const highlightSoftSkills = {
  ACH001: ["Cross-functional facilitation", "Executive recommendation", "Translating qualitative signal into structure"],
  ACH002: ["Cross-team trust building", "Bias for reducing toil", "Process discipline"],
  ACH003: ["Strategic framing", "Stakeholder alignment", "Comfort with ambiguity at scale"],
  ACH004: ["Field-level empathy", "Decisive prioritization", "Translating evidence into guidance"],
  ACH005: ["Audience-aware storytelling", "Operating-rhythm design", "Executive communication"],
  ACH006: ["Program ownership", "Accuracy discipline", "Cross-system orchestration"],
  ACH008: ["Workflow empathy", "Product judgment", "Compliance-minded design"],
  ACH010: ["Systems thinking", "Quality discipline (evals, guardrails)", "Pragmatic AI judgment"],
  ACH011: ["Operations partnership", "Bottleneck thinking", "Practical recommendation"],
  ACH012: ["Executive narrative", "Long-horizon investment", "Cross-functional product orientation"],
};

const highlights = highlightOrder
  .map((id) => raw.achievements.find((a) => a.achievement_id === id))
  .filter(Boolean)
  .map((a) => {
    const role = raw.experience.find((e) => e.role_id === a.role_id);
    const storyId = highlightStoryMap[a.achievement_id];
    const story = storyId
      ? raw.project_stories.find((s) => s.story_id === storyId)
      : null;
    const fallback = highlightFallbacks[a.achievement_id];

    return {
      id: a.achievement_id,
      metric: cleanText(a.metric),
      title: deriveHighlightTitle(a),
      context: cleanText(a.achievement),
      company: role?.company ?? "",
      roleTitle: role?.title ?? "",
      skillTags: splitTags(a.skill_tags),
      softSkills: highlightSoftSkills[a.achievement_id] ?? [],
      problem: cleanText(story?.problem || fallback?.problem || ""),
      approach: cleanText(story?.actions || fallback?.approach || ""),
      outcome: cleanText(story?.impact || fallback?.outcome || ""),
    };
  });

function deriveHighlightTitle(a) {
  const m = {
    ACH001: "ICP redefinition that moved ARR",
    ACH002: "Manual workflow automation at scale",
    ACH004: "Conversion lift via prospect qualification",
    ACH005: "Exec-to-IC reporting cadence",
    ACH006: "Global MSP transition tracking",
    ACH003: "TAM modeled to building-level detail",
    ACH010: "LLM workflows with evals & guardrails",
    ACH008: "Secure intake & document portal",
    ACH011: "Supply-chain coordination reduction",
    ACH012: "Data products referenced in earnings calls",
  };
  return m[a.achievement_id] || a.metric;
}

// Role-fit themes from positioning_variants — these power the explorer.
// We attach the matching achievements/case studies by intersecting on `bestFor`
// and keyword cues.
const themeMatchers = {
  POS001: (a) => true, // broad: anything quantified
  POS002: (a) =>
    /BI|dashboards|Tableau|Power BI|reporting|KPI/i.test(
      [a.text, ...(a.skillTags || [])].join(" ")
    ),
  POS003: (a) =>
    /LLM|prompt|AI|product|portal|app|workflow|API|agentic|RAG/i.test(
      [a.text, ...(a.skillTags || [])].join(" ")
    ),
  POS004: (a) =>
    /ICP|TAM|territory|funnel|attribution|partner|GTM|RevOps|conversion|segment/i.test(
      [a.text, ...(a.skillTags || [])].join(" ")
    ),
  POS005: (a) =>
    /pipeline|automation|SQL|Snowflake|dbt|data quality|model|instrument|integration|integrating|DocuSign/i.test(
      [a.text, ...(a.skillTags || [])].join(" ")
    ),
  POS006: (a) =>
    /retention|customer|CSAT|sentiment|lifecycle|NLP|unstructured/i.test(
      [a.text, ...(a.skillTags || [])].join(" ")
    ),
  POS007: (a) =>
    /KPI|forecast|ROI|executive|narrative|earnings|leadership|operating rhythm/i.test(
      [a.text, ...(a.skillTags || [])].join(" ")
    ),
  POS008: (a) =>
    /pricing|packaging|SKU|competitive|ecosystem|market|brief/i.test(
      [a.text, ...(a.skillTags || [])].join(" ")
    ),
  POS009: (a) =>
    /workflow|automation|process|bottleneck|coordination|throughput|SLA|operational/i.test(
      [a.text, ...(a.skillTags || [])].join(" ")
    ),
};

const flatAch = experience.flatMap((e) =>
  e.achievements.map((a) => ({
    ...a,
    company: e.company,
    roleId: e.id,
  }))
);

const roleFit = raw.positioning_variants.map((v) => {
  const matcher = themeMatchers[v.variant_id] || (() => true);
  const matchedAch = flatAch
    .filter(matcher)
    .slice(0, 6)
    .map((a) => ({
      id: a.id,
      text: a.text,
      metric: a.metric,
      company: a.company,
    }));
  // Match case studies by keyword overlap with variant keywords
  const variantKws = splitTags(v.keywords).map((k) => k.toLowerCase());
  const matchedStudies = caseStudies
    .map((cs) => {
      const score = cs.keywords.filter((k) =>
        variantKws.some((vk) => k.toLowerCase().includes(vk) || vk.includes(k.toLowerCase()))
      ).length;
      return { cs, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => x.cs.id);

  return {
    id: v.variant_id,
    label: v.label,
    headline: v.headline,
    targetRoles: splitTags(v.target_roles),
    summary: v.summary,
    keywords: splitTags(v.keywords),
    proofIds: matchedAch.map((a) => a.id),
    proofs: matchedAch,
    caseStudyIds: matchedStudies,
  };
});

const out = {
  generatedAt: new Date().toISOString(),
  profile: {
    name: profile.name,
    location: profile.location,
    email: profile.email,
    phone: profile.phone,
    linkedin: profile.linkedin,
    headline: profile.primary_positioning,
    summary: profile.primary_summary,
    differentiators: profile.differentiators,
    personalNotes: profile.personal_notes,
  },
  highlights,
  experience,
  education,
  skillClusters,
  caseStudies,
  roleFit,
  atsBank: raw.ats_keyword_bank,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));

console.log(
  `✓ Wrote ${OUT}\n  experience: ${experience.length}\n  achievements: ${flatAch.length}\n  skills: ${skillClusters.reduce((n, c) => n + c.skills.length, 0)} across ${skillClusters.length} clusters\n  case studies: ${caseStudies.length}\n  role-fit themes: ${roleFit.length}`
);
