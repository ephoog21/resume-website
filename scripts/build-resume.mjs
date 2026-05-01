// scripts/build-resume.mjs
// Generates a placeholder resume PDF at /public/resume.pdf from the canonical
// profile data. This is intentionally simple: when Ed wants his preferred
// hand-tuned resume on the site, he replaces /public/resume.pdf and removes
// this script from the build pipeline. The README documents both options.
//
// We shell out to a tiny Python helper because reportlab gives us much better
// typographic control than client-side HTML→PDF for a small file. Python is
// available on Vercel build images out of the box.

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const helper = path.join(ROOT, "scripts", "build-resume.py");

const result = spawnSync("python3", [helper], {
  cwd: ROOT,
  stdio: "inherit",
});

if (result.status !== 0) {
  console.warn(
    "[build-resume] Python/reportlab unavailable — skipping PDF gen. " +
      "The site still builds; the /resume.pdf link will 404 until you drop a " +
      "real PDF at /public/resume.pdf."
  );
  // Don't fail the build. The PDF is a nice-to-have, not a requirement.
  process.exit(0);
}
