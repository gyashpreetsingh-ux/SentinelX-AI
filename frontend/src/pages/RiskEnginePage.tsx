import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Activity,
  Sliders,
  Scale,
  CheckCircle2,
  HelpCircle,
  FileCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';
import { ExplanationCard } from '../components/ExplanationCard';
import { RiskBadge } from '../components/RiskBadge';

export const RiskEnginePage: React.FC = () => {
  const [behavior, setBehavior] = useState<number>(90);
  const [auth, setAuth] = useState<number>(85);
  const [endpoint, setEndpoint] = useState<number>(88);
  const [network, setNetwork] = useState<number>(80);
  const [honeypot, setHoneypot] = useState<number>(95);
  const [threatIntel, setThreatIntel] = useState<number>(70);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/api/risk/calculate', {
        behavior_anomaly: behavior,
        auth_anomaly: auth,
        endpoint_anomaly: endpoint,
        network_anomaly: network,
        honeypot_interaction: honeypot,
        threat_intel_match: threatIntel
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculate();
  }, [behavior, auth, endpoint, network, honeypot, threatIntel]);

  const loadNormalPreset = () => {
    setBehavior(10);
    setAuth(5);
    setEndpoint(12);
    setNetwork(8);
    setHoneypot(0);
    setThreatIntel(0);
  };

  const loadCriticalBreachPreset = () => {
    setBehavior(92);
    setAuth(88);
    setEndpoint(90);
    setNetwork(85);
    setHoneypot(98);
    setThreatIntel(75);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-cyber-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-slate-100">
              MULTI-SIGNAL RISK & CONFIDENCE ENGINE
            </h1>
            <span className="px-2.5 py-0.5 rounded-full border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 text-[10px] font-mono">
              WEIGHTED CORRELATOR
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Dynamic heuristic normalization: separates raw attack probability (Risk) from multi-sensor certainty (Confidence).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadNormalPreset}
            className="px-3 py-1.5 rounded-lg border border-cyber-800 bg-cyber-900 hover:border-emerald-500/40 text-xs font-mono text-emerald-300 transition-colors"
          >
            Baseline Normal
          </button>
          <button
            onClick={loadCriticalBreachPreset}
            className="px-3 py-1.5 rounded-lg border border-rose-900/40 bg-rose-950/20 hover:border-rose-500/40 text-xs font-mono text-rose-300 transition-colors"
          >
            Critical Breach Vector
          </button>
        </div>
      </div>

      {/* Grid: 6 Signal Sliders vs Real-Time Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Signal Weight Tuner */}
        <div className="lg:col-span-6 p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-cyber-800 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100">Correlated Input Signals & Weights</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Sum of Weights: 100%</span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Behavior */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Behavior Anomaly (Weight: 20%):</span>
                <strong className="text-cyan-400 font-bold">{behavior}/100</strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={behavior}
                onChange={(e) => setBehavior(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Auth */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Authentication Anomaly (Weight: 15%):</span>
                <strong className="text-cyan-400 font-bold">{auth}/100</strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={auth}
                onChange={(e) => setAuth(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Endpoint EDR */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Endpoint / Process Anomaly (Weight: 20%):</span>
                <strong className="text-cyan-400 font-bold">{endpoint}/100</strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={endpoint}
                onChange={(e) => setEndpoint(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Network */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Network Traffic Anomaly (Weight: 15%):</span>
                <strong className="text-cyan-400 font-bold">{network}/100</strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={network}
                onChange={(e) => setNetwork(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Honeypot Tripwire */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="text-purple-300 font-bold">Digital Labyrinth Decoy Hit (Weight: 25%):</span>
                <strong className="text-purple-400 font-bold">{honeypot}/100</strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={honeypot}
                onChange={(e) => setHoneypot(parseInt(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Threat Intel */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Threat Intel Indicator Match (Weight: 5%):</span>
                <strong className="text-cyan-400 font-bold">{threatIntel}/100</strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={threatIntel}
                onChange={(e) => setThreatIntel(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Live Output & Evidence Matrix */}
        <div className="lg:col-span-6 space-y-6">
          {result && (
            <>
              {/* Score Display Card */}
              <div className="p-6 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4">
                  COMPOSITE RISK & CERTAINTY EVALUATION
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  {/* Risk */}
                  <div className="p-4 rounded-xl border border-cyber-800 bg-cyber-850/60">
                    <div className="text-xs font-mono text-slate-400 mb-1">TOTAL RISK SCORE</div>
                    <div className={`text-4xl font-extrabold font-mono ${
                      result.risk_score >= 80 ? 'text-rose-400 cyber-glow-rose' :
                      result.risk_score >= 60 ? 'text-orange-400' :
                      result.risk_score >= 30 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {result.risk_score}
                      <span className="text-base text-slate-500 font-normal">/100</span>
                    </div>
                    <div className="mt-2">
                      <RiskBadge score={result.risk_score} showScore={false} />
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="p-4 rounded-xl border border-cyber-800 bg-cyber-850/60">
                    <div className="text-xs font-mono text-slate-400 mb-1">STATISTICAL CONFIDENCE</div>
                    <div className="text-4xl font-extrabold font-mono text-cyan-400 cyber-glow-cyan">
                      {result.confidence_score}
                      <span className="text-base text-slate-500 font-normal">%</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-400 font-mono">
                      Correlated Multi-Sensor
                    </div>
                  </div>
                </div>

                {/* Weights Contribution Breakdown */}
                <div className="mt-6 pt-4 border-t border-cyber-800">
                  <div className="text-xs font-mono font-bold text-slate-300 mb-2">
                    SIGNAL CONTRIBUTION BREAKDOWN:
                  </div>
                  <div className="space-y-1.5 text-[11px] font-mono">
                    {Object.entries(result.signal_contributions).map(([sig, val]: any) => (
                      <div key={sig} className="flex justify-between text-slate-400">
                        <span>{sig.replace('_', ' ')}:</span>
                        <strong className="text-slate-200">+{val} pts</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Explainable Decision */}
              <ExplanationCard
                whatHappened="Real-time multi-vector sensor fusion analysis."
                whySuspicious={result.explanation}
                evidence={result.evidence_list.length > 0 ? result.evidence_list : ["All signals within baseline tolerances."]}
                riskScore={result.risk_score}
                confidenceScore={result.confidence_score}
                action={result.recommended_action}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
