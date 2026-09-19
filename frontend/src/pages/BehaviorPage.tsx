import React, { useState, useEffect } from 'react';
import {
  Activity,
  UserCheck,
  AlertCircle,
  Play,
  RotateCcw,
  Shield,
  Sliders,
  Sparkles,
  Laptop,
  Clock,
  Files,
  Lock
} from 'lucide-react';
import api from '../services/api';
import { ExplanationCard } from '../components/ExplanationCard';
import { RiskBadge } from '../components/RiskBadge';
import { useToast } from '../context/ToastContext';

export const BehaviorPage: React.FC = () => {
  const { addToast } = useToast();

  // Form State
  const [loginHour, setLoginHour] = useState<number>(3.23); // 03:14 AM
  const [sessionDuration, setSessionDuration] = useState<number>(1.5);
  const [filesAccessed, setFilesAccessed] = useState<number>(350);
  const [failedLogins, setFailedLogins] = useState<number>(7);
  const [newDevice, setNewDevice] = useState<boolean>(true);
  const [resourceAccessRate, setResourceAccessRate] = useState<number>(4.2);
  const [typingDeviation, setTypingDeviation] = useState<number>(0.75);
  const [mouseDeviation, setMouseDeviation] = useState<number>(0.70);
  const [honeypotHit, setHoneypotHit] = useState<boolean>(false);

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await api.post('/api/behavior/analyze', {
        endpoint_id: 3,
        login_hour: Number(loginHour),
        session_duration: Number(sessionDuration),
        files_accessed: Number(filesAccessed),
        failed_logins: Number(failedLogins),
        new_device: Boolean(newDevice),
        resource_access_rate: Number(resourceAccessRate),
        typing_deviation: Number(typingDeviation),
        mouse_deviation: Number(mouseDeviation),
        network_activity: filesAccessed > 100 ? 120.0 : 15.0,
        honeypot_interaction: Boolean(honeypotHit)
      });
      setResult(res.data);
      if (res.data.anomaly_detected) {
        addToast(
          'Ghost Pattern: Anomaly Intercepted',
          `Risk score evaluated at ${res.data.risk_score}/100. Action: ${res.data.recommended_action}`,
          'threat'
        );
      } else {
        addToast('Ghost Pattern Analysis', 'Session behavior matches established normal profile.', 'success');
      }
    } catch (err) {
      addToast('Analysis Error', 'Failed to execute ML anomaly detector.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    handleAnalyze();
  }, []);

  const loadNormalPreset = () => {
    setLoginHour(9.0);
    setSessionDuration(7.5);
    setFilesAccessed(22);
    setFailedLogins(0);
    setNewDevice(false);
    setResourceAccessRate(1.1);
    setTypingDeviation(0.12);
    setMouseDeviation(0.14);
    setHoneypotHit(false);
  };

  const loadAnomalousPreset = () => {
    setLoginHour(3.23); // 03:14 AM
    setSessionDuration(1.2);
    setFilesAccessed(350);
    setFailedLogins(7);
    setNewDevice(true);
    setResourceAccessRate(4.5);
    setTypingDeviation(0.85);
    setMouseDeviation(0.82);
    setHoneypotHit(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-cyber-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-slate-100">
              GHOST PATTERN — BEHAVIORAL ANOMALY DETECTION
            </h1>
            <span className="px-2.5 py-0.5 rounded-full border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 text-[10px] font-mono">
              LOCAL ISOLATION FOREST
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Zero-knowledge user telemetry profiling, biometric variance heuristics & automated containment triggers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadNormalPreset}
            className="px-3 py-1.5 rounded-lg border border-cyber-800 bg-cyber-900 hover:border-emerald-500/40 text-xs font-mono text-emerald-300 transition-colors"
          >
            Normal Profile Preset
          </button>
          <button
            onClick={loadAnomalousPreset}
            className="px-3 py-1.5 rounded-lg border border-rose-900/40 bg-rose-950/20 hover:border-rose-500/40 text-xs font-mono text-rose-300 transition-colors"
          >
            Anomalous Attack Preset
          </button>
        </div>
      </div>

      {/* Main Grid: Telemetry Simulator Inputs & Baseline Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-cyber-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100">Live Session Telemetry Signals</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Endpoint-03 Synthetic Profile</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            {/* Login Hour */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Login Hour (24h):</span>
                <strong className="text-cyan-400 font-bold">
                  {Math.floor(loginHour)}:{(Math.round((loginHour % 1) * 60)).toString().padStart(2, '0')} hrs
                </strong>
              </div>
              <input
                type="range"
                min="0"
                max="23.9"
                step="0.25"
                value={loginHour}
                onChange={(e) => setLoginHour(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>00:00 (Night)</span>
                <span>09:00 (Baseline)</span>
                <span>23:59</span>
              </div>
            </div>

            {/* Files Accessed */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Files Accessed (Count):</span>
                <strong className={filesAccessed > 100 ? 'text-rose-400 font-bold' : 'text-cyan-400'}>
                  {filesAccessed} files
                </strong>
              </div>
              <input
                type="range"
                min="1"
                max="500"
                value={filesAccessed}
                onChange={(e) => setFilesAccessed(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1 (Routine)</span>
                <span>25 (Baseline Mean)</span>
                <span>500 (Mass Exfil)</span>
              </div>
            </div>

            {/* Failed Logins */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Failed Logins Preceding Session:</span>
                <strong className={failedLogins >= 3 ? 'text-rose-400 font-bold' : 'text-cyan-400'}>
                  {failedLogins} attempts
                </strong>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={failedLogins}
                onChange={(e) => setFailedLogins(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Typing Deviation */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Keystroke Dynamics Deviation:</span>
                <strong className={typingDeviation > 0.5 ? 'text-amber-400 font-bold' : 'text-cyan-400'}>
                  {(typingDeviation * 100).toFixed(0)}%
                </strong>
              </div>
              <input
                type="range"
                min="0.05"
                max="1.0"
                step="0.05"
                value={typingDeviation}
                onChange={(e) => setTypingDeviation(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Boolean Toggles */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <label className="p-2.5 rounded-lg border border-cyber-800 bg-cyber-850/60 flex items-center justify-between cursor-pointer hover:border-cyber-700">
                <span className="text-[11px] text-slate-300">Unrecognized Device?</span>
                <input
                  type="checkbox"
                  checked={newDevice}
                  onChange={(e) => setNewDevice(e.target.checked)}
                  className="rounded border-cyber-800 text-cyan-500 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="p-2.5 rounded-lg border border-cyber-800 bg-cyber-850/60 flex items-center justify-between cursor-pointer hover:border-cyber-700">
                <span className="text-[11px] text-slate-300">Honeypot Tripwire Hit?</span>
                <input
                  type="checkbox"
                  checked={honeypotHit}
                  onChange={(e) => setHoneypotHit(e.target.checked)}
                  className="rounded border-cyber-800 text-rose-500 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            {/* Run Button */}
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full mt-4 py-3 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center justify-center gap-2 cyber-glow-cyan font-mono disabled:opacity-50"
            >
              {analyzing ? (
                <span>RUNNING ISOLATION FOREST...</span>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>EVALUATE BEHAVIORAL DEVIATION</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results & Baseline Comparison Column */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <>
              {/* Baseline vs Current Matrix Card */}
              <div className="p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4 border-b border-cyber-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Baseline vs Current Session Comparison</h3>
                    <p className="text-xs text-slate-400 font-mono">Calculated Z-Scores & Deviation Vectors</p>
                  </div>
                  <RiskBadge score={result.risk_score} />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-cyber-800 text-slate-400 uppercase text-[10px]">
                        <th className="pb-2">Telemetry Dimension</th>
                        <th className="pb-2">Historical Baseline</th>
                        <th className="pb-2">Current Session</th>
                        <th className="pb-2 text-right">Deviation Delta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyber-800/60">
                      <tr>
                        <td className="py-2 text-slate-300">Login Hour</td>
                        <td className="py-2 text-slate-400">09:00 AM</td>
                        <td className="py-2 font-bold text-cyan-300">
                          {Math.floor(loginHour)}:{(Math.round((loginHour % 1) * 60)).toString().padStart(2, '0')} AM
                        </td>
                        <td className="py-2 text-right text-amber-400">
                          {result.deviations?.login_hour}%
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-slate-300">Files Enumerated</td>
                        <td className="py-2 text-slate-400">22.0 files/day</td>
                        <td className="py-2 font-bold text-rose-300">{filesAccessed} files</td>
                        <td className="py-2 text-right text-rose-400">
                          {result.deviations?.files_accessed}%
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-slate-300">Hardware Profile</td>
                        <td className="py-2 text-slate-400">Registered Laptop</td>
                        <td className="py-2 font-bold text-amber-300">
                          {newDevice ? "New Device (Novel)" : "Authorized Workstation"}
                        </td>
                        <td className="py-2 text-right text-slate-400">
                          {newDevice ? "+100%" : "0%"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-slate-300">Failed Logins</td>
                        <td className="py-2 text-slate-400">0.1 avg</td>
                        <td className="py-2 font-bold text-cyan-300">{failedLogins} failures</td>
                        <td className="py-2 text-right text-amber-400">
                          {result.deviations?.failed_logins}%
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-slate-300">Biometric Typing Deviation</td>
                        <td className="py-2 text-slate-400">0.12 baseline</td>
                        <td className="py-2 font-bold text-purple-300">{typingDeviation}</td>
                        <td className="py-2 text-right text-purple-400">
                          {result.deviations?.typing_deviation}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Explainable AI Decision Card */}
              <ExplanationCard
                whatHappened={`Session initiated by user identity with parameters deviating from standard baseline.`}
                whySuspicious={result.explanation}
                evidence={[
                  `Isolation Forest raw anomaly score: ${result.anomaly_score} (Threshold: 0.55)`,
                  `Mass file touch volume: ${filesAccessed} files (Historical envelope: ~22)`,
                  `Hardware footprint status: ${newDevice ? 'Unrecognized synthetic endpoint signature' : 'Whitelisted'}`,
                  `Digital Labyrinth tripwire: ${honeypotHit ? 'POSITIVE TRIGGER (Immediate Critical Trap)' : 'Clean'}`
                ]}
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
