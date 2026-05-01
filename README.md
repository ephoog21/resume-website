# Ed Hoogasian — Personal Site

Editorial, content-driven portfolio for **Ed Hoogasian**, Senior Analytics & AI Strategy Leader. Built as a static Next.js App Router site so it deploys to Vercel as pure pre-rendered HTML/CSS/JS — no database, no API routes, no runtime cost beyond the CDN.

The whole site is generated at build time from a single canonical source: `data/source/ed_hoogasian_resume_database.json`. Edit the JSON, run `npm run build:content`, and the website + downloadable resume PDF both regenerate.

---

## Stack

- **Next.js 14** (App Router, mostly server components)
- **TypeScript**, strict
- **Tailwind CSS** with a custom design-token layer (no shadcn, no Radix — kept the dependency tree small)
- **Framer Motion** for the rotating-highlight ticker, timeline expand/collapse, case-study reveal, and role-fit tab transitions
- **Fraunces** (variable serif) + **IBM Plex Sans** + **JetBrains Mono** via `next/font` (zero CLS, fully self-hosted)
- **reportlab** (Python) for the placeholder resume PDF generator

Production build is roughly **51 KB page JS / 139 KB First Load JS**, fully pre-rendered static HTML.

---

## Project layout

```
app/
  layout.tsx              fonts, metadata, JSON-LD Person, theme color
  page.tsx                composes the seven sections in order
  globals.css             design tokens, dot-grid bg, typography utilities
  sitemap.ts | robots.ts  SEO baseline
components/
  ui/
    SiteNav.tsx           sticky hairline nav
    SectionHeader.tsx     indexed editorial section header (used everywhere)
    ProofPointCard.tsx    reusable achievement card
  sections/
    Hero.tsx
    RotatingHighlights.tsx     auto-advancing card + index ledger
    ExperienceTimeline.tsx     filterable, expandable role timeline
    SkillMatrix.tsx            cluster grid + click-to-filter proof points
    CaseStudyGrid.tsx          editorial 2+3 grid with inline expand
    RoleFitExplorer.tsx        9 role themes ↔ matched proofs/case studies
    ContactSection.tsx         footer + contact rows + colophon
data/
  source/
    ed_hoogasian_resume_database.json    canonical content (edit this)
  profile.json            generated denormalized site content
  profile.ts              typed accessor consumed by components
scripts/
  build-data.mjs          transforms source JSON → profile.json
  build-resume.mjs        wrapper that calls build-resume.py
  build-resume.py         renders public/resume.pdf with reportlab
public/
  resume.pdf              placeholder (auto-generated; replace with your own)
```

---

## Local development

Requires Node 18+ and Python 3 (only for the resume PDF — the site builds without it).

```bash
npm install
pip install reportlab          # optional, only for the resume PDF
npm run dev                    # builds content, then starts Next on :3000
```

`npm run dev` runs `build:content` first so the dev server always sees fresh data.

### Common tasks

| Task                                   | Command                  |
| -------------------------------------- | ------------------------ |
| Start dev server                       | `npm run dev`            |
| Production build                       | `npm run build`          |
| Start production server                | `npm run start`          |
| Regenerate site data only              | `npm run build:data`     |
| Regenerate resume PDF only             | `npm run build:resume`   |
| Regenerate everything content-side     | `npm run build:content`  |

---

## Updating the content

There is **one source of truth**: `data/source/ed_hoogasian_resume_database.json`.

Anatomy of the file (matches the canonical resume database):

```jsonc
{
  "profile": { /* name, headline, summary, contact, differentiators */ },
  "experience": [ /* role objects with role_id, company, title, dates */ ],
  "achievements": [ /* linked to roles by role_id, with metrics */ ],
  "skills": [ /* skill name, category, evidence, role_ids */ ],
  "project_stories": [ /* problem / actions / impact case studies */ ],
  "positioning_variants": [ /* role-fit themes for the explorer */ ],
  "ats_keyword_bank": [ /* keyword groups for SEO and ATS */ ]
}
```

Edit the JSON, then:

```bash
npm run build:content
```

The build script:

1. Sanitizes the text (strips tailoring-engine annotations like “depending on resume variant”).
2. Clusters skills into seven editorial groups (`data/profile.json → skillClusters`).
3. Pre-computes the rotating highlight order, the role-fit proof-point matches, and the case-study ↔ keyword joins so the runtime stays static.
4. Regenerates `public/resume.pdf` from the same JSON.

If you don’t want the auto-generated resume, drop your own PDF at `public/resume.pdf` after the build, or remove the `build:resume` step from the `build` script in `package.json`.

---

## Deploying to Vercel

The site is pure static — no environment variables, no edge config required.

### Option 1 — One-click

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project → Import** the repo.
3. Vercel auto-detects Next.js; click **Deploy**.

### Option 2 — CLI

```bash
npm install -g vercel
vercel              # first deploy
vercel --prod       # promote to production
```

### Build settings (Vercel will pick these up automatically)

| Setting           | Value                  |
| ----------------- | ---------------------- |
| Framework Preset  | Next.js                |
| Build Command     | `npm run build`        |
| Output Directory  | `.next` (default)      |
| Install Command   | `npm install`          |
| Node Version      | 18.x or 20.x           |

> **Note on the resume PDF on Vercel:** Vercel build images include Python 3, but **not** `reportlab`. The wrapper in `scripts/build-resume.mjs` is intentionally non-fatal — if Python or reportlab is missing, the build prints a warning and continues. If you want the auto-generated PDF on Vercel, either commit `public/resume.pdf` to the repo (recommended) or add a `pip install reportlab` step in the build command:
>
> ```
> Build Command: pip install reportlab && npm run build
> ```
>
> The simplest and most common path is to just commit your real resume PDF to `public/resume.pdf` and remove the `build:resume` step from `package.json`.

### Custom domain

Once deployed, in the Vercel dashboard go to **Project → Settings → Domains** and add `edhoogasian.com` (or whichever domain you own). Update `SITE_URL` in `app/layout.tsx`, `app/sitemap.ts`, and `app/robots.ts` if the production domain changes — these power the canonical URL, OpenGraph URL, and JSON-LD `sameAs`.

---

## Customizing the look

All design tokens live in `app/globals.css`:

- `--ink` (page background)
- `--parchment` / `--parchment-dim` / `--parchment-mute` (text shades)
- `--amber-glow` / `--amber-deep` (the single warm accent)
- `--teal-accent` (used sparingly behind the hero)

Type ramps (`.display-xl`, `.display-lg`, `.display-md`, `.eyebrow`) are also in `globals.css`. Tailwind in `tailwind.config.js` exposes the same tokens for utility-class use.

**Swapping fonts:** change the imports at the top of `app/layout.tsx`. The CSS variables `--font-display`, `--font-sans`, `--font-mono` propagate everywhere automatically.

**Replacing the resume PDF:** drop your file at `public/resume.pdf`. Both the hero CTA (`Download resume`) and the contact section (`Download resume PDF`) link there. The placeholder is auto-generated from the same database, so even before you swap in a hand-tuned PDF, the link resolves to a passable resume.

**Adding sections:** create a new component under `components/sections/`, import it in `app/page.tsx`, and add a corresponding nav link in `components/ui/SiteNav.tsx`. If the new section is interactive, mark it `"use client"` and consider wrapping the import in `next/dynamic` like the others.

---

## SEO and metadata

- **Title + description**: `app/layout.tsx` pulls from the canonical positioning summary.
- **OpenGraph + Twitter cards**: same source, no separate copy to keep in sync.
- **JSON-LD Person**: `app/layout.tsx` emits a structured `Person` blob with email, LinkedIn, employer, and capability clusters so search engines understand who this is.
- **Sitemap + robots**: generated at `/sitemap.xml` and `/robots.txt` via `app/sitemap.ts` and `app/robots.ts`.
- **Reduced motion**: `prefers-reduced-motion: reduce` zeros all animation durations in `globals.css`. Framer Motion respects the same flag automatically.

If you add an OG image, drop it at `public/og.png` (1200×630) and add `images: ['/og.png']` to the `openGraph` block in `app/layout.tsx`.

---

## Performance notes

- The hero, section headers, and contact section are server components — they render to plain HTML at build time.
- Only the four interactive sections (Highlights, Timeline, Skills, Case Studies, Role Fit) ship JS, and they're each their own dynamic chunk so the home route's first paint isn't blocked on the matrix logic.
- `next/font` self-hosts the three font families, so there are no third-party font-CDN round-trips.
- The dot-grid background is a CSS `radial-gradient`, not an image asset.
- Lazy-rendering images: not currently needed (no large imagery), but `<Image />` from `next/image` is available if you add a headshot.

---

## Assumptions made while building

A handful of editorial decisions worth flagging so anyone updating the site knows where they came from:

1. **Skill clustering.** The source database categorizes skills into ~10 fine-grained categories (Technical, BI/Visualization, Domain, AI, Leadership, Tools, etc.). The brief asked for seven clusters that read better in an editorial layout, so `scripts/build-data.mjs` re-buckets them. If you want a different grouping, edit `clusterMap` in that file.

2. **Highlight ordering.** The rotating ticker has ten entries. The order is hand-curated to lead with the strongest quantified wins ($5.5M ARR → 2,000+ hours → 15%+ conversion …) rather than chronological. See `highlightOrder` in `scripts/build-data.mjs`.

3. **Highlight titles.** The source achievements are full prose. The ticker needs short titles. `deriveHighlightTitle()` in `build-data.mjs` maps each achievement ID to a hand-written 4–6 word title. New highlights without a mapping fall back to the metric string.

4. **Role-fit matching.** The source has nine `positioning_variants`. For each one, `themeMatchers` in `build-data.mjs` runs a regex over each achievement's text and tags to surface the strongest proof points. The matchers are intentionally fuzzy/permissive so newly added achievements get auto-classified. Tighten the regexes if you find false positives.

5. **Sanitized copy.** The source contains tailoring-engine annotations like “30-50% / 40-50% depending on resume variant” intended for a separate application generator. `cleanText()` strips those before they reach the site or the resume PDF. If you add new annotation patterns, extend the regex.

6. **Education in experience array.** The source database keeps education in the same `experience` array as roles, with IDs prefixed `EDU`. The build script splits them so the timeline only shows employment and education appears in its own footnote block.

7. **CocoChew current/end dates.** The source says `"end": "Present / Dec 2025 in some variants"`. The site formatter passes that through verbatim — if you want a single canonical end date, fix it in the source JSON.

8. **No headshot.** None was provided. The hero is intentionally typographic. If you add a headshot, a good slot is the right rail of the hero where the “Signature Ledger” currently lives, or alongside the off-the-clock card in the contact section.

9. **Domain placeholder.** The metadata uses `https://edhoogasian.com`. Update `SITE_URL` in `app/layout.tsx`, `app/sitemap.ts`, and `app/robots.ts` if the real domain is different.

10. **Resume PDF is a placeholder.** It's auto-generated from the database so the download link works on first deploy. Replace `public/resume.pdf` with the hand-tuned version you actually send to recruiters. The hero CTA, the contact CTA, and the resume link all point at `/resume.pdf` — no template variables to update, just swap the file.

---

## Accessibility checklist

- Semantic landmarks: `<nav>`, `<main>`, `<section aria-label>`, `<article>`, `<ol>`, `<aside>`, `<footer>`.
- All interactive elements (filter chips, role tabs, expand buttons, ticker pause) have `aria-pressed`, `aria-selected`, `aria-expanded`, or `aria-controls` as appropriate.
- The rotating highlights ticker pauses on hover **and** keyboard focus.
- `prefers-reduced-motion: reduce` disables the ticker rotation and all transitions.
- Color contrast: parchment-on-ink hits WCAG AA at body sizes; the warm-amber accent on dark ink hits AA Large at 18pt+.
- All images use `aria-hidden` for decorative SVG icons (`<svg aria-hidden>`).

---

## License

Personal site. Code is not separately licensed. Don’t lift the content (writing, metrics, role history) — it belongs to Ed.
