// components/ui/ProofPointCard.tsx
// Reusable proof-point card. Used by the SkillMatrix and RoleFitExplorer
// sections, and available for any future pages that need to surface a
// quantified achievement next to its company context.

type Props = {
  metric: string;
  text: string;
  company?: string;
  tags?: string[];
  size?: "sm" | "md";
};

export function ProofPointCard({
  metric,
  text,
  company,
  tags,
  size = "md",
}: Props) {
  return (
    <article
      className={`card-glass card-glass-hover rounded-lg ${
        size === "sm" ? "p-4" : "p-5"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="metric-chip">{metric}</span>
        {company && (
          <span className="font-mono text-[0.65rem] tracking-widest2 text-parchment-mute">
            {company.toUpperCase()}
          </span>
        )}
      </div>
      <p
        className={`text-parchment-dim leading-relaxed ${
          size === "sm" ? "text-sm" : ""
        }`}
      >
        {text}
      </p>
      {tags && tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.slice(0, 5).map((t) => (
            <span key={t} className="tag-chip">
              {t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
