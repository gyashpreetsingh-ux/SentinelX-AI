import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Zap,
  Activity,
  Boxes,
  RefreshCw,
  Mail,
  Search,
  CheckCircle,
  ArrowRight,
  Lock,
  Cpu,
  Layers,
  Terminal,
  Server
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cyber-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-cyber-800 bg-cyber-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 cyber-glow-cyan">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-cyan-400 to-sky-200 bg-clip-text text-transparent">
              SENTINELX AI
            </span>
            <p className="text-[10px] text-slate-400 font-mono">Autonomous Cyber Defense Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-lg shadow-cyan-500/20 cyber-glow-cyan flex items-center gap-2"
          >
            <span>Launch Security Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-6xl mx-auto text-center overflow-hidden">
        {/* Decorative Grid Glow */}
        <div className="absolute inset-0 radar-grid opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>AUTONOMOUS THREAT CONTAINMENT & VERIFIED SNAPSHOT ROLLBACK</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight">
          Autonomous Cyber Defense, Built for the Next Threat.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Detect abnormal behavior. Understand risk. Contain high-confidence threats. Recover safely. Powered by local ML Isolation Forest anomaly detection and self-healing rollbacks.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 transition-all shadow-xl shadow-cyan-500/20 flex items-center gap-2.5 cyber-glow-cyan"
          >
            <span>Launch Security Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/simulation')}
            className="px-6 py-3.5 rounded-xl text-sm font-bold border border-purple-500/40 bg-purple-950/30 hover:bg-purple-950/50 text-purple-300 transition-all flex items-center gap-2.5 shadow-lg shadow-purple-950/40"
          >
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Run Defense Simulation</span>
          </button>
        </div>

        {/* Command Center Pipeline Flow Visual */}
        <div className="mt-16 p-6 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md shadow-2xl relative">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-6 text-left flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>AUTONOMOUS RESPONSE LIFECYCLE (CLOSED-LOOP SOC AUTOMATION)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-left">
            {/* Step 1 */}
            <div className="p-4 rounded-xl border border-cyber-800 bg-cyber-850/80 hover:border-cyan-500/40 transition-all">
              <div className="text-[10px] font-mono text-cyan-400 font-bold mb-1">01. SENSE</div>
              <h4 className="text-xs font-bold text-slate-200">Threat Detection</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Continuous ingestion of telemetry, auth logs, process spawns & honeypot canary tripwires.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl border border-cyber-800 bg-cyber-850/80 hover:border-purple-500/40 transition-all">
              <div className="text-[10px] font-mono text-purple-400 font-bold mb-1">02. ANALYZE</div>
              <h4 className="text-xs font-bold text-slate-200">AI / ML Analysis</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Local Isolation Forest identifies behavioral outliers against historical enterprise baselines.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl border border-cyber-800 bg-cyber-850/80 hover:border-amber-500/40 transition-all">
              <div className="text-[10px] font-mono text-amber-400 font-bold mb-1">03. SCORE</div>
              <h4 className="text-xs font-bold text-slate-200">Risk & Confidence</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Multi-signal weighting isolates high-fidelity breaches (e.g. Risk: 94/100, Conf: 97%).
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl border border-cyber-800 bg-cyber-850/80 hover:border-rose-500/40 transition-all">
              <div className="text-[10px] font-mono text-rose-400 font-bold mb-1">04. CONTAIN</div>
              <h4 className="text-xs font-bold text-slate-200">Autonomous Action</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Policy engine severs network adapters, isolates rogue PIDs, and locks digital evidence vaults.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-xl border border-cyber-800 bg-cyber-850/80 hover:border-emerald-500/40 transition-all">
              <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1">05. RECOVER</div>
              <h4 className="text-xs font-bold text-slate-200">Verified Rollback</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Restores state from trusted golden snapshot, verifies SHA-256 clean integrity, and resolves incident.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Modules Showcase */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Core Autonomous Defense Modules
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Engineered with privacy-first local ML and deterministic defensive tripwires.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Ghost Pattern */}
          <div className="p-6 rounded-2xl border border-cyber-800 bg-cyber-900/60 hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Ghost Pattern</h3>
            <p className="text-xs text-cyan-400 font-mono mt-0.5">Behavioral Anomaly Engine</p>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Tracks session durations, login hours, typing dynamics, and file access rates. Evaluates deviation against continuous personal baselines.
            </p>
          </div>

          {/* Digital Labyrinth */}
          <div className="p-6 rounded-2xl border border-cyber-800 bg-cyber-900/60 hover:border-purple-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
              <Boxes className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Digital Labyrinth</h3>
            <p className="text-xs text-purple-400 font-mono mt-0.5">Deception Decoy Network</p>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Deploys synthetic admin portals, canary finance shares, faux database listeners, and API key vaults. Traps attackers with zero false alarms.
            </p>
          </div>

          {/* Self-Heal */}
          <div className="p-6 rounded-2xl border border-cyber-800 bg-cyber-900/60 hover:border-emerald-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Self-Heal Core</h3>
            <p className="text-xs text-emerald-400 font-mono mt-0.5">Containment & Snapshot Recovery</p>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Instant policy-controlled quarantine, digital memory evidence locking, and certified golden snapshot rollback with cryptographic integrity checks.
            </p>
          </div>

          {/* Scam-Bait */}
          <div className="p-6 rounded-2xl border border-cyber-800 bg-cyber-900/60 hover:border-pink-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Scam-Bait</h3>
            <p className="text-xs text-pink-400 font-mono mt-0.5">Phishing Intelligence Heuristics</p>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Real-time heuristic evaluation of inbound communications, credential harvesting lures, urgency coercion, spoofed domains, and macro attachments.
            </p>
          </div>

          {/* Predictive Hunt */}
          <div className="p-6 rounded-2xl border border-cyber-800 bg-cyber-900/60 hover:border-amber-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Predictive Hunt</h3>
            <p className="text-xs text-amber-400 font-mono mt-0.5">Threat Intelligence Feeds</p>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Correlates synthetic indicator feeds, active malware signatures, credential abuse lists, and anomalous external IP ranges into a unified hunting canvas.
            </p>
          </div>

          {/* Explainable AI */}
          <div className="p-6 rounded-2xl border border-cyber-800 bg-cyber-900/60 hover:border-sky-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Explainable AI (XAI)</h3>
            <p className="text-xs text-sky-400 font-mono mt-0.5">Transparent Decision Attribution</p>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              No black-box decisions. Every autonomous action explicitly details what happened, why suspicious, contributing evidence, and exact policy matches.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Guardrails Banner */}
      <section className="py-10 px-6 max-w-4xl mx-auto w-full">
        <div className="p-6 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-md">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 mt-1 flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-cyan-200">Strict Defensive Cybersecurity Safety Architecture</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                SentinelX AI is engineered strictly for authorized defensive environments, cybersecurity labs, education, and research demonstrations. All network endpoints, IPs, files, processes, and attack vectors operate on 100% synthetic data with zero external retaliation or offensive activity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-12 px-6 max-w-6xl mx-auto border-t border-cyber-800 text-center">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-6">
          ENTERPRISE FULL-STACK ARCHITECTURE
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-mono">
          <span className="px-3 py-1.5 rounded-lg border border-cyber-800 bg-cyber-900">React 18</span>
          <span className="px-3 py-1.5 rounded-lg border border-cyber-800 bg-cyber-900">TypeScript</span>
          <span className="px-3 py-1.5 rounded-lg border border-cyber-800 bg-cyber-900">FastAPI</span>
          <span className="px-3 py-1.5 rounded-lg border border-cyber-800 bg-cyber-900">Python 3.12</span>
          <span className="px-3 py-1.5 rounded-lg border border-cyber-800 bg-cyber-900">Scikit-Learn (Isolation Forest)</span>
          <span className="px-3 py-1.5 rounded-lg border border-cyber-800 bg-cyber-900">SQLAlchemy ORM</span>
          <span className="px-3 py-1.5 rounded-lg border border-cyber-800 bg-cyber-900">Tailwind CSS</span>
          <span className="px-3 py-1.5 rounded-lg border border-cyber-800 bg-cyber-900">WebSocket Telemetry</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-cyber-800 bg-cyber-950 text-center text-xs text-slate-400 font-mono">
        <p>© 2026 Yashpreet Singh. SentinelX AI — Autonomous Cyber Defense Platform.</p>
        <p className="text-[11px] text-slate-400 mt-1">
          Detect. Understand. Contain. Recover. Learn. Built by Yashpreet Singh.
        </p>
      </footer>
    </div>
  );
};
