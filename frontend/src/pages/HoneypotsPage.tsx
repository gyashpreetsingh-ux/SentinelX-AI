import React, { useState, useEffect } from 'react';
import {
  Boxes,
  ShieldAlert,
  Terminal,
  Database,
  Key,
  FolderLock,
  UserCheck,
  Play,
  Clock,
  Radio,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import api from '../services/api';
import { Honeypot, HoneypotEvent } from '../types';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/StatusBadge';
import { RiskBadge } from '../components/RiskBadge';

export const HoneypotsPage: React.FC = () => {
  const [honeypots, setHoneypots] = useState<Honeypot[]>([]);
  const [events, setEvents] = useState<HoneypotEvent[]>([]);
  const [selectedDecoy, setSelectedDecoy] = useState<number>(2); // fake-finance-share
  const [simulating, setSimulating] = useState(false);
  const { addToast } = useToast();

  const fetchHoneypots = async () => {
    try {
      const [hRes, eRes] = await Promise.all([
        api.get('/api/honeypots'),
        api.get('/api/honeypots/events?limit=15')
      ]);
      setHoneypots(hRes.data);
      setEvents(eRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHoneypots();
  }, []);

  const handleSimulateAttack = async () => {
    setSimulating(true);
    try {
      const res = await api.post('/api/honeypots/simulate', {
        honeypot_id: selectedDecoy,
        endpoint_hostname: 'Endpoint-07',
        action: 'Resource Enumeration & SMB Honeytoken Probe'
      });
      addToast(
        'Digital Labyrinth: Trap Triggered!',
        `Synthetic attacker interacted with ${res.data.honeypot_name}. Risk: ${res.data.risk_score}, Conf: ${res.data.confidence_score}%`,
        'threat'
      );
      fetchHoneypots();
    } catch (err) {
      addToast('Simulation Error', 'Failed to simulate honeypot interaction.', 'error');
    } finally {
      setSimulating(false);
    }
  };

  const getDecoyIcon = (name: string) => {
    if (name.includes('admin')) return UserCheck;
    if (name.includes('finance')) return FolderLock;
    if (name.includes('database')) return Database;
    if (name.includes('key')) return Key;
    return Terminal;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-cyber-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-slate-100">
              DIGITAL LABYRINTH — DECEPTION DECOY NETWORK
            </h1>
            <span className="px-2.5 py-0.5 rounded-full border border-purple-500/40 bg-purple-950/60 text-purple-300 text-[10px] font-mono">
              5 ACTIVE CANARY TRAPS
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Zero-false-positive synthetic assets. Legitimate employees never touch these traps.
          </p>
        </div>

        <button
          onClick={handleSimulateAttack}
          disabled={simulating}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-950/50 flex items-center gap-2 transition-all cyber-glow-rose disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{simulating ? 'TRIGGERING DECOY CANARY...' : 'Simulate Attacker Interaction'}</span>
        </button>
      </div>

      {/* Honeypots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {honeypots.map((hp) => {
          const Icon = getDecoyIcon(hp.name);
          const isSelected = selectedDecoy === hp.id;
          return (
            <div
              key={hp.id}
              onClick={() => setSelectedDecoy(hp.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-purple-500/80 bg-purple-950/30 shadow-lg shadow-purple-950/40'
                  : 'border-cyber-800 bg-cyber-900/80 hover:border-cyber-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <Icon className="w-5 h-5" />
                </div>
                <StatusBadge status={hp.status} />
              </div>
              <h3 className="font-bold text-xs text-slate-100 mb-1">{hp.name}</h3>
              <p className="text-[11px] text-slate-400 font-mono mb-2">{hp.decoy_type}</p>
              <div className="pt-2 border-t border-cyber-800 text-[10px] font-mono flex justify-between text-slate-400">
                <span>Interactions:</span>
                <strong className="text-purple-300">{hp.interaction_count} hits</strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* Honeypot Interaction Timeline & Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interaction Log Stream */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Canary Tripwire Interaction Log</h3>
              <p className="text-xs text-slate-400 font-mono">High-fidelity intrusion attribution telemetry</p>
            </div>
            <span className="text-xs font-mono text-purple-400 px-2 py-0.5 rounded border border-purple-500/30 bg-purple-950/40">
              Deterministic Trap
            </span>
          </div>

          <div className="space-y-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-3.5 rounded-xl border border-cyber-800 bg-cyber-850/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-rose-400 font-bold">{ev.action}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">Src IP: {ev.synthetic_source_ip}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{ev.payload_summary}</p>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <RiskBadge score={ev.risk_score} />
                  <span className="text-slate-500 text-[10px]">
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Decoy Inspection & Safety */}
        <div className="p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 mb-2">Canary Trap Details</h3>
            {honeypots.find((h) => h.id === selectedDecoy) && (
              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-cyber-850 border border-cyber-800">
                  <div className="text-slate-400 text-[10px] mb-1">SYNTHETIC TRAP PATH:</div>
                  <div className="text-cyan-300 break-all font-semibold">
                    {honeypots.find((h) => h.id === selectedDecoy)?.synthetic_path}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-cyber-850 border border-cyber-800">
                  <div className="text-slate-400 text-[10px] mb-1">HONEYTOKEN SPECIFICATION:</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {honeypots.find((h) => h.id === selectedDecoy)?.fake_payload_summary}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 rounded-xl border border-cyan-500/30 bg-cyan-950/20 text-[11px] text-slate-400">
            <span className="font-bold text-cyan-300">Why Digital Labyrinth Matters:</span> Any touch on a decoy immediately triggers Risk: 92/100 and Confidence: 96%, because regular workloads never touch synthetic honeytokens.
          </div>
        </div>
      </div>
    </div>
  );
};
