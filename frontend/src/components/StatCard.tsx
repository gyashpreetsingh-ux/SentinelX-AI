import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'cyan' | 'emerald' | 'rose' | 'amber' | 'purple';
  trend?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'cyan',
  trend,
  className = ""
}) => {
  const variantStyles = {
    cyan: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10 hover:border-cyan-400/50',
    emerald: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:border-emerald-400/50',
    rose: 'border-rose-500/30 text-rose-400 bg-rose-500/10 hover:border-rose-400/50',
    amber: 'border-amber-500/30 text-amber-400 bg-amber-500/10 hover:border-amber-400/50',
    purple: 'border-purple-500/30 text-purple-400 bg-purple-500/10 hover:border-purple-400/50'
  };

  return (
    <div className={`rounded-xl border border-cyber-800 bg-cyber-900/80 p-5 backdrop-blur-md transition-all duration-200 hover:shadow-lg ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-lg border ${variantStyles[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono tracking-tight text-slate-100">{value}</span>
        {trend && (
          <span className="text-xs font-mono text-emerald-400 flex items-center">
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
};
