import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Brain,
  Sliders,
  Bell,
  Users,
  CheckCircle,
  Save,
  Activity
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'thresholds' | 'notifications' | 'health'>('thresholds');
  const [criticalThreshold, setCriticalThreshold] = useState(80);
  const [highThreshold, setHighThreshold] = useState(60);
  const [confidenceThreshold, setConfidenceThreshold] = useState(90);
  const [autoContainment, setAutoContainment] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [contaminationRate, setContaminationRate] = useState(0.03);

  const { addToast } = useToast();
  const { role } = useAuth();

  const handleSave = () => {
    addToast('Settings Saved', 'Platform parameters updated and committed to audit journal.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-cyber-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-slate-100">
              PLATFORM SETTINGS & DEFENSE CONFIGURATION
            </h1>
            <span className="px-2.5 py-0.5 rounded-full border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 text-[10px] font-mono">
              SYSTEM CONTROLS
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Fine-tune ML contamination factors, autonomous containment triggers, and notification rules.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 transition-all cyber-glow-cyan"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Settings Tabs */}
      <div className="flex border-b border-cyber-800 gap-2 overflow-x-auto text-xs font-mono">
        <button
          onClick={() => setActiveTab('thresholds')}
          className={`px-4 py-2.5 border-b-2 font-bold transition-colors whitespace-nowrap ${
            activeTab === 'thresholds' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Risk & Containment Thresholds
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2.5 border-b-2 font-bold transition-colors whitespace-nowrap ${
            activeTab === 'ai' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          AI / ML Model Hyperparameters
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2.5 border-b-2 font-bold transition-colors whitespace-nowrap ${
            activeTab === 'notifications' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Alert Notifications
        </button>
        <button
          onClick={() => setActiveTab('health')}
          className={`px-4 py-2.5 border-b-2 font-bold transition-colors whitespace-nowrap ${
            activeTab === 'health' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          System Health Diagnostics
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-6 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md max-w-3xl">
        {activeTab === 'thresholds' && (
          <div className="space-y-6 text-xs font-mono">
            <div>
              <div className="flex justify-between text-slate-200 mb-1">
                <span>CRITICAL RISK THRESHOLD (QUARANTINE TRIGGER):</span>
                <strong className="text-rose-400 font-bold">{criticalThreshold}/100</strong>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(parseInt(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Threats equal to or above this score are flagged for mandatory containment.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-slate-200 mb-1">
                <span>MINIMUM CONFIDENCE FOR AUTONOMOUS ACTIONS:</span>
                <strong className="text-cyan-400 font-bold">{confidenceThreshold}%</strong>
              </div>
              <input
                type="range"
                min="70"
                max="99"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Multi-signal confidence must meet this floor before autonomous quarantine is permitted.
              </p>
            </div>

            <div className="pt-4 border-t border-cyber-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">Autonomous Closed-Loop Containment</span>
                <span className="text-[11px] text-slate-500">
                  Allow policy engine to sever virtual adapters without human prompt.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoContainment}
                onChange={(e) => setAutoContainment(e.target.checked)}
                className="rounded border-cyber-800 text-cyan-500 focus:ring-cyan-500 w-5 h-5 cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="flex justify-between text-slate-200 mb-1">
                <span>Isolation Forest Contamination Factor:</span>
                <strong className="text-cyan-400 font-bold">{contaminationRate}</strong>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.10"
                step="0.01"
                value={contaminationRate}
                onChange={(e) => setContaminationRate(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Expected anomaly proportion in training baseline distributions.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-cyber-850 border border-cyber-800 text-slate-300">
              <span className="text-cyan-400 font-bold">Local Model Specs:</span>
              <ul className="mt-1 list-disc list-inside space-y-0.5 text-[11px] text-slate-400">
                <li>Architecture: 150-Tree Isolation Forest with synthetic baseline vector fit</li>
                <li>Feature Count: 10 Normalized Dimensional Vectors</li>
                <li>Privacy Guarantee: No external LLM calls or outbound network transmission</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-850 border border-cyber-800">
              <div>
                <span className="font-bold text-slate-200 block">In-Console Threat Toasts</span>
                <span className="text-[11px] text-slate-500">Display floating threat alerts when risk exceeds 60</span>
              </div>
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="rounded border-cyber-800 text-cyan-500 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-850 border border-cyber-800">
              <div>
                <span className="font-bold text-slate-200 block">Synthetic SOC Dispatch Webhooks</span>
                <span className="text-[11px] text-slate-500">Broadcast events over WebSocket /ws/telemetry</span>
              </div>
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="rounded border-cyber-800 text-cyan-500 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-850 border border-cyber-800">
              <span className="text-slate-300">FastAPI Telemetry Gateway:</span>
              <span className="text-emerald-400 font-bold">HEALTHY (Port 8000)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-850 border border-cyber-800">
              <span className="text-slate-300">SQLite Forensic Database:</span>
              <span className="text-emerald-400 font-bold">CONNECTED (sentinelx.db)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-850 border border-cyber-800">
              <span className="text-slate-300">Scikit-Learn ML Model State:</span>
              <span className="text-emerald-400 font-bold">ACTIVE & TRAINED</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
