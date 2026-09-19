import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Boxes,
  ShieldCheck,
  AlertOctagon,
  Server,
  RefreshCw,
  Mail,
  Search,
  Sliders,
  FileText,
  FlaskConical,
  Layers,
  Settings as SettingsIcon,
  Info,
  LogOut,
  Shield,
  Menu,
  X,
  Bell,
  Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Behavior Analysis', path: '/behavior', icon: Activity },
  { name: 'Digital Labyrinth', path: '/honeypots', icon: Boxes },
  { name: 'Risk Engine', path: '/risk-engine', icon: ShieldCheck },
  { name: 'Incidents', path: '/incidents', icon: AlertOctagon },
  { name: 'Endpoints', path: '/endpoints', icon: Server },
  { name: 'Response & Recovery', path: '/response', icon: RefreshCw },
  { name: 'Phishing Analysis', path: '/phishing', icon: Mail },
  { name: 'Threat Intelligence', path: '/threat-intelligence', icon: Search },
  { name: 'Policies', path: '/policies', icon: Sliders },
  { name: 'Audit Logs', path: '/audit', icon: FileText },
  { name: 'Simulation Lab', path: '/simulation', icon: FlaskConical, highlight: true },
  { name: 'Architecture', path: '/architecture', icon: Layers },
  { name: 'Settings', path: '/settings', icon: SettingsIcon },
  { name: 'About', path: '/about', icon: Info },
];

export const DashboardLayout: React.FC = () => {
  const { user, role, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    addToast('Logged Out', 'You have been signed out of SentinelX AI.', 'info');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-cyber-950 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 h-16 border-b border-cyber-800 bg-cyber-950/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg border border-cyber-800 hover:bg-cyber-900 text-slate-300"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 cyber-glow-cyan">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-wider bg-gradient-to-r from-cyan-400 to-sky-200 bg-clip-text text-transparent">
                  SENTINELX AI
                </span>
                <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/50 text-cyan-300 font-mono">
                  v1.0 (2026)
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden md:block">
                Autonomous Cyber Defense • Yashpreet Singh
              </p>
            </div>
          </div>
        </div>

        {/* Status Pills & User Profile */}
        <div className="flex items-center gap-3">
          {/* Engines Status Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyber-800 bg-cyber-900/90 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">ENGINES:</span>
            <span className="text-emerald-400 font-bold">ALL ONLINE</span>
          </div>

          <button
            onClick={() => addToast('System Notification', 'Defense engines are active. Live telemetry stream listening.', 'info')}
            className="p-2 rounded-lg border border-cyber-800 bg-cyber-900 hover:bg-cyber-800 text-slate-300 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400" />
          </button>

          {/* User Info */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-cyber-800">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-200">{user?.username || 'Operator'}</div>
              <div className="text-[10px] font-mono text-cyan-400">{role || 'ANALYST'}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg border border-rose-900/30 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main App Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 top-16 z-30 w-64 border-r border-cyber-800 bg-cyber-950/95 backdrop-blur-md transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 overflow-y-auto ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
              COMMAND NAVIGATION
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold cyber-glow-cyan'
                      : item.highlight
                      ? 'text-purple-300 hover:bg-purple-950/30 border border-purple-900/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-cyber-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : item.highlight ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                  {item.highlight && (
                    <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                      FLAGSHIP
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          <div className="p-4 mt-auto border-t border-cyber-800">
            <div className="p-3 rounded-lg border border-cyber-800 bg-cyber-900/60 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>SentinelX AI</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                Next-Gen Autonomous Cyber Defense Platform
              </p>
              <div className="mt-2 text-[10px] text-slate-300 font-mono">
                Author: <strong>Yashpreet Singh</strong> (2026)
              </div>
            </div>
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-cyber-950 via-cyber-950 to-cyber-900">
          <Outlet />

          {/* Consistent Footer */}
          <footer className="mt-12 pt-6 border-t border-cyber-800/80 text-center text-xs text-slate-400 font-mono">
            <p>© 2026 Yashpreet Singh. SentinelX AI — Autonomous Cyber Defense Platform.</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Detect. Understand. Contain. Recover. Learn. Strictly authorized defensive environment & synthetic telemetry.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};
