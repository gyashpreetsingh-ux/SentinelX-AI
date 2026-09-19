// SentinelX AI TypeScript Type Definitions
// Author: Yashpreet Singh (2026)

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'ANALYST' | 'VIEWER';
  created_at: string;
}

export interface Endpoint {
  id: number;
  hostname: string;
  os_name: string;
  synthetic_ip: string;
  status: 'ONLINE' | 'SUSPICIOUS' | 'QUARANTINED' | 'RECOVERING' | 'RECOVERED';
  risk_score: number;
  last_seen: string;
  processes_json: Array<{ pid: number; name: string; status: string; cpu?: number }>;
  isolation_details: Record<string, any>;
  trusted_snapshot: string;
}

export interface SecurityEvent {
  id: number;
  timestamp: string;
  event_type: string;
  source: string;
  target: string;
  endpoint_id: number | null;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  risk_impact: number;
  raw_data_json: Record<string, any>;
}

export interface Incident {
  id: number;
  incident_code: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'NEW' | 'INVESTIGATING' | 'CONTAINED' | 'RECOVERING' | 'RESOLVED' | 'FALSE_POSITIVE';
  endpoint_id: number | null;
  endpoint_hostname?: string;
  synthetic_ip?: string;
  detection_method: string;
  risk_score: number;
  confidence_score: number;
  evidence_json: string[];
  recommended_action: string;
  action_taken: string;
  recovery_status: string;
  created_at: string;
  updated_at: string;
}

export interface Honeypot {
  id: number;
  name: string;
  decoy_type: string;
  synthetic_path: string;
  status: string;
  interaction_count: number;
  last_interaction: string | null;
  fake_payload_summary: string;
}

export interface HoneypotEvent {
  id: number;
  honeypot_id: number;
  endpoint_id: number | null;
  action: string;
  synthetic_source_ip: string;
  payload_summary: string;
  risk_score: number;
  confidence_score: number;
  timestamp: string;
}

export interface Policy {
  id: number;
  name: string;
  condition_risk_min: number;
  condition_confidence_min: number;
  trigger_event: string;
  action: 'QUARANTINE' | 'STEP_UP' | 'RESTRICT_SESSION' | 'ALLOW';
  is_active: boolean;
  description: string;
  updated_by: string;
  updated_at: string;
}

export interface RecoveryJob {
  id: number;
  endpoint_id: number;
  incident_id: number | null;
  snapshot_id: string;
  status: 'QUEUED' | 'IN_PROGRESS' | 'VERIFYING' | 'SUCCESS' | 'FAILED';
  progress_percent: number;
  logs: string[];
  started_at: string;
  completed_at: string | null;
}

export interface ThreatIndicator {
  id: number;
  indicator: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  first_seen: string;
  last_seen: string;
  status: string;
  source: string;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  username: string;
  action: string;
  target: string;
  reason: string;
  risk_score: number;
  result: string;
}

export interface DefenseWorkflowStep {
  step_number: number;
  title: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  icon: string;
  timestamp: string;
  details: string;
  evidence?: string;
  state_change?: Record<string, any>;
}

export interface FullDefenseWorkflowResponse {
  workflow_id: string;
  total_steps: number;
  success: boolean;
  incident_code: string;
  target_endpoint: string;
  final_risk: number;
  final_confidence: number;
  steps: DefenseWorkflowStep[];
  execution_time_ms: number;
}

export interface DashboardSummary {
  active_threats: number;
  critical_incidents: number;
  monitored_endpoints: number;
  contained_threats: number;
  recovery_success_rate: number;
  average_response_time_sec: number;
  system_status: Record<string, string>;
  threats_over_time: Array<{ time: string; threats: number }>;
  risk_distribution: Array<{ name: string; count: number; color: string }>;
  incident_severity_distribution: Array<{ severity: string; count: number; fill: string }>;
  endpoint_risk_matrix: Array<{ id: number; hostname: string; status: string; risk: number; ip: string }>;
  detection_sources: Array<{ source: string; value: number; color: string }>;
}
