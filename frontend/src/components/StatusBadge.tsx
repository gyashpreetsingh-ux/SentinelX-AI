import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  const norm = (status || "").toUpperCase();

  let colorClasses = "bg-slate-800 border-slate-700 text-slate-300";
  let dotColor = "bg-slate-400";

  if (norm === "ONLINE" || norm === "RESOLVED" || norm === "RECOVERED" || norm === "ACTIVE" || norm === "SUCCESS") {
    colorClasses = "bg-emerald-950/60 border-emerald-500/40 text-emerald-300";
    dotColor = "bg-emerald-400";
  } else if (norm === "SUSPICIOUS" || norm === "INVESTIGATING" || norm === "MONITORING" || norm === "IN_PROGRESS" || norm === "STEP_UP") {
    colorClasses = "bg-amber-950/60 border-amber-500/40 text-amber-300";
    dotColor = "bg-amber-400";
  } else if (norm === "QUARANTINED" || norm === "CRITICAL" || norm === "FAILED") {
    colorClasses = "bg-rose-950/60 border-rose-500/40 text-rose-300";
    dotColor = "bg-rose-400 animate-ping";
  } else if (norm === "RECOVERING" || norm === "VERIFYING") {
    colorClasses = "bg-cyan-950/60 border-cyan-500/40 text-cyan-300";
    dotColor = "bg-cyan-400 animate-pulse";
  } else if (norm === "FALSE_POSITIVE") {
    colorClasses = "bg-slate-900 border-slate-700 text-slate-400";
    dotColor = "bg-slate-500";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-mono font-medium tracking-wide ${colorClasses} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {norm}
    </span>
  );
};
