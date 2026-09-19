import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Server,
  ArrowLeft,
  Shield,
  Activity,
  Lock,
  RefreshCw,
  Cpu,
  RotateCcw,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import api from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { RiskBadge } from '../components/RiskBadge';
import { useToast } from '../context/ToastContext';

export const EndpointDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/api/endpoints/${id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleStateChange = async (newStatus: string) => {
    setActionLoading(true);
    try {
      await api.patch(`/api/endpoints/${id}/state?status=${newStatus}`);
      addToast('Endpoint State Updated', `Host transitioned to ${newStatus}.`, 'info');
      fetchDetail();
    } catch (err) {
      addToast('Error', 'Failed to update endpoint state.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartRecovery = async () => {
    setActionLoading(true);
    try {
      await api.post('/api/recovery/start', {
        endpoint_id: parseInt(id!),
        snapshot_id: "Snapshot-2026-09-18-0900"
      });
      addToast('Recovery Initiated', 'Clean golden snapshot restoration and verification triggered.', 'success');
      fetchDetail();
    } catch (err) {
      addToast('Error', 'Failed to initiate recovery.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="text-xs font-mono text-slate-400">CONNECTING TO VIRTUAL HOST DAEMON...</span>
      </div>
    );
  }

  const { endpoint, behavior_profile, events, incidents, recovery_jobs } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/endpoints')}
          className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Fleet Inventory</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-cyber-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold text-slate-100">{endpoint.hostname}</span>
              <StatusBadge status={endpoint.status} />
              <RiskBadge score={endpoint.risk_score} />
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Synthetic IP: <span className="text-cyan-400">{endpoint.synthetic_ip}</span> • OS: {endpoint.os_name}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {endpoint.status !== 'QUARANTINED' && (
              <button
                onClick={() => handleStateChange('QUARANTINED')}
                disabled={actionLoading}
                className="px-3 py-1.5 rounded-lg border border-rose-600/50 bg-rose-950/40 hover:bg-rose-950/70 text-xs font-mono text-rose-300 transition-all flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Simulate Quarantine</span>
              </button>
            )}

            <button
              onClick={handleStartRecovery}
              disabled={actionLoading}
              className="px-3 py-1.5 rounded-lg border border-emerald-600/50 bg-emerald-950/40 hover:bg-emerald-950/70 text-xs font-mono text-emerald-300 transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restore from Snapshot</span>
            </button>

            {endpoint.status !== 'ONLINE' && (
              <button
                onClick={() => handleStateChange('ONLINE')}
                disabled={actionLoading}
                className="px-3 py-1.5 rounded-lg border border-cyber-800 bg-cyber-900 hover:border-slate-600 text-xs font-mono text-slate-300 transition-all"
              >
                Reset to Online
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-4 rounded-xl border border-cyber-800 bg-cyber-900/80">
          <div className="text-slate-400 text-[10px] mb-1">GOLDEN TRUSTED SNAPSHOT</div>
          <div className="text-cyan-300 font-bold">{endpoint.trusted_snapshot}</div>
          <div className="text-slate-500 mt-1">Cryptographic integrity certified</div>
        </div>

        <div className="p-4 rounded-xl border border-cyber-800 bg-cyber-900/80">
          <div className="text-slate-400 text-[10px] mb-1">BEHAVIORAL BASELINE LOGIN</div>
          <div className="text-slate-200 font-bold">{behavior_profile?.baseline_login_hour?.toFixed(1)}:00 AM</div>
          <div className="text-slate-400 mt-1">Mean session duration: {behavior_profile?.session_duration_mean} hrs</div>
        </div>

        <div className="p-4 rounded-xl border border-cyber-800 bg-cyber-900/80">
          <div className="text-slate-400 text-[10px] mb-1">CONTAINMENT POSTURE</div>
          <div className="text-slate-200 font-bold">
            {endpoint.status === 'QUARANTINED' ? 'vLAN Interface Isolated' : 'Normal Network Connected'}
          </div>
          <div className="text-slate-500 mt-1">Last seen: {new Date(endpoint.last_seen).toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Simulated Active Process Tree */}
      <div className="p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80">
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">Simulated Host Processes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cyber-800 text-slate-400 uppercase text-[10px]">
                <th className="pb-2">PID</th>
                <th className="pb-2">Executable Name</th>
                <th className="pb-2">Process Status</th>
                <th className="pb-2 text-right">CPU / Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-800/60">
              {(endpoint.processes || []).map((p: any, idx: number) => (
                <tr key={idx} className="hover:bg-cyber-850/50">
                  <td className="py-2 text-cyan-400">{p.pid}</td>
                  <td className="py-2 text-slate-200 font-semibold">{p.name}</td>
                  <td className="py-2">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-2 text-right text-slate-400">
                    {p.cpu ? `${p.cpu}%` : 'Normal'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic History */}
      <div className="p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80">
        <h3 className="text-sm font-bold text-slate-100 mb-3">Host Security Event History</h3>
        <div className="space-y-2 text-xs font-mono">
          {events.map((ev: any) => (
            <div key={ev.id} className="p-3 rounded-lg border border-cyber-800 bg-cyber-850/50 flex items-center justify-between">
              <div>
                <span className="text-cyan-400 font-semibold">{ev.event_type}</span>
                <span className="text-slate-500 mx-2">•</span>
                <span className="text-slate-300">{ev.source} → {ev.target}</span>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={ev.severity} />
                <span className="text-slate-500 text-[10px]">{new Date(ev.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
