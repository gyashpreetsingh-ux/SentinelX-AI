import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Lock,
  Shield,
  CheckCircle2,
  HardDrive,
  FileText,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  Server
} from 'lucide-react';
import api from '../services/api';
import { Endpoint, RecoveryJob } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { RiskBadge } from '../components/RiskBadge';
import { useToast } from '../context/ToastContext';

export const ResponsePage: React.FC = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [selectedEndpointId, setSelectedEndpointId] = useState<number>(3); // Endpoint-03
  const [selectedSnapshot, setSelectedSnapshot] = useState('Snapshot-2026-09-18-0900');
  const [recoveryJobs, setRecoveryJobs] = useState<RecoveryJob[]>([]);
  const [operating, setOperating] = useState(false);

  const { addToast } = useToast();

  const fetchFleet = async () => {
    try {
      const [eRes, rRes] = await Promise.all([
        api.get('/api/endpoints'),
        api.get('/api/recovery/jobs')
      ]);
      setEndpoints(eRes.data);
      setRecoveryJobs(rRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFleet();
    const interval = setInterval(fetchFleet, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleQuarantine = async (id: number) => {
    setOperating(true);
    try {
      await api.post(`/api/response/quarantine?endpoint_id=${id}&reason=Manual%20SOC%20command`);
      addToast('Containment Imposed', `Host isolated and virtual network adapter severed.`, 'threat');
      fetchFleet();
    } catch (err) {
      addToast('Error', 'Quarantine operation failed.', 'error');
    } finally {
      setOperating(false);
    }
  };

  const handleRestrict = async (id: number) => {
    setOperating(true);
    try {
      await api.post(`/api/response/restrict?endpoint_id=${id}&reason=Operator%20step-up`);
      addToast('Session Restricted', 'Step-up verification prompt enforced on host.', 'warning');
      fetchFleet();
    } catch (err) {
      addToast('Error', 'Restriction operation failed.', 'error');
    } finally {
      setOperating(false);
    }
  };

  const handleStartRecovery = async (id: number) => {
    setOperating(true);
    try {
      const res = await api.post('/api/recovery/start', {
        endpoint_id: id,
        snapshot_id: selectedSnapshot
      });
      addToast(
        'Recovery Completed & Verified',
        `Restored from ${selectedSnapshot} with certified SHA-256 clean integrity.`,
        'success'
      );
      fetchFleet();
    } catch (err) {
      addToast('Error', 'Recovery operation failed.', 'error');
    } finally {
      setOperating(false);
    }
  };

  const currentEndpoint = endpoints.find((e) => e.id === selectedEndpointId) || endpoints[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-cyber-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-slate-100">
              SELF-HEAL — AUTONOMOUS CONTAINMENT & RECOVERY
            </h1>
            <span className="px-2.5 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 text-[10px] font-mono">
              CLOSED-LOOP RESILIENCE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Zero-risk virtual containment, digital forensic preservation & verified golden snapshot rollbacks.
          </p>
        </div>
      </div>

      {/* Autonomous Workflow Progression Bar */}
      <div className="p-4 rounded-xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md">
        <div className="text-[10px] font-mono text-slate-400 uppercase mb-3">
          STANDARDIZED SELF-HEALING LIFECYCLE:
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded border border-cyan-500/40 bg-cyan-950/40 text-cyan-300">
            1. Threat Sensed
          </span>
          <span className="text-slate-600">→</span>
          <span className="px-2.5 py-1 rounded border border-cyan-500/40 bg-cyan-950/40 text-cyan-300">
            2. ML Scoring
          </span>
          <span className="text-slate-600">→</span>
          <span className="px-2.5 py-1 rounded border border-rose-500/40 bg-rose-950/40 text-rose-300">
            3. Policy Quarantine
          </span>
          <span className="text-slate-600">→</span>
          <span className="px-2.5 py-1 rounded border border-purple-500/40 bg-purple-950/40 text-purple-300">
            4. Evidence Locked
          </span>
          <span className="text-slate-600">→</span>
          <span className="px-2.5 py-1 rounded border border-amber-500/40 bg-amber-950/40 text-amber-300">
            5. Snapshot Rollback
          </span>
          <span className="text-slate-600">→</span>
          <span className="px-2.5 py-1 rounded border border-emerald-500/40 bg-emerald-950/40 text-emerald-300">
            6. Integrity Certified
          </span>
        </div>
      </div>

      {/* Main Grid: Host Actions & Snapshot Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Fleet Status & Containment Controls */}
        <div className="lg:col-span-5 p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-cyber-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100">Select Target Endpoint</h3>
            <span className="text-xs font-mono text-slate-400">Virtual Fleet</span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {endpoints.map((ep) => (
              <div
                key={ep.id}
                onClick={() => setSelectedEndpointId(ep.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs font-mono ${
                  selectedEndpointId === ep.id
                    ? 'border-cyan-500/60 bg-cyan-950/30'
                    : 'border-cyber-800 bg-cyber-850/60 hover:border-cyber-700'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-200">{ep.hostname}</div>
                  <div className="text-[10px] text-slate-400">{ep.synthetic_ip}</div>
                </div>
                <div className="flex items-center gap-2">
                  <RiskBadge score={ep.risk_score} />
                  <StatusBadge status={ep.status} />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Action Commands for Selected Host */}
          {currentEndpoint && (
            <div className="pt-4 border-t border-cyber-800 space-y-3">
              <div className="text-xs font-mono text-slate-300 font-bold">
                OPERATIONAL COMMANDS FOR {currentEndpoint.hostname}:
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuarantine(currentEndpoint.id)}
                  disabled={operating || currentEndpoint.status === 'QUARANTINED'}
                  className="p-2.5 rounded-xl border border-rose-600/50 bg-rose-950/40 hover:bg-rose-950/70 text-xs font-mono font-bold text-rose-300 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Quarantine Host</span>
                </button>

                <button
                  onClick={() => handleRestrict(currentEndpoint.id)}
                  disabled={operating}
                  className="p-2.5 rounded-xl border border-amber-600/50 bg-amber-950/40 hover:bg-amber-950/70 text-xs font-mono font-bold text-amber-300 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Restrict Session</span>
                </button>
              </div>

              <button
                onClick={() => handleStartRecovery(currentEndpoint.id)}
                disabled={operating}
                className="w-full py-3 rounded-xl border border-emerald-500/60 bg-emerald-950/50 hover:bg-emerald-900/60 text-xs font-mono font-bold text-emerald-300 transition-all flex items-center justify-center gap-2 cyber-glow-emerald disabled:opacity-40"
              >
                <RefreshCw className={`w-4 h-4 ${operating ? 'animate-spin' : ''}`} />
                <span>ROLLBACK TO TRUSTED SNAPSHOT</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Snapshot Console & Live Recovery Jobs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Snapshot Selection Card */}
          <div className="p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 border-b border-cyber-800 pb-3">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100">Immutable Snapshot Registry</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl border border-cyan-500/40 bg-cyan-950/20">
                <div className="text-slate-400 text-[10px] mb-1">RECOMMENDED GOLDEN SNAPSHOT:</div>
                <div className="text-cyan-300 font-bold">Snapshot-2026-09-18-0900</div>
                <div className="text-[10px] text-slate-400 mt-1">Status: Certified Clean • SHA256 Match</div>
              </div>

              <div className="p-3 rounded-xl border border-cyber-800 bg-cyber-850/60">
                <div className="text-slate-400 text-[10px] mb-1">EVIDENCE VAULT RECORD:</div>
                <div className="text-purple-300 font-bold">SHA256-8F4B2C89E1...</div>
                <div className="text-[10px] text-slate-400 mt-1">Locked volatile forensic state</div>
              </div>
            </div>
          </div>

          {/* Recovery Jobs Stream */}
          <div className="p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-100">Recovery Audit History</h3>
              <span className="text-xs font-mono text-emerald-400">100% Automated</span>
            </div>

            <div className="space-y-3">
              {recoveryJobs.slice(0, 4).map((job) => (
                <div
                  key={job.id}
                  className="p-3.5 rounded-xl border border-cyber-800 bg-cyber-850/50 space-y-2 text-xs font-mono"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-cyan-300 font-bold">Host ID #{job.endpoint_id}</span>
                      <span className="text-slate-500 mx-2">•</span>
                      <span className="text-slate-400">{job.snapshot_id}</span>
                    </div>
                    <StatusBadge status={job.status} />
                  </div>

                  <div className="w-full bg-cyber-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${job.progress_percent}%` }} />
                  </div>

                  <div className="text-[11px] text-slate-400">
                    Latest Log: {(job.logs && job.logs[job.logs.length - 1]) || 'Recovery verified.'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
