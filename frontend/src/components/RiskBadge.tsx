import React from 'react';

interface RiskBadgeProps {
  score: number;
  showScore?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ score, showScore = true, className = "" }) => {
  let severity = "LOW";
  let classes = "bg-emerald-950/60 border-emerald-500/40 text-emerald-300";

  if (score >= 80) {
    severity = "CRITICAL";
    classes = "bg-rose-950/70 border-rose-500/50 text-rose-300 cyber-glow-rose font-bold";
  } else if (score >= 60) {
    severity = "HIGH";
    classes = "bg-orange-950/60 border-orange-500/40 text-orange-300";
  } else if (score >= 30) {
    severity = "MEDIUM";
    classes = "bg-amber-950/60 border-amber-500/40 text-amber-300";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border text-xs font-mono tracking-wider ${classes} ${className}`}>
      <span>{severity}</span>
      {showScore && <span className="opacity-80">({Math.round(score)}/100)</span>}
    </span>
  );
};
