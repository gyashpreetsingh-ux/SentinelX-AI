import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Archive,
  RefreshCw,
  HardDrive,
  CheckCircle,
  Award,
  FileText,
  Activity,
  Cpu,
  LogIn,
  Laptop,
  Files,
  Target,
  Sparkles,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import api from '../services/api';
import { DefenseWorkflowStep } from '../types';
import { useToast } from '../context/ToastContext';

export const SimulationPage: React.FC = () => {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [runningFullDefense, setRunningFullDefense] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [workflowSteps, setWorkflowSteps] = useState<DefenseWorkflowStep[]>([]);
  const [workflowResult, setWorkflowResult] = useState<any>(null);
  const [singleRunning, setSingleRunning] = useState<string | null>(null);

  const { addToast } = useToast();

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const res = await api.get('/api/simulation/scenarios');
        setScenarios(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchScenarios();
  }, []);

  const runSingleScenario = async (id: string, name: string) => {
    setSingleRunning(id);
    try {
      const res = await api.post(`/api/simulation/trigger?scenario_id=${id}`);
      addToast('Scenario Executed', `${name} recorded in telemetry stream.`, 'info');
    } catch (err) {
      addToast('Error', `Failed to execute scenario ${name}.`, 'error');
    } finally {
      setSingleRunning(null);
    }
  };

  const runFullAutonomousDefense = async () => {
    setRunningFullDefense(true);
    setActiveStepIndex(0);
    setWorkflowSteps([]);
    setWorkflowResult(null);

    try {
      const res = await api.post('/api/simulation/full-defense');
      const allSteps: DefenseWorkflowStep[] = res.data.steps;
      setWorkflowResult(res.data);

      // Animate steps sequentially for presentation experience
      for (let i = 0; i < allSteps.length; i++) {
        setActiveStepIndex(i);
        setWorkflowSteps((prev) => [...prev, allSteps[i]]);
        await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms pacing per step
      }

      addToast(
        'Autonomous Defense Complete!',
        `Endpoint-03 quarantined, restored from snapshot, verified clean, and incident resolved.`,
        'success'
      );
    } catch (err) {
      addToast('Workflow Error', 'Failed to execute autonomous defense workflow.', 'error');
    } finally {
      setRunningFullDefense(false);
    }
  };

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'LogIn': return LogIn;
      case 'Laptop': return Laptop;
      case 'Files': return Files;
      case 'Cpu': return Cpu;
      case 'Target': return Target;
      case 'Sparkles': return Sparkles;
      case 'Activity': return Activity;
      case 'ShieldAlert': return ShieldAlert;
      case 'Lock': return Lock;
      case 'Archive': return Archive;
      case 'RefreshCw': return RefreshCw;
      case 'HardDrive': return HardDrive;
      case 'CheckCircle': return CheckCircle;
      case 'ShieldCheck': return ShieldCheck;
      case 'Award': return Award;
      case 'FileText': return FileText;
      default: return CheckCircle2;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-cyber-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-slate-100">
              CYBER DEFENSE SIMULATION LAB
            </h1>
            <span className="px-2.5 py-0.5 rounded-full border border-purple-500/40 bg-purple-950/60 text-purple-300 text-[10px] font-mono font-bold">
              AUTHORIZED TEST ENVIRONMENT
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Deterministic synthetic attack injectors & closed-loop autonomous defense demonstration range.
          </p>
        </div>

        <button
          onClick={runFullAutonomousDefense}
          disabled={runningFullDefense}
          className="px-6 py-3 rounded-xl text-xs font-mono font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-950/60 flex items-center gap-2.5 transition-all cyber-glow-rose disabled:opacity-50"
        >
          <Zap className="w-4 h-4 text-purple-200 animate-pulse" />
          <span>{runningFullDefense ? 'EXECUTING 16-STAGE DEFENSE...' : 'RUN FULL AUTONOMOUS DEFENSE'}</span>
        </button>
      </div>

      {/* Flagship 16-Step Defense Workflow Viewer */}
      <div className="p-6 rounded-2xl border border-cyber-800 bg-cyber-900/90 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-cyber-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
              <h2 className="text-base font-bold text-slate-100">
                16-Stage Full Autonomous Defense Workflow
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Target: Endpoint-03 • Multi-Sensor Correlator • Snapshot Rollback Verification
            </p>
          </div>

          {workflowResult && (
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-2.5 py-1 rounded border border-rose-500/40 bg-rose-950/40 text-rose-300 font-bold">
                Risk: {workflowResult.final_risk}/100
              </span>
              <span className="px-2.5 py-1 rounded border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 font-bold">
                Conf: {workflowResult.final_confidence}%
              </span>
              <span className="text-slate-400">
                Execution: {workflowResult.execution_time_ms} ms
              </span>
            </div>
          )}
        </div>

        {/* Steps List */}
        {workflowSteps.length === 0 && !runningFullDefense ? (
          <div className="py-12 text-center text-slate-500 font-mono text-xs border border-dashed border-cyber-800 rounded-xl">
            <Zap className="w-8 h-8 text-purple-400 mx-auto mb-3 opacity-60" />
            <p className="text-slate-300 font-semibold mb-1">Interactive Autonomous Defense Demonstration Ready</p>
            <p className="max-w-md mx-auto text-slate-500">
              Click "RUN FULL AUTONOMOUS DEFENSE" above to observe the end-to-end 16-step detection, containment, snapshot rollback, and verification cycle.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {workflowSteps.map((step, idx) => {
              const StepIcon = getStepIcon(step.icon);
              const isCurrent = idx === activeStepIndex && runningFullDefense;

              return (
                <div
                  key={step.step_number}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    step.step_number >= 9 && step.step_number <= 10
                      ? 'border-rose-500/40 bg-rose-950/20'
                      : step.step_number >= 11 && step.step_number <= 14
                      ? 'border-emerald-500/40 bg-emerald-950/20'
                      : isCurrent
                      ? 'border-purple-500/80 bg-purple-950/40 shadow-lg shadow-purple-950/50'
                      : 'border-cyber-800 bg-cyber-850/60'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-lg bg-cyber-900 border border-cyber-800 text-cyan-400 flex-shrink-0 mt-0.5">
                      <StepIcon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-cyan-400">
                            STEP {step.step_number.toString().padStart(2, '0')}
                          </span>
                          <span className="text-slate-600">•</span>
                          <h4 className="text-xs font-bold text-slate-100">{step.title}</h4>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{step.timestamp}</span>
                      </div>

                      <p className="text-xs text-slate-300 font-mono mt-1 leading-relaxed">
                        {step.details}
                      </p>

                      {step.evidence && (
                        <div className="mt-2 text-[11px] font-mono text-purple-300 bg-purple-950/30 p-2 rounded border border-purple-900/30">
                          <strong>Evidence / Attribution:</strong> {step.evidence}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Individual Simulation Scenarios Workbench */}
      <div>
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono mb-4">
          MODULAR TELEMETRY INJECTION SUITE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios
            .filter((s) => s.id !== 'full_autonomous_defense')
            .map((s) => (
              <div
                key={s.id}
                className="p-5 rounded-2xl border border-cyber-800 bg-cyber-900/80 backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{s.category}</span>
                    <span className="text-[10px] font-mono text-slate-400">{s.expected_risk}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-100 mb-2">{s.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
                </div>

                <button
                  onClick={() => runSingleScenario(s.id, s.name)}
                  disabled={singleRunning === s.id}
                  className="mt-4 w-full py-2.5 rounded-xl border border-cyber-800 bg-cyber-950 hover:border-cyan-500/40 text-xs font-mono text-cyan-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{singleRunning === s.id ? 'INJECTING...' : 'TRIGGER SCENARIO'}</span>
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
