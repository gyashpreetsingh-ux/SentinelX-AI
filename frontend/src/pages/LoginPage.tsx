import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, User as UserIcon, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('admin@sentinelx.ai');
  const [password, setPassword] = useState('Admin@SentinelX2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/api/auth/login', { username, password });
      login(res.data.access_token, res.data.role, res.data.username);
      addToast('Authentication Verified', `Welcome back, ${res.data.username} (${res.data.role}).`, 'success');
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Invalid username or password';
      setError(msg);
      addToast('Authentication Failed', msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-cyber-950 flex flex-col justify-center items-center px-4 relative overflow-hidden selection:bg-cyan-500/20 selection:text-cyan-300">
      <div className="absolute inset-0 radar-grid opacity-15 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="flex flex-col items-center mb-8 text-center z-10">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 cyber-glow-cyan">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 to-sky-200 bg-clip-text text-transparent">
          SENTINELX AI
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Next-Gen Autonomous Cyber Defense Platform
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md p-8 rounded-2xl border border-cyber-800 bg-cyber-900/90 backdrop-blur-xl shadow-2xl z-10">
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-100">Security Console Access</h2>
          <p className="text-xs text-slate-400 mt-1">
            Authenticate to access the SOC command center and defense controls.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/70 border border-rose-600/50 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
              USERNAME OR EMAIL
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-cyber-800 bg-cyber-950 text-slate-100 text-xs font-mono focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="operator@sentinelx.ai"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-cyber-800 bg-cyber-950 text-slate-100 text-xs font-mono focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-lg shadow-cyan-500/20 cyber-glow-cyan flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="font-mono">VERIFYING CREDENTIALS...</span>
            ) : (
              <>
                <span>AUTHENTICATE & ENTER CONSOLE</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div className="mt-8 pt-6 border-t border-cyber-800">
          <div className="text-[11px] font-mono text-slate-400 mb-2">QUICK DEMO ACCESS (CLICK TO FILL):</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('admin@sentinelx.ai', 'Admin@SentinelX2026')}
              className="px-2.5 py-2 rounded-lg border border-cyber-800 bg-cyber-950 hover:border-cyan-500/40 text-[11px] font-mono text-cyan-300 text-center transition-colors"
            >
              <div className="font-bold">ADMIN</div>
              <div className="text-[9px] text-slate-500">Full Control</div>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('analyst@sentinelx.ai', 'Analyst@SentinelX2026')}
              className="px-2.5 py-2 rounded-lg border border-cyber-800 bg-cyber-950 hover:border-cyan-500/40 text-[11px] font-mono text-amber-300 text-center transition-colors"
            >
              <div className="font-bold">ANALYST</div>
              <div className="text-[9px] text-slate-500">Investigation</div>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('viewer@sentinelx.ai', 'Viewer@SentinelX2026')}
              className="px-2.5 py-2 rounded-lg border border-cyber-800 bg-cyber-950 hover:border-cyan-500/40 text-[11px] font-mono text-slate-300 text-center transition-colors"
            >
              <div className="font-bold">VIEWER</div>
              <div className="text-[9px] text-slate-500">Read-Only</div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-8 text-center text-xs text-slate-500 font-mono z-10">
        © 2026 Yashpreet Singh • SentinelX AI
      </div>
    </div>
  );
};
