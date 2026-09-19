import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  Server,
  Lock,
  RefreshCw,
  Clock,
  Activity,
  Zap,
  Radio,
  ChevronRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import api from '../services/api';
import { DashboardSummary, SecurityEvent } from '../types';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { RiskBadge } from '../components/RiskBadge';

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [sumRes, evRes] = await Promise.all([
        api.get('/api/dashboard/summary'),
        api.get('/api/dashboard/events?limit=15')
      ]);
      setSummary(sumRes.data);
      setEvents(evRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000); // 4-second live polling
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading || !summary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="text-xs font-mono text-slate-400">CONNECTING TO DEFENSE TELEMETRY...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-cyber-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-slate-100">
              SOC COMMAND CENTER
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-950/60 text-emerald-400 text-[10px] font-mono font-semibold">
              <Radio className="w-3 h-3 animate-pulse" />
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time multi-signal sensor fusion, behavioral analytics & autonomous containment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/simulation')}
            className="px-3.5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-950/50 flex items-center gap-2 transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-purple-200" />
            <span>Simulation Lab</span>
          </button>
          <button
            onClick={handleManualRefresh}
            className="p-2 rounded-lg border border-cyber-800 bg-cyber-900 hover:bg-cyber-800 text-slate-300 transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Top KPI Cards (6 metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Active Threats"
          value={summary.active_threats}
          icon={ShieldAlert}
          variant={summary.active_threats > 0 ? 'rose' : 'emerald'}
          subtitle="Awaiting resolution"
        />
        <StatCard
          title="Critical Incidents"
          value={summary.critical_incidents}
          icon={AlertTriangle}
          variant="amber"
          subtitle="Severity >= 80"
        />
        <StatCard
          title="Monitored Endpoints"
          value={summary.monitored_endpoints}
          icon={Server}
          variant="cyan"
          subtitle="Virtual testbed"
        />
        <StatCard
          title="Contained Threats"
          value={summary.contained_threats}
          icon={Lock}
          variant="purple"
          subtitle="Policy isolated"
        />
        <StatCard
          title="Recovery Success"
          value={`${summary.recovery_success_rate}%`}
          icon={RefreshCw}
          variant="emerald"
          subtitle="Snapshot certified"
        />
        <StatCard
          title="Avg Response Time"
          value={`${summary.average_response_time_sec}s`}
          icon={Clock}
          variant="cyan"
          subtitle="Autonomous loop"
        />
      </div>

      {/* Engine Status Strip */}
      <div className="p-3 rounded-xl border border-cyber-800 bg-cyber-900/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <span className="text-slate-400 font-semibold flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-cyan-400" />
          SYSTEM ENGINES STATUS:
        </span>
        <div className="flex flex-wrap items-center gap-4">
          {Object.entries(summary.system_status).map(([eng, stat]) => (
            <div key={eng} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300 uppercase">{eng.replace('_', ' ')}</span>
              <span className="text-emerald-400 font-bold">[{stat}]</span>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threats Over Time Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Telemetry Ingestion & Threats Over Time</h3>
              <p className="text-xs text-slate-400 font-mono">Hourly synthetic attack vectors recorded</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/40">
              Live Window (7h)
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.threats_over_time} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="threatsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="threats" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#threatsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Breakdown */}
        <div className="p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Endpoint Risk Distribution</h3>
            <p className="text-xs text-slate-400 font-mono mb-2">Posture categorization across virtual assets</p>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary.risk_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {summary.risk_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-cyber-800">
            {summary.risk_distribution.map((r) => (
              <div key={r.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="text-slate-400">{r.name}:</span>
                <strong className="text-slate-200">{r.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row: Endpoints Status & Detection Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Virtual Endpoints Posture Matrix */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Virtual Endpoint Fleet Posture</h3>
              <p className="text-xs text-slate-400 font-mono">Simulated workstations and servers</p>
            </div>
            <button
              onClick={() => navigate('/endpoints')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All Fleet</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {summary.endpoint_risk_matrix.map((ep) => (
              <div
                key={ep.id}
                onClick={() => navigate(`/endpoints/${ep.id}`)}
                className="p-3 rounded-xl border border-cyber-800 bg-cyber-850/70 hover:border-cyan-500/40 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-slate-200">{ep.hostname}</span>
                  <StatusBadge status={ep.status} />
                </div>
                <div className="text-[11px] font-mono text-slate-400">{ep.ip}</div>
                <div className="mt-2 flex items-center justify-between pt-2 border-t border-cyber-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Risk Posture</span>
                  <RiskBadge score={ep.risk} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detection Sources */}
        <div className="p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md">
          <h3 className="text-sm font-bold text-slate-100 mb-1">Signal Detection Sources</h3>
          <p className="text-xs text-slate-400 font-mono mb-4">Attribution distribution by defense layer</p>
          <div className="space-y-3">
            {summary.detection_sources.map((ds) => (
              <div key={ds.source}>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">{ds.source}</span>
                  <span className="text-slate-400">{ds.value}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-cyber-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${ds.value}%`, backgroundColor: ds.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Event Feed */}
      <div className="p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-100">Live SOC Event Stream</h3>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="text-xs font-mono text-slate-400">Append-Only Telemetry Feed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cyber-800 text-slate-400 uppercase text-[10px]">
                <th className="pb-2">Timestamp</th>
                <th className="pb-2">Event Type</th>
                <th className="pb-2">Source</th>
                <th className="pb-2">Target</th>
                <th className="pb-2">Severity</th>
                <th className="pb-2 text-right">Risk Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-800/60">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-cyber-850/50 transition-colors">
                  <td className="py-2.5 text-slate-400">
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2.5 text-cyan-300 font-semibold">{ev.event_type}</td>
                  <td className="py-2.5 text-slate-300">{ev.source}</td>
                  <td className="py-2.5 text-slate-300">{ev.target}</td>
                  <td className="py-2.5">
                    <StatusBadge status={ev.severity} />
                  </td>
                  <td className="py-2.5 text-right font-bold text-slate-200">
                    +{ev.risk_impact}
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
