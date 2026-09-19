import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, Filter, RefreshCw, ExternalLink, Globe } from 'lucide-react';
import api from '../services/api';
import { ThreatIndicator } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { RiskBadge } from '../components/RiskBadge';

export const ThreatIntelPage: React.FC = () => {
  const [indicators, setIndicators] = useState<ThreatIndicator[]>([]);
  const [category, setCategory] = useState('ALL');
  const [severity, setSeverity] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchIndicators = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ category, severity, search });
      const res = await api.get(`/api/threat-intelligence?${params.toString()}`);
      setIndicators(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndicators();
  }, [category, severity]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchIndicators();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-cyber-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-slate-100">
              PREDICTIVE HUNT — THREAT INTELLIGENCE
            </h1>
            <span className="px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-950/60 text-amber-300 text-[10px] font-mono">
              ADAPTER ARCHITECTURE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Aggregated synthetic IoCs, reputation digests & adversary behavioral signatures.
          </p>
        </div>

        <button
          onClick={fetchIndicators}
          className="p-2 rounded-lg border border-cyber-800 bg-cyber-900 hover:bg-cyber-800 text-slate-300 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-1 min-w-[240px]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search synthetic indicator (IP, domain, hash)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-cyber-800 bg-cyber-950 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Category:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-cyber-800 bg-cyber-950 text-slate-200 text-xs font-mono focus:outline-none"
            >
              <option value="ALL">ALL CATEGORIES</option>
              <option value="Phishing">Phishing</option>
              <option value="Malware">Malware</option>
              <option value="Credential Abuse">Credential Abuse</option>
              <option value="Suspicious Login">Suspicious Login</option>
              <option value="Data Exfiltration Simulation">Data Exfiltration</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Severity:</span>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-cyber-800 bg-cyber-950 text-slate-200 text-xs font-mono focus:outline-none"
            >
              <option value="ALL">ALL SEVERITIES</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
            </select>
          </div>
        </div>
      </div>

      {/* Indicators Table */}
      <div className="rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cyber-800 bg-cyber-950/60 text-slate-400 uppercase text-[10px]">
                <th className="p-4">Indicator (IoC)</th>
                <th className="p-4">Category</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">First Seen</th>
                <th className="p-4">Last Seen</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-800/60">
              {indicators.map((ti) => (
                <tr key={ti.id} className="hover:bg-cyber-850/50 transition-colors">
                  <td className="p-4 font-bold text-cyan-400 break-all">{ti.indicator}</td>
                  <td className="p-4 text-slate-200">{ti.category}</td>
                  <td className="p-4">
                    <StatusBadge status={ti.severity} />
                  </td>
                  <td className="p-4 text-slate-300 font-bold">{ti.confidence}%</td>
                  <td className="p-4 text-slate-400 text-[11px]">{new Date(ti.first_seen).toLocaleDateString()}</td>
                  <td className="p-4 text-slate-400 text-[11px]">{new Date(ti.last_seen).toLocaleDateString()}</td>
                  <td className="p-4">
                    <StatusBadge status={ti.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
