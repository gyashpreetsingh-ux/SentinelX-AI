import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertOctagon,
  ArrowLeft,
  Server,
  Lock,
  RefreshCw,
  CheckCircle,
  Clock,
  Shield,
  FileText
} from 'lucide-react';
import api from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { RiskBadge } from '../components/RiskBadge';
import { useToast } from '../context/ToastContext';

export const IncidentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/api/incidents/${id}`);
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

  const handleUpdateStatus = async (newStatus: string) => {
    setActionLoading(true);
    try {
      await api.patch(`/api/incidents/${id}/status`, {
        status: newStatus,
        action_taken: newStatus === 'CONTAINED' ? 'MANUAL_QUARANTINE' : 'OPERATOR_TRIAGED'
      });
      addToast('Incident Updated', `Status updated to ${newStatus}.`, 'success');
      fetchDetail();
    } catch (err) {
      addToast('Error', 'Failed to update incident status.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartRecovery = async () => {
    if (!data?.incident?.endpoint_id) return;
    setActionLoading(true);
    try {
      await api.post('/api/recovery/start', {
        endpoint_id: data.incident.endpoint_id,
        incident_id: data.incident.id,
        snapshot_id: "Snapshot-2026-09-18-0900"
      });
      addToast('Recovery Triggered', 'Autonomous snapshot rollback and integrity verification started.', 'success');
      fetchDetail();
    } catch (err) {
      addToast('Error', 'Failed to trigger recovery.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="text-xs font-mono text-slate-400">LOADING FORENSIC TIMELINE...</span>
      </div>
    );
  }

  const { incident, related_events, recovery_jobs } = data;

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div>
        <button
          onClick={() => navigate('/incidents')}
          className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Incidents</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-cyber-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-mono font-bold text-cyan-400">{incident.incident_code}</span>
              <StatusBadge status={incident.status} />
              <RiskBadge score={incident.risk_score} />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-100 mt-1">{incident.title}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {incident.status !== 'CONTAINED' && incident.status !== 'RESOLVED' && (
              <button
                onClick={() => handleUpdateStatus('CONTAINED')}
                disabled={actionLoading}
                className="px-3 py-1.5 rounded-lg border border-rose-600/50 bg-rose-950/40 hover:bg-rose-950/70 text-xs font-mono text-rose-300 transition-all flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Contain Threat</span>
              </button>
            )}

            {incident.status !== 'RESOLVED' && (
              <button
                onClick={handleStartRecovery}
                disabled={actionLoading}
                className="px-3 py-1.5 rounded-lg border border-emerald-600/50 bg-emerald-950/40 hover:bg-emerald-950/70 text-xs font-mono text-emerald-300 transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Rollback & Recover</span>
              </button>
            )}

            <button
              onClick={() => handleUpdateStatus('RESOLVED')}
              disabled={actionLoading}
              className="px-3 py-1.5 rounded-lg border border-cyber-800 bg-cyber-900 hover:border-slate-600 text-xs font-mono text-slate-300 transition-all"
            >
              Mark Resolved
            </button>
          </div>
        </div>
      </div>

      {/* Forensic Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-4 rounded-xl border border-cyber-800 bg-cyber-900/80">
          <div className="text-slate-400 text-[10px] mb-1">TARGET VIRTUAL ASSET</div>
          <div className="text-slate-100 font-bold text-sm">{incident.endpoint_hostname}</div>
          <div className="text-slate-400 mt-1">{incident.synthetic_ip}</div>
          <div className="mt-2">
            Status: <StatusBadge status={incident.endpoint_status} />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-cyber-800 bg-cyber-900/80">
          <div className="text-slate-400 text-[10px] mb-1">DETECTION METHOD & ACTION</div>
          <div className="text-cyan-300 font-bold">{incident.detection_method}</div>
          <div className="text-slate-400 mt-1">Recommended: {incident.recommended_action}</div>
          <div className="text-emerald-400 mt-1">Enforced: {incident.action_taken}</div>
        </div>

        <div className="p-4 rounded-xl border border-cyber-800 bg-cyber-900/80">
          <div className="text-slate-400 text-[10px] mb-1">CONFIDENCE & RECOVERY POSTURE</div>
          <div className="text-slate-100 font-bold">{incident.confidence_score}% Statistical Confidence</div>
          <div className="text-slate-400 mt-1">Recovery: {incident.recovery_status}</div>
          <div className="text-slate-500 mt-1">Created: {new Date(incident.created_at).toLocaleString()}</div>
        </div>
      </div>

      {/* Evidence Lockbox */}
      <div className="p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">Preserved Digital Evidence</h3>
        </div>
        <ul className="space-y-1.5 text-xs font-mono">
          {(incident.evidence_json || []).map((ev: string, idx: number) => (
            <li key={idx} className="p-2.5 rounded-lg border border-cyber-800 bg-cyber-850/60 text-slate-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>{ev}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Correlated Event Stream */}
      <div className="p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80">
        <h3 className="text-sm font-bold text-slate-100 mb-3">Correlated Security Event Telemetry</h3>
        <div className="space-y-2 text-xs font-mono">
          {related_events.map((ev: any) => (
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

      {/* Recovery History */}
      {recovery_jobs.length > 0 && (
        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10">
          <h3 className="text-sm font-bold text-emerald-300 mb-3">Associated Recovery & Rollback Jobs</h3>
          {recovery_jobs.map((job: any) => (
            <div key={job.id} className="p-4 rounded-xl border border-cyber-800 bg-cyber-900/80 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span>Restored from: <strong>{job.snapshot_id}</strong></span>
                <StatusBadge status={job.status} />
              </div>
              <div className="w-full bg-cyber-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full" style={{ width: `${job.progress_percent}%` }} />
              </div>
              <div className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-cyber-800">
                {(job.logs || []).map((log: string, lIdx: number) => (
                  <div key={lIdx}>{log}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
