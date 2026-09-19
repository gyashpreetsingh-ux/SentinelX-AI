import React from 'react';
import { Brain, HelpCircle, Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ExplanationCardProps {
  title?: string;
  whatHappened: string;
  whySuspicious: string;
  evidence: string[];
  riskScore: number;
  confidenceScore: number;
  action: string;
  className?: string;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  title = "Explainable AI (XAI) Decision Breakdown",
  whatHappened,
  whySuspicious,
  evidence,
  riskScore,
  confidenceScore,
  action,
  className = ""
}) => {
  const isCritical = riskScore >= 80;
  const isHigh = riskScore >= 60 && riskScore < 80;
  const isMedium = riskScore >= 30 && riskScore < 60;

  return (
    <div className={`rounded-xl border p-5 bg-cyber-900/90 backdrop-blur-md transition-all ${
      isCritical
        ? 'border-rose-500/40 shadow-lg shadow-rose-950/30'
        : isHigh
        ? 'border-orange-500/40 shadow-lg shadow-orange-950/30'
        : isMedium
        ? 'border-amber-500/40'
        : 'border-cyan-500/40'
    } ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyber-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide text-slate-100">{title}</h3>
            <p className="text-xs text-slate-400">Autonomous Model Inference & Heuristic Attribution</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-slate-300">
            Confidence: <strong className="text-cyan-400">{confidenceScore}%</strong>
          </span>
          <span className={`text-xs px-2.5 py-1 rounded border font-mono font-bold ${
            isCritical ? 'bg-rose-500/20 border-rose-500 text-rose-300' :
            isHigh ? 'bg-orange-500/20 border-orange-500 text-orange-300' :
            isMedium ? 'bg-amber-500/20 border-amber-500 text-amber-300' :
            'bg-emerald-500/20 border-emerald-500 text-emerald-300'
          }`}>
            Risk: {riskScore}/100
          </span>
        </div>
      </div>

      {/* Grid of Explainability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* WHAT happened */}
        <div className="p-3 rounded-lg bg-cyber-850/80 border border-cyber-800">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
            <Info className="w-3.5 h-3.5" />
            <span>WHAT HAPPENED?</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{whatHappened}</p>
        </div>

        {/* WHY suspicious */}
        <div className="p-3 rounded-lg bg-cyber-850/80 border border-cyber-800">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>WHY SUSPICIOUS?</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{whySuspicious}</p>
        </div>

        {/* WHAT evidence */}
        <div className="p-3 rounded-lg bg-cyber-850/80 border border-cyber-800 md:col-span-2">
          <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>PRIMARY EVIDENCE & ANOMALY SIGNALS:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            {evidence.map((item, idx) => (
              <li key={idx} className="font-mono text-[11px] leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* WHAT action */}
        <div className="p-3 rounded-lg bg-cyber-850/80 border border-cyber-800 md:col-span-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-200">POLICY RECOMMENDED DEFENSIVE ACTION:</span>
          </div>
          <span className="px-3 py-1 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-mono font-bold tracking-wider text-xs">
            {action}
          </span>
        </div>
      </div>
    </div>
  );
};
