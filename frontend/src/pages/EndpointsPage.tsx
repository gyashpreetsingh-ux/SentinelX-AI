import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, Shield, Search, RefreshCw, ChevronRight, Activity, Lock } from 'lucide-react';
import api from '../services/api';
import { Endpoint } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { RiskBadge } from '../components/RiskBadge';

export const EndpointsPage: React.FC = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEndpoints = async () => {
    try {
      const res = await api.get('/api/endpoints');
      setEndpoints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEndpoints();
    const interval = setInterval(fetchEndpoints, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = endpoints.filter((ep) =>
    ep.hostname.toLowerCase().includes(search.toLowerCase()) ||
    ep.synthetic_ip.includes(search) ||
    ep.os_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-cyber-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-slate-100">
              VIRTUAL ENDPOINT FLEET INVENTORY
            </h1>
            <span className="px-2.5 py-0.5 rounded-full border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 text-[10px] font-mono">
              8 VIRTUAL ASSETS
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Isolated synthetic host nodes configured for zero-risk intrusion testing and snapshot restoration.
          </p>
        </div>

        <button
          onClick={fetchEndpoints}
          className="p-2 rounded-lg border border-cyber-800 bg-cyber-900 hover:bg-cyber-800 text-slate-300 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by hostname, synthetic IP, or OS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-cyber-800 bg-cyber-950 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Endpoints */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((ep) => (
          <div
            key={ep.id}
            onClick={() => navigate(`/endpoints/${ep.id}`)}
            className="p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80 hover:border-cyan-500/40 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-sm text-slate-100">{ep.hostname}</span>
                <StatusBadge status={ep.status} />
              </div>
              <p className="text-[11px] text-slate-400 font-mono">{ep.os_name}</p>
              <div className="mt-2 text-xs font-mono text-cyan-400">{ep.synthetic_ip}</div>
            </div>

            <div className="mt-4 pt-3 border-t border-cyber-800 flex items-center justify-between text-xs font-mono">
              <RiskBadge score={ep.risk_score} />
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <span>Details</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
