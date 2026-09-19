import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertOctagon,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';
import { Incident } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { RiskBadge } from '../components/RiskBadge';

export const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [severity, setSeverity] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        severity,
        status,
        search
      });
      const res = await api.get(`/api/incidents?${params.toString()}`);
      setIncidents(res.data.items);
      setTotal(res.data.total);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [page, severity, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchIncidents();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-cyber-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-slate-100">
              INCIDENT MANAGEMENT & CORRELATION
            </h1>
            <span className="px-2.5 py-0.5 rounded-full border border-rose-500/40 bg-rose-950/60 text-rose-300 text-[10px] font-mono">
              {total} RECORDED
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Automated alert clustering, forensic timeline reconstruction and lifecycle triage.
          </p>
        </div>

        <button
          onClick={fetchIncidents}
          className="p-2 rounded-lg border border-cyber-800 bg-cyber-900 hover:bg-cyber-800 text-slate-300 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by code, title, or detection engine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-cyber-800 bg-cyber-950 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </form>

        <div className="flex items-center gap-3">
          {/* Severity Filter */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Severity:</span>
            <select
              value={severity}
              onChange={(e) => { setSeverity(e.target.value); setPage(1); }}
              className="px-2.5 py-1.5 rounded-lg border border-cyber-800 bg-cyber-950 text-slate-200 text-xs font-mono focus:outline-none"
            >
              <option value="ALL">ALL</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Status:</span>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="px-2.5 py-1.5 rounded-lg border border-cyber-800 bg-cyber-950 text-slate-200 text-xs font-mono focus:outline-none"
            >
              <option value="ALL">ALL</option>
              <option value="NEW">NEW</option>
              <option value="INVESTIGATING">INVESTIGATING</option>
              <option value="CONTAINED">CONTAINED</option>
              <option value="RECOVERING">RECOVERING</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="FALSE_POSITIVE">FALSE_POSITIVE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cyber-800 bg-cyber-950/60 text-slate-400 uppercase text-[10px]">
                <th className="p-4">Incident Code</th>
                <th className="p-4">Title & Detection Method</th>
                <th className="p-4">Endpoint</th>
                <th className="p-4">Risk / Confidence</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action Taken</th>
                <th className="p-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-800/60">
              {incidents.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => navigate(`/incidents/${inc.id}`)}
                  className="hover:bg-cyber-850/50 cursor-pointer transition-colors"
                >
                  <td className="p-4 font-bold text-cyan-400">{inc.incident_code}</td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-100">{inc.title}</div>
                    <div className="text-[10px] text-slate-400">{inc.detection_method}</div>
                  </td>
                  <td className="p-4 text-slate-300 font-semibold">{inc.endpoint_hostname}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <RiskBadge score={inc.risk_score} />
                      <span className="text-[10px] text-slate-400">{inc.confidence_score}% cert.</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={inc.status} />
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[11px]">{inc.action_taken}</td>
                  <td className="p-4 text-right">
                    <ChevronRight className="w-4 h-4 text-slate-500 inline" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-cyber-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <div>
            Showing Page <strong>{page}</strong> of <strong>{totalPages || 1}</strong> ({total} total incidents)
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 rounded border border-cyber-800 hover:bg-cyber-800 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded border border-cyber-800 hover:bg-cyber-800 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
