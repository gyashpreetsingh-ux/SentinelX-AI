import React from 'react';
import { Shield, User, Award, Code, CheckCircle2, AlertTriangle, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Card */}
      <div className="p-8 rounded-2xl border border-cyan-500/30 bg-cyber-900/90 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0 cyber-glow-cyan">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400">PROJECT IDENTITY</span>
            <h1 className="text-2xl font-extrabold text-slate-100 mt-1">
              SentinelX AI — Next-Gen Autonomous Cyber Defense Platform
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Detect. Understand. Contain. Recover. Learn.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-cyber-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 block">LEAD ARCHITECT & ENGINEER:</span>
            <strong className="text-cyan-300 font-bold text-sm">Yashpreet Singh</strong>
          </div>
          <div>
            <span className="text-slate-500 block">DEVELOPMENT YEAR:</span>
            <strong className="text-slate-200 font-bold text-sm">2026</strong>
          </div>
          <div>
            <span className="text-slate-500 block">SYSTEM STATUS:</span>
            <strong className="text-emerald-400 font-bold text-sm">OPERATIONAL (v1.0.0)</strong>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="p-6 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md space-y-3">
        <h2 className="text-base font-bold text-slate-100">Project Mission & Vision</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Modern security teams face alert fatigue, complex multi-stage intrusions, and slow incident response times. <strong>SentinelX AI</strong> is engineered as a controlled, privacy-first 24/7 digital security team that bridges the gap between raw telemetry ingestion, local machine learning behavioral profiling, and policy-guarded autonomous containment and verified recovery.
        </p>
        <p className="text-xs text-slate-400 leading-relaxed font-mono">
          Strictly engineered for authorized defensive environments, local cybersecurity labs, education, and research demonstrations.
        </p>
      </div>

      {/* Core Safety Principles */}
      <div className="p-6 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md space-y-4">
        <h2 className="text-base font-bold text-slate-100">Defensive Cybersecurity Safety Principles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl border border-cyber-800 bg-cyber-850">
            <span className="text-cyan-400 font-bold block mb-1">01. Privacy-First Local AI</span>
            <p className="text-slate-400 text-[11px]">
              All anomaly models run locally on-device. No employee biometric or behavioral data leaves the network.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-cyber-800 bg-cyber-850">
            <span className="text-cyan-400 font-bold block mb-1">02. Zero-False-Positive Decoys</span>
            <p className="text-slate-400 text-[11px]">
              Digital Labyrinth honeypots carry zero operational utility. Any touch is a confirmed adversary indicator.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-cyber-800 bg-cyber-850">
            <span className="text-cyan-400 font-bold block mb-1">03. Policy-Guarded Autonomy</span>
            <p className="text-slate-400 text-[11px]">
              No black-box actions. Autonomous isolation requires high risk AND high confidence thresholds.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-cyber-800 bg-cyber-850">
            <span className="text-cyan-400 font-bold block mb-1">04. Certified State Verification</span>
            <p className="text-slate-400 text-[11px]">
              Recoveries are certified clean using cryptographic SHA-256 integrity checks against golden baselines.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Stack Breakdown */}
      <div className="p-6 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md space-y-3">
        <h2 className="text-base font-bold text-slate-100">Engineering Technology Stack</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-cyber-850 border border-cyber-800">
            <span className="text-slate-500 text-[10px] block">FRONTEND</span>
            <span className="text-slate-200 font-bold">React 18 & Vite</span>
          </div>
          <div className="p-3 rounded-lg bg-cyber-850 border border-cyber-800">
            <span className="text-slate-500 text-[10px] block">LANGUAGE</span>
            <span className="text-slate-200 font-bold">TypeScript</span>
          </div>
          <div className="p-3 rounded-lg bg-cyber-850 border border-cyber-800">
            <span className="text-slate-500 text-[10px] block">BACKEND</span>
            <span className="text-slate-200 font-bold">Python 3.12 FastAPI</span>
          </div>
          <div className="p-3 rounded-lg bg-cyber-850 border border-cyber-800">
            <span className="text-slate-500 text-[10px] block">AI / ML ENGINE</span>
            <span className="text-slate-200 font-bold">Isolation Forest</span>
          </div>
        </div>
      </div>
    </div>
  );
};
