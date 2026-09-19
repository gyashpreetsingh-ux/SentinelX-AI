import React, { useState, useEffect } from 'react';
import {
  Mail,
  ShieldAlert,
  Search,
  CheckCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';
import { RiskBadge } from '../components/RiskBadge';
import { StatusBadge } from '../components/StatusBadge';
import { useToast } from '../context/ToastContext';

export const PhishingPage: React.FC = () => {
  const [samples, setSamples] = useState<any[]>([]);
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { addToast } = useToast();

  useEffect(() => {
    const loadSamples = async () => {
      try {
        const res = await api.get('/api/phishing/samples');
        setSamples(res.data);
        if (res.data.length > 0) {
          selectSample(res.data[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadSamples();
  }, []);

  const selectSample = (sample: any) => {
    setSender(sample.sender);
    setSubject(sample.subject);
    setBody(sample.body);
  };

  const handleAnalyze = async () => {
    if (!body) return;
    setAnalyzing(true);
    try {
      const res = await api.post('/api/phishing/analyze', { sender, subject, body });
      setResult(res.data);
      if (res.data.classification === 'HIGH_RISK') {
        addToast('Scam-Bait: Phishing Lure Flagged', `High-risk lure detected (${res.data.risk_score}/100). Quarantined.`, 'threat');
      } else {
        addToast('Scam-Bait Analysis Complete', `Message classified as ${res.data.classification}.`, 'info');
      }
    } catch (err) {
      addToast('Error', 'Failed to analyze message content.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-cyber-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-slate-100">
              SCAM-BAIT — PHISHING & SOCIAL ENGINEERING ANALYZER
            </h1>
            <span className="px-2.5 py-0.5 rounded-full border border-pink-500/40 bg-pink-950/60 text-pink-300 text-[10px] font-mono">
              HEURISTIC INTEL
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Zero-contact psychological coercion parsing, deceptive URL structure extraction & credential theft interception.
          </p>
        </div>
      </div>

      {/* Preset Sample Selector */}
      <div className="p-4 rounded-xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md">
        <div className="text-xs font-mono text-slate-400 mb-2">QUICK DEMO TEST CASES (CLICK TO LOAD):</div>
        <div className="flex flex-wrap gap-2">
          {samples.map((s) => (
            <button
              key={s.id}
              onClick={() => selectSample(s)}
              className="px-3 py-1.5 rounded-lg border border-cyber-800 bg-cyber-950 hover:border-pink-500/40 text-xs font-mono text-slate-300 transition-colors"
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input Form vs Forensics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-6 p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-cyber-800 pb-3">
            Message Ingestion Workbench
          </h3>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">SENDER ADDRESS:</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-cyber-800 bg-cyber-950 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">SUBJECT LINE:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-cyber-800 bg-cyber-950 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">RAW BODY CONTENT:</label>
              <textarea
                rows={7}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-cyber-800 bg-cyber-950 text-slate-100 focus:border-cyan-500 focus:outline-none leading-relaxed"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white transition-all flex items-center justify-center gap-2 cyber-glow-rose disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{analyzing ? 'PARSING HEURISTICS...' : 'ANALYZE MESSAGE THREAT PROFILE'}</span>
            </button>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 space-y-6">
          {result && (
            <>
              {/* Verdict Card */}
              <div className="p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4 border-b border-cyber-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Analysis Verdict</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{result.synthetic_threat_signature}</p>
                  </div>
                  <RiskBadge score={result.risk_score} />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center text-xs font-mono">
                  <div className="p-3 rounded-xl border border-cyber-800 bg-cyber-850/60">
                    <div className="text-slate-400 mb-1">CLASSIFICATION</div>
                    <div className={`text-base font-bold ${
                      result.classification === 'HIGH_RISK' ? 'text-rose-400' :
                      result.classification === 'SUSPICIOUS' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {result.classification}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-cyber-800 bg-cyber-850/60">
                    <div className="text-slate-400 mb-1">CONFIDENCE</div>
                    <div className="text-base font-bold text-cyan-400">
                      {result.confidence_score}%
                    </div>
                  </div>
                </div>

                {/* Indicators Found */}
                <div className="mt-4 pt-3 border-t border-cyber-800">
                  <div className="text-xs font-mono font-bold text-slate-300 mb-2">
                    IDENTIFIED THREAT VECTORS:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.indicators_found.map((ind: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-rose-950/40 border border-rose-500/40 text-rose-300 text-[10px] font-mono"
                      >
                        {ind}
                      </span>
                    ))}
                    {result.indicators_found.length === 0 && (
                      <span className="text-emerald-400 text-xs font-mono">No threat vectors identified.</span>
                    )}
                  </div>
                </div>

                {/* Reasons List */}
                <div className="mt-4 pt-3 border-t border-cyber-800">
                  <div className="text-xs font-mono font-bold text-slate-300 mb-2">
                    HEURISTIC ATTRIBUTION REASONS:
                  </div>
                  <ul className="space-y-1 text-xs font-mono text-slate-300">
                    {result.reasons.map((r: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-400">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
