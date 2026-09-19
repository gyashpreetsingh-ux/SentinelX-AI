import React from 'react';
import { Layers, Database, Brain, Shield, RefreshCw, Eye, ArrowDown, Cpu, Activity, Lock } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const LAYERS = [
    {
      number: '01',
      name: 'DATA & SENSING LAYER',
      icon: Database,
      accent: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-400',
      description: 'Continuous ingest of simulated enterprise telemetry without host intrusion.',
      components: [
        'Virtual Endpoint Telemetry (Linux, Windows, macOS)',
        'Authentication & Session Handshake Records',
        'Simulated NetFlow / Synthetic Socket Metadata',
        'Scam-Bait Mail Ingestion Stream',
        'Approved Threat Intelligence Adapter Feeds'
      ]
    },
    {
      number: '02',
      name: 'AI & HEURISTIC ANALYSIS LAYER',
      icon: Brain,
      accent: 'border-purple-500/40 bg-purple-950/20 text-purple-400',
      description: 'Privacy-first local machine learning and biometric variance attribution.',
      components: [
        'Local Scikit-Learn Isolation Forest Engine',
        'Continuous Behavioral Baseline Profiler (Ghost Pattern)',
        'Multi-Vector Event Correlation Matrix',
        'Explainable AI (XAI) Feature Attribution Engine',
        'Heuristic Phishing Lure Parser'
      ]
    },
    {
      number: '03',
      name: 'DECISION & POLICY LAYER',
      icon: Shield,
      accent: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
      description: 'Rule-driven autonomous threshold evaluation with strict RBAC guardrails.',
      components: [
        'Weighted Risk Engine (0–100 Normalized Scoring)',
        'Multi-Sensor Statistical Confidence Correlator',
        'Configurable Policy Rules (Auto-Quarantine Thresholds)',
        'Digital Labyrinth Decoy Canary Tripwires',
        'Role-Based Access Enforcement (Admin, Analyst, Viewer)'
      ]
    },
    {
      number: '04',
      name: 'AUTONOMOUS RESPONSE & RESILIENCE LAYER',
      icon: RefreshCw,
      accent: 'border-rose-500/40 bg-rose-950/20 text-rose-400',
      description: 'Automated policy enforcement, state isolation, and verified snapshot rollback.',
      components: [
        'Self-Heal Virtual Adapter Severing (Quarantine)',
        'Suspicious Process Suspension & Session Restriction',
        'Volatile Digital Memory Evidence Lockbox (SHA-256)',
        'Trusted Golden Snapshot Rollback Dispatcher',
        'Cryptographic Clean Baseline Verification'
      ]
    },
    {
      number: '05',
      name: 'VISIBILITY & COMPLIANCE LAYER',
      icon: Eye,
      accent: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400',
      description: 'Unified command center, forensic timelines, and immutable audit journal.',
      components: [
        'SOC Command Center Dashboard (Live Telemetry)',
        'Forensic Incident Reconstructor & Timeline',
        'Transparent Explainable AI (XAI) Cards',
        'Append-Only Immutable Audit Log Journal',
        'Interactive Cyber Defense Simulation Laboratory'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-cyber-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-slate-100">
              SYSTEM ARCHITECTURE & DEFENSIVE PIPELINE
            </h1>
            <span className="px-2.5 py-0.5 rounded-full border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 text-[10px] font-mono">
              5-TIER MODULAR SYSTEM
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Engineered by Yashpreet Singh (2026) for privacy-preserving, closed-loop autonomous cyber defense.
          </p>
        </div>
      </div>

      {/* 5-Tier Architecture Stack */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {LAYERS.map((layer, idx) => {
          const Icon = layer.icon;
          return (
            <React.Fragment key={layer.number}>
              <div className="p-6 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md hover:border-cyber-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl border ${layer.accent} flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-slate-400">LAYER {layer.number}</span>
                      <span className="text-slate-600">•</span>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-100">{layer.name}</h3>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">{layer.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      {layer.components.map((comp, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-2 rounded-lg bg-cyber-850 border border-cyber-800 text-slate-300 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                          <span>{comp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {idx < LAYERS.length - 1 && (
                <div className="flex justify-center my-1">
                  <div className="p-1 rounded-full bg-cyber-900 border border-cyber-800 text-cyan-400">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
