import React, { useState, useEffect } from 'react';
import { Sliders, ShieldCheck, Edit3, Check, X, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { Policy } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const PoliciesPage: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [riskMin, setRiskMin] = useState<number>(85);
  const [confMin, setConfMin] = useState<number>(90);
  const [action, setAction] = useState<string>('QUARANTINE');
  const [saving, setSaving] = useState(false);

  const { role } = useAuth();
  const { addToast } = useToast();

  const fetchPolicies = async () => {
    try {
      const res = await api.get('/api/policies');
      setPolicies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const startEdit = (p: Policy) => {
    setEditingPolicy(p);
    setRiskMin(p.condition_risk_min);
    setConfMin(p.condition_confidence_min);
    setAction(p.action);
  };

  const handleSave = async () => {
    if (!editingPolicy) return;
    setSaving(true);
    try {
      await api.put(`/api/policies/${editingPolicy.id}`, {
        condition_risk_min: Number(riskMin),
        condition_confidence_min: Number(confMin),
        action: action
      });
      addToast('Policy Updated', `Rule '${editingPolicy.name}' saved and committed to audit trail.`, 'success');
      setEditingPolicy(null);
      fetchPolicies();
    } catch (err) {
      addToast('Error', 'Failed to update policy.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const isAdmin = role === 'ADMIN';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-cyber-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-slate-100">
              POLICY ENGINE & AUTONOMOUS ENFORCEMENT RULES
            </h1>
            <span className="px-2.5 py-0.5 rounded-full border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 text-[10px] font-mono">
              AUDITED RULES
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Deterministic defensive execution thresholds. Every modification commits an immutable audit record.
          </p>
        </div>
      </div>

      {!isAdmin && (
        <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-950/20 text-amber-300 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>You are logged in as {role}. Only ADMIN accounts have permission to tune policy thresholds.</span>
        </div>
      )}

      {/* Policies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policies.map((pol) => (
          <div
            key={pol.id}
            className="p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-extrabold text-sm text-slate-100">{pol.name}</h3>
                <span className="px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
                  {pol.action}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">{pol.description}</p>

              <div className="mt-4 p-3 rounded-xl border border-cyber-800 bg-cyber-850/60 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] block">MIN RISK THRESHOLD:</span>
                  <strong className="text-cyan-400 font-bold">{pol.condition_risk_min}/100</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">MIN CONFIDENCE:</span>
                  <strong className="text-cyan-400 font-bold">{pol.condition_confidence_min}%</strong>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-cyber-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 text-[10px]">Updated by: {pol.updated_by}</span>
              {isAdmin && (
                <button
                  onClick={() => startEdit(pol)}
                  className="px-3 py-1 rounded-lg border border-cyber-800 hover:border-cyan-500/40 text-cyan-400 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Configure</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingPolicy && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl border border-cyber-800 bg-cyber-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-cyber-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100">Configure Rule: {editingPolicy.name}</h3>
              <button onClick={() => setEditingPolicy(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Minimum Risk Condition:</span>
                  <strong className="text-cyan-400 font-bold">{riskMin}/100</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={riskMin}
                  onChange={(e) => setRiskMin(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Minimum Confidence Condition:</span>
                  <strong className="text-cyan-400 font-bold">{confMin}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={confMin}
                  onChange={(e) => setConfMin(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">DEFENSIVE ACTION:</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-cyber-800 bg-cyber-950 text-slate-200 focus:outline-none"
                >
                  <option value="QUARANTINE">QUARANTINE (Network Isolation)</option>
                  <option value="RESTRICT_SESSION">RESTRICT_SESSION (Limit Privileges)</option>
                  <option value="STEP_UP">STEP_UP (Prompt Biometric / MFA)</option>
                  <option value="ALLOW">ALLOW (Permit Traffic)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-cyber-800">
                <button
                  onClick={() => setEditingPolicy(null)}
                  className="px-4 py-2 rounded-lg border border-cyber-800 text-slate-300 hover:bg-cyber-800 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{saving ? 'SAVING...' : 'SAVE & COMMIT AUDIT'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
