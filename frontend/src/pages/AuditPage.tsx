import React, { useState, useEffect } from 'react';
import { FileText, Search, RefreshCw, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import api from '../services/api';
import { AuditLog } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { RiskBadge } from '../components/RiskBadge';

export const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        action: action === 'ALL' ? '' : action,
        search
      });
      const res = await api.get(`/api/audit?${params.toString()}`);
      setLogs(res.data.items);
      setTotal(res.data.total);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, action]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-cyber-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-slate-100">
              TAMPER-EVIDENT AUDIT TRAIL & COMPLIANCE LOGS
            </h1>
            <span className="px-2.5 py-0.5 rounded-full border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 text-[10px] font-mono">
              {total} ENTRIES
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Append-only forensic journal recording every autonomous action, policy mutation, containment and recovery cycle.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="p-2 rounded-lg border border-cyber-800 bg-cyber-900 hover:bg-cyber-800 text-slate-300 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-1 min-w-[240px]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search target, operator, reason, or action..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-cyber-800 bg-cyber-950 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Action Filter:</span>
          <select
            value={action}
            onChange={(e) => { setAction(e.target.value); setPage(1); }}
            className="px-2.5 py-1.5 rounded-lg border border-cyber-800 bg-cyber-950 text-slate-200 text-xs font-mono focus:outline-none"
          >
            <option value="ALL">ALL ACTIONS</option>
            <option value="QUARANTINE">QUARANTINE</option>
            <option value="RECOVERY">RECOVERY</option>
            <option value="POLICY">POLICY CHANGES</option>
            <option value="HONEYPOT">HONEYPOT TRIPS</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cyber-800 bg-cyber-950/60 text-slate-400 uppercase text-[10px]">
                <th className="p-4">Timestamp (UTC)</th>
                <th className="p-4">Operator / Actor</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4">Forensic Reason</th>
                <th className="p-4">Risk</th>
                <th className="p-4 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-800/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-cyber-850/50 transition-colors">
                  <td className="p-4 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-cyan-400">{log.username}</td>
                  <td className="p-4 text-slate-200 font-semibold">{log.action}</td>
                  <td className="p-4 text-slate-300">{log.target}</td>
                  <td className="p-4 text-slate-400 max-w-xs truncate">{log.reason}</td>
                  <td className="p-4">
                    <RiskBadge score={log.risk_score} showScore={false} />
                  </td>
                  <td className="p-4 text-right">
                    <StatusBadge status={log.result} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-cyber-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <div>
            Page <strong>{page}</strong> of <strong>{totalPages || 1}</strong> ({total} entries)
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
