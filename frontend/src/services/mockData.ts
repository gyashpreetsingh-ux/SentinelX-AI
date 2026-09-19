// SentinelX AI — Resilient Client-Side Fallback Engine
// Author: Yashpreet Singh (2026)

export const handleMockRequest = (config: any): { status: number; data: any } | null => {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();

  // 1. Auth Login
  if (url.includes('/api/auth/login') && method === 'post') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const isAnalyst = body?.username?.includes('analyst');
    const isViewer = body?.username?.includes('viewer');
    const role = isAnalyst ? 'ANALYST' : isViewer ? 'VIEWER' : 'ADMIN';
    const username = body?.username?.split('@')[0] || 'admin';
    return {
      status: 200,
      data: {
        access_token: 'mock-sentinelx-jwt-token-2026',
        token_type: 'bearer',
        role,
        username
      }
    };
  }

  // 2. Auth Me
  if (url.includes('/api/auth/me')) {
    const role = localStorage.getItem('sentinelx_role') || 'ADMIN';
    return {
      status: 200,
      data: {
        id: 1,
        username: 'admin',
        email: 'admin@sentinelx.ai',
        role,
        created_at: new Date().toISOString()
      }
    };
  }

  // 3. Dashboard Summary
  if (url.includes('/api/dashboard/summary')) {
    return {
      status: 200,
      data: {
        active_threats: 3,
        critical_incidents: 2,
        monitored_endpoints: 8,
        contained_threats: 4,
        recovery_success_rate: 98.4,
        average_response_time_sec: 4.8,
        system_status: {
          detection_engine: 'ONLINE',
          risk_engine: 'ONLINE',
          policy_engine: 'ONLINE',
          response_engine: 'ONLINE',
          recovery_engine: 'ONLINE'
        },
        threats_over_time: [
          { time: '12:00', threats: 2 },
          { time: '13:00', threats: 4 },
          { time: '14:00', threats: 3 },
          { time: '15:00', threats: 6 },
          { time: '16:00', threats: 8 },
          { time: '17:00', threats: 5 },
          { time: '18:00', threats: 4 }
        ],
        risk_distribution: [
          { name: 'Low (0-29)', count: 5, color: '#10b981' },
          { name: 'Medium (30-59)', count: 1, color: '#f59e0b' },
          { name: 'High (60-79)', count: 1, color: '#f97316' },
          { name: 'Critical (80-100)', count: 1, color: '#ef4444' }
        ],
        incident_severity_distribution: [
          { severity: 'Critical', count: 2, fill: '#ef4444' },
          { severity: 'High', count: 3, fill: '#f97316' },
          { severity: 'Medium', count: 4, fill: '#f59e0b' },
          { severity: 'Low', count: 3, fill: '#10b981' }
        ],
        endpoint_risk_matrix: [
          { id: 1, hostname: 'Endpoint-01', status: 'ONLINE', risk: 12.0, ip: '10.0.1.10' },
          { id: 2, hostname: 'Endpoint-02', status: 'ONLINE', risk: 18.0, ip: '10.0.1.11' },
          { id: 3, hostname: 'Endpoint-03', status: 'ONLINE', risk: 14.0, ip: '10.0.1.12' },
          { id: 4, hostname: 'Endpoint-04', status: 'ONLINE', risk: 22.0, ip: '10.0.1.13' },
          { id: 5, hostname: 'Endpoint-05', status: 'ONLINE', risk: 15.0, ip: '10.0.1.14' },
          { id: 6, hostname: 'Endpoint-06', status: 'ONLINE', risk: 28.0, ip: '10.0.1.15' },
          { id: 7, hostname: 'Endpoint-07', status: 'SUSPICIOUS', risk: 68.0, ip: '10.0.1.16' },
          { id: 8, hostname: 'Endpoint-08', status: 'ONLINE', risk: 10.0, ip: '10.0.1.17' }
        ],
        detection_sources: [
          { source: 'Ghost Pattern ML', value: 38, color: '#38bdf8' },
          { source: 'Digital Labyrinth (Honeypot)', value: 24, color: '#a855f7' },
          { source: 'Scam-Bait (Phishing)', value: 18, color: '#ec4899' },
          { source: 'Authentication Monitor', value: 12, color: '#f59e0b' },
          { source: 'Network Anomaly', value: 8, color: '#10b981' }
        ]
      }
    };
  }

  // 4. Dashboard Events
  if (url.includes('/api/dashboard/events')) {
    return {
      status: 200,
      data: [
        { id: 101, timestamp: new Date().toISOString(), event_type: 'HONEYPOT_INTERACTION', source: 'Endpoint-07', target: 'fake-finance-share', severity: 'CRITICAL', risk_impact: 92.0 },
        { id: 102, timestamp: new Date(Date.now() - 300000).toISOString(), event_type: 'ABNORMAL_LOGIN', source: '198.51.100.89', target: 'Endpoint-03', severity: 'HIGH', risk_impact: 68.0 },
        { id: 103, timestamp: new Date(Date.now() - 900000).toISOString(), event_type: 'PROCESS_ANOMALY', source: 'Endpoint-05', target: 'Daemon-Host', severity: 'HIGH', risk_impact: 74.0 },
        { id: 104, timestamp: new Date(Date.now() - 1800000).toISOString(), event_type: 'PHISHING_DETECTED', source: 'phish@paypa1-security.com', target: 'Mail-Gateway', severity: 'HIGH', risk_impact: 80.0 },
        { id: 105, timestamp: new Date(Date.now() - 3600000).toISOString(), event_type: 'NORMAL_LOGIN', source: 'Internal-vLAN', target: 'Auth-Server', severity: 'LOW', risk_impact: 4.0 }
      ]
    };
  }

  // 5. Behavior Analyze
  if (url.includes('/api/behavior/analyze') && method === 'post') {
    const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const isAnomaly = (data.files_accessed > 100) || data.new_device || data.honeypot_interaction || (data.failed_logins >= 3);
    const risk = isAnomaly ? 94.0 : 18.0;
    const conf = isAnomaly ? 96.0 : 70.0;
    return {
      status: 200,
      data: {
        anomaly_detected: isAnomaly,
        anomaly_score: isAnomaly ? 0.88 : 0.12,
        risk_score: risk,
        confidence_score: conf,
        severity: isAnomaly ? 'CRITICAL' : 'LOW',
        baseline: { login_hour: 9.0, files_accessed: 22, failed_logins: 0.1, typing_deviation: 0.12 },
        current_session: data,
        deviations: {
          login_hour: Math.round(Math.abs(data.login_hour - 9.0) * 10),
          files_accessed: Math.round(data.files_accessed * 4.2),
          failed_logins: data.failed_logins * 100,
          typing_deviation: Math.round(data.typing_deviation * 100)
        },
        recommended_action: isAnomaly ? 'QUARANTINE' : 'ALLOW',
        explanation: isAnomaly
          ? 'Off-hours access, volume anomaly on file access count, and unrecognized hardware signature detected.'
          : 'Telemetry conforms strictly with established historical baseline parameters.'
      }
    };
  }

  // 6. Honeypots
  if (url.includes('/api/honeypots/events')) {
    return {
      status: 200,
      data: [
        { id: 1, honeypot_id: 2, endpoint_id: 7, action: 'SMB Canary Trapped', synthetic_source_ip: '10.0.1.16', payload_summary: 'payroll_q3_2026.xlsx honeytoken accessed', risk_score: 92.0, confidence_score: 96.0, timestamp: new Date().toISOString() }
      ]
    };
  }
  if (url.includes('/api/honeypots/simulate')) {
    return {
      status: 200,
      data: {
        success: true,
        message: 'Decoy interaction simulated in Digital Labyrinth.',
        event_id: 204,
        risk_score: 92.0,
        confidence_score: 96.0,
        honeypot_name: 'fake-finance-share',
        source_endpoint: 'Endpoint-07'
      }
    };
  }
  if (url.includes('/api/honeypots')) {
    return {
      status: 200,
      data: [
        { id: 1, name: 'fake-admin-panel', decoy_type: 'Web Portal Decoy', synthetic_path: '/console/superadmin', status: 'ACTIVE', interaction_count: 3, last_interaction: new Date().toISOString(), fake_payload_summary: 'Canary admin portal trap' },
        { id: 2, name: 'fake-finance-share', decoy_type: 'SMB File Share Decoy', synthetic_path: '//corp-fs/finance', status: 'ACTIVE', interaction_count: 8, last_interaction: new Date().toISOString(), fake_payload_summary: 'Canary payroll documents' },
        { id: 3, name: 'fake-database', decoy_type: 'PostgreSQL Listener Decoy', synthetic_path: 'pgsql://10.0.99.12:5432', status: 'ACTIVE', interaction_count: 2, last_interaction: new Date().toISOString(), fake_payload_summary: 'Synthetic customer database trap' },
        { id: 4, name: 'fake-api-key-store', decoy_type: 'Secrets Vault Decoy', synthetic_path: 'https://vault.internal/api', status: 'ACTIVE', interaction_count: 5, last_interaction: new Date().toISOString(), fake_payload_summary: 'Faux cloud root AWS keys' },
        { id: 5, name: 'fake-server-console', decoy_type: 'SSH Terminal Decoy', synthetic_path: 'ssh://10.0.99.4:2222', status: 'ACTIVE', interaction_count: 4, last_interaction: new Date().toISOString(), fake_payload_summary: 'Interactive sandbox decoy' }
      ]
    };
  }

  // 7. Risk Calculate
  if (url.includes('/api/risk/calculate')) {
    const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const isHigh = (data?.honeypot_interaction > 50) || (data?.behavior_anomaly > 60);
    return {
      status: 200,
      data: {
        risk_score: isHigh ? 94.0 : 18.0,
        confidence_score: isHigh ? 97.0 : 65.0,
        severity: isHigh ? 'CRITICAL' : 'LOW',
        recommended_action: isHigh ? 'QUARANTINE' : 'ALLOW',
        signal_contributions: {
          behavior_anomaly: (data?.behavior_anomaly || 10) * 0.2,
          auth_anomaly: (data?.auth_anomaly || 5) * 0.15,
          endpoint_anomaly: (data?.endpoint_anomaly || 10) * 0.2,
          network_anomaly: (data?.network_anomaly || 8) * 0.15,
          honeypot_interaction: (data?.honeypot_interaction || 0) * 0.25,
          threat_intel_match: (data?.threat_intel_match || 0) * 0.05
        },
        weights_applied: { behavior: 0.2, auth: 0.15, endpoint: 0.2, network: 0.15, honeypot: 0.25, threat_intel: 0.05 },
        evidence_list: isHigh
          ? ['Behavior deviation score 92/100', 'Direct honeypot canary tripwire breached', 'Unrecognized synthetic hardware fingerprint']
          : ['All telemetry signals remain within baseline security thresholds.'],
        explanation: isHigh
          ? 'Elevated risk score (94/100) with 97% confidence determined by correlated multi-signal breach vectors.'
          : 'Risk evaluated as LOW. Telemetry normal.'
      }
    };
  }

  // 8. Endpoints
  if (url.includes('/api/endpoints') && !url.includes('/state')) {
    return {
      status: 200,
      data: [
        { id: 1, hostname: 'Endpoint-01', os_name: 'Ubuntu 24.04 LTS (Synthetic)', synthetic_ip: '10.0.1.10', status: 'ONLINE', risk_score: 12.0, last_seen: new Date().toISOString(), processes_json: [{ pid: 1, name: 'systemd', status: 'running' }], isolation_details: {}, trusted_snapshot: 'Snapshot-2026-09-18-0900' },
        { id: 2, hostname: 'Endpoint-02', os_name: 'Windows 11 Enterprise (Synthetic)', synthetic_ip: '10.0.1.11', status: 'ONLINE', risk_score: 18.0, last_seen: new Date().toISOString(), processes_json: [{ pid: 4, name: 'ntoskrnl.exe', status: 'running' }], isolation_details: {}, trusted_snapshot: 'Snapshot-2026-09-18-0900' },
        { id: 3, hostname: 'Endpoint-03', os_name: 'Ubuntu 24.04 LTS (Synthetic)', synthetic_ip: '10.0.1.12', status: 'ONLINE', risk_score: 14.0, last_seen: new Date().toISOString(), processes_json: [{ pid: 110, name: 'systemd', status: 'running' }], isolation_details: {}, trusted_snapshot: 'Snapshot-2026-09-18-0900' },
        { id: 4, hostname: 'Endpoint-04', os_name: 'Red Hat Linux 9 (Synthetic)', synthetic_ip: '10.0.1.13', status: 'ONLINE', risk_score: 22.0, last_seen: new Date().toISOString(), processes_json: [], isolation_details: {}, trusted_snapshot: 'Snapshot-2026-09-18-0900' },
        { id: 5, hostname: 'Endpoint-05', os_name: 'macOS Sonoma (Synthetic)', synthetic_ip: '10.0.1.14', status: 'ONLINE', risk_score: 15.0, last_seen: new Date().toISOString(), processes_json: [], isolation_details: {}, trusted_snapshot: 'Snapshot-2026-09-18-0900' },
        { id: 6, hostname: 'Endpoint-06', os_name: 'Windows Server 2022 (Synthetic)', synthetic_ip: '10.0.1.15', status: 'ONLINE', risk_score: 28.0, last_seen: new Date().toISOString(), processes_json: [], isolation_details: {}, trusted_snapshot: 'Snapshot-2026-09-18-0900' },
        { id: 7, hostname: 'Endpoint-07', os_name: 'Ubuntu 24.04 LTS (Synthetic)', synthetic_ip: '10.0.1.16', status: 'SUSPICIOUS', risk_score: 68.0, last_seen: new Date().toISOString(), processes_json: [], isolation_details: {}, trusted_snapshot: 'Snapshot-2026-09-18-0900' },
        { id: 8, hostname: 'Endpoint-08', os_name: 'Debian 12 (Synthetic)', synthetic_ip: '10.0.1.17', status: 'ONLINE', risk_score: 10.0, last_seen: new Date().toISOString(), processes_json: [], isolation_details: {}, trusted_snapshot: 'Snapshot-2026-09-18-0900' }
      ]
    };
  }

  // 9. Incidents
  if (url.includes('/api/incidents')) {
    return {
      status: 200,
      data: {
        items: [
          { id: 1, incident_code: 'INC-2026-8801', title: 'Digital Labyrinth Trap Breach on Finance Share', severity: 'CRITICAL', status: 'INVESTIGATING', endpoint_id: 7, endpoint_hostname: 'Endpoint-07', detection_method: 'Honeypot Tripwire', risk_score: 92.0, confidence_score: 96.0, evidence_json: ['Direct canary payroll file accessed', 'Source IP Endpoint-07'], recommended_action: 'QUARANTINE', action_taken: 'SESSION_RESTRICTED', recovery_status: 'NOT_REQUIRED', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 2, incident_code: 'INC-2026-7742', title: 'Credential Stuffing Vector Intercepted', severity: 'HIGH', status: 'CONTAINED', endpoint_id: 4, endpoint_hostname: 'Endpoint-04', detection_method: 'Auth Anomaly Correlator', risk_score: 76.0, confidence_score: 88.0, evidence_json: ['18 failed attempts in 30s'], recommended_action: 'RESTRICT_SESSION', action_taken: 'IP_BLOCKED', recovery_status: 'NOT_REQUIRED', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 3, incident_code: 'INC-2026-5510', title: 'Synthetic Ransomware Canary Triggered & Auto-Recovered', severity: 'CRITICAL', status: 'RESOLVED', endpoint_id: 3, endpoint_hostname: 'Endpoint-03', detection_method: 'Self-Heal Correlator', risk_score: 94.0, confidence_score: 97.0, evidence_json: ['Snapshot rollback verified clean'], recommended_action: 'QUARANTINE_AND_RECOVER', action_taken: 'CONTAINED_AND_RECOVERED', recovery_status: 'RESTORED_VERIFIED', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        ],
        total: 3,
        page: 1,
        page_size: 10,
        total_pages: 1
      }
    };
  }

  // 10. Simulation Flagship Full Defense
  if (url.includes('/api/simulation/full-defense')) {
    const t = () => new Date().toLocaleTimeString();
    return {
      status: 200,
      data: {
        workflow_id: 'DEFENSE-FLOW-DEMO',
        total_steps: 16,
        success: true,
        incident_code: 'INC-2026-9901',
        target_endpoint: 'Endpoint-03',
        final_risk: 94.0,
        final_confidence: 97.0,
        execution_time_ms: 12.4,
        steps: [
          { step_number: 1, title: 'Abnormal Login Detected', status: 'COMPLETED', icon: 'LogIn', timestamp: t(), details: 'Off-hours interactive login session initiated at 03:14 AM.', evidence: 'login_hour=03:14 (baseline: 09:00 AM)' },
          { step_number: 2, title: 'Unrecognized Device Fingerprint', status: 'COMPLETED', icon: 'Laptop', timestamp: t(), details: 'Authentication originated from unrecognized synthetic hardware fingerprint.', evidence: 'Hardware signature mismatch' },
          { step_number: 3, title: 'Anomalous Mass File Enumeration', status: 'COMPLETED', icon: 'Files', timestamp: t(), details: '350 sensitive documents accessed in 180 seconds.', evidence: 'files_accessed=350 (baseline: 22)' },
          { step_number: 4, title: 'Suspicious Process Execution', status: 'COMPLETED', icon: 'Cpu', timestamp: t(), details: 'Unauthorized synthetic script execution: sim_exfil_worker.sh (PID 9104).', evidence: 'Unknown executable in temp' },
          { step_number: 5, title: 'Digital Labyrinth Decoy Tripwire Hit', status: 'COMPLETED', icon: 'Target', timestamp: t(), details: 'Attacker enumerated synthetic decoy resource fake-finance-share.', evidence: 'Canary token triggered' },
          { step_number: 6, title: 'ML Isolation Forest Anomaly Analysis', status: 'COMPLETED', icon: 'Sparkles', timestamp: t(), details: 'Local Isolation Forest evaluated session vector. Anomaly score: 0.892.', evidence: 'Multiple dimensions deviated' },
          { step_number: 7, title: 'Risk Engine Correlation & Scoring', status: 'COMPLETED', icon: 'Activity', timestamp: t(), details: 'Multi-signal correlation calculated Risk: 94/100, Confidence: 97%. Severity: CRITICAL.', evidence: 'Correlated 5 distinct vectors' },
          { step_number: 8, title: 'Policy Engine Rule Triggered', status: 'COMPLETED', icon: 'ShieldAlert', timestamp: t(), details: "Matched Policy: 'Auto Quarantine Critical Threats' (Risk >= 85 AND Confidence >= 90).", evidence: 'Enforcing action: QUARANTINE' },
          { step_number: 9, title: 'Endpoint Quarantine Imposed', status: 'COMPLETED', icon: 'Lock', timestamp: t(), details: 'Endpoint-03 transitioned from ONLINE -> QUARANTINED. Virtual network interface severed.', state_change: { endpoint: 'Endpoint-03', status: 'QUARANTINED' } },
          { step_number: 10, title: 'Digital Evidence Preserved', status: 'COMPLETED', icon: 'Archive', timestamp: t(), details: 'Memory snapshot, volatile socket table, and process memory frozen into evidence vault.', evidence: 'Digest: SHA256-SYNTH-88B1' },
          { step_number: 11, title: 'Automated Self-Heal Recovery Initiated', status: 'COMPLETED', icon: 'RefreshCw', timestamp: t(), details: 'Recovery engine initialized rollback procedure for Endpoint-03.', state_change: { endpoint: 'Endpoint-03', status: 'RECOVERING' } },
          { step_number: 12, title: 'Trusted Golden Snapshot Selected', status: 'COMPLETED', icon: 'HardDrive', timestamp: t(), details: "Selected immutable pre-infection baseline snapshot: 'Snapshot-2026-09-18-0900'.", evidence: 'Cryptographic snapshot signature verified' },
          { step_number: 13, title: 'System State Integrity Verified', status: 'COMPLETED', icon: 'CheckCircle', timestamp: t(), details: 'Restored file system and process registry verified against SHA-256 clean golden hash.', evidence: 'SHA-256 integrity status: PASSED' },
          { step_number: 14, title: 'Endpoint Certified Restored', status: 'COMPLETED', icon: 'ShieldCheck', timestamp: t(), details: 'Endpoint-03 transitioned from RECOVERING -> RECOVERED. Risk score reset to 12.0.', state_change: { endpoint: 'Endpoint-03', status: 'RECOVERED', risk: 12.0 } },
          { step_number: 15, title: 'Security Incident Resolved', status: 'COMPLETED', icon: 'Award', timestamp: t(), details: 'Incident INC-2026-9901 marked as RESOLVED. Mitigation cycle complete.', evidence: 'Total response resolved in < 15 seconds' },
          { step_number: 16, title: 'Immutable Audit Trail Committed', status: 'COMPLETED', icon: 'FileText', timestamp: t(), details: 'All actions, state transitions, and evidence hashes committed to append-only audit log.', evidence: 'Audit Record ID committed' }
        ]
      }
    };
  }

  // 11. Policies
  if (url.includes('/api/policies')) {
    return {
      status: 200,
      data: [
        { id: 1, name: 'Auto Quarantine Critical Threats', condition_risk_min: 85.0, condition_confidence_min: 90.0, trigger_event: 'ALL', action: 'QUARANTINE', is_active: true, description: 'Instantly sever virtual network adapter and quarantine endpoint if Risk >= 85 and Confidence >= 90%.', updated_by: 'Yashpreet Singh', updated_at: new Date().toISOString() },
        { id: 2, name: 'Restrict High Risk Sessions', condition_risk_min: 60.0, condition_confidence_min: 75.0, trigger_event: 'BEHAVIOR_ANOMALY', action: 'RESTRICT_SESSION', is_active: true, description: 'Enforce step-up MFA and restrict access privileges when risk exceeds 60.', updated_by: 'Yashpreet Singh', updated_at: new Date().toISOString() },
        { id: 3, name: 'Step-Up Verification on Medium Anomaly', condition_risk_min: 30.0, condition_confidence_min: 60.0, trigger_event: 'AUTH_ANOMALY', action: 'STEP_UP', is_active: true, description: 'Prompt user for biometric/hardware token verification upon anomalous off-hours access.', updated_by: 'Yashpreet Singh', updated_at: new Date().toISOString() },
        { id: 4, name: 'Allow Baseline Traffic', condition_risk_min: 0.0, condition_confidence_min: 0.0, trigger_event: 'ROUTINE', action: 'ALLOW', is_active: true, description: 'Allow all regular sessions that remain strictly within normal behavioral baselines.', updated_by: 'Yashpreet Singh', updated_at: new Date().toISOString() }
      ]
    };
  }

  // 12. Audit
  if (url.includes('/api/audit')) {
    return {
      status: 200,
      data: {
        items: [
          { id: 1, timestamp: new Date().toISOString(), username: 'AUTONOMOUS_SOC_AGENT', action: 'FULL_AUTONOMOUS_DEFENSE_COMPLETED', target: 'Endpoint-03', reason: 'Executed 16-step defense workflow. System restored and verified.', risk_score: 94.0, result: 'SUCCESS' },
          { id: 2, timestamp: new Date(Date.now() - 3600000).toISOString(), username: 'POLICY_ENGINE', action: 'ENDPOINT_QUARANTINED', target: 'Endpoint-07', reason: 'Honeypot intrusion tripwire exceeded confidence 95%', risk_score: 92.0, result: 'SUCCESS' },
          { id: 3, timestamp: new Date(Date.now() - 7200000).toISOString(), username: 'Yashpreet Singh', action: 'SYSTEM_INITIALIZED', target: 'SentinelX Core', reason: 'Platform booted with synthetic defensive test range', risk_score: 0.0, result: 'SUCCESS' }
        ],
        total: 3,
        page: 1,
        page_size: 15,
        total_pages: 1
      }
    };
  }

  // 13. Threat Intelligence
  if (url.includes('/api/threat-intelligence')) {
    return {
      status: 200,
      data: [
        { id: 1, indicator: '198.51.100.89', category: 'Credential Abuse', severity: 'HIGH', confidence: 94.0, first_seen: new Date(Date.now() - 864000000).toISOString(), last_seen: new Date().toISOString(), status: 'ACTIVE', source: 'SentinelX Synthetic Threat Lab' },
        { id: 2, indicator: 'paypa1-security.com', category: 'Phishing', severity: 'CRITICAL', confidence: 98.0, first_seen: new Date(Date.now() - 1728000000).toISOString(), last_seen: new Date().toISOString(), status: 'ACTIVE', source: 'Scam-Bait Automated Feed' },
        { id: 3, indicator: 'CANARY-SMB-TOKEN-09', category: 'Data Exfiltration Simulation', severity: 'CRITICAL', confidence: 99.5, first_seen: new Date(Date.now() - 2592000000).toISOString(), last_seen: new Date().toISOString(), status: 'ACTIVE', source: 'Digital Labyrinth Honey-Store' }
      ]
    };
  }

  // 14. Simulation Scenarios
  if (url.includes('/api/simulation/scenarios')) {
    return {
      status: 200,
      data: [
        { id: 'normal_user', name: 'Simulate Normal User', description: 'Simulates standard employee morning login, expected resource access envelope, and verified MFA.', category: 'Baseline', expected_risk: 'Low (12/100)' },
        { id: 'suspicious_login', name: 'Simulate Suspicious Login', description: 'Injects off-hours login at 03:14 AM from synthetic external IP with 4 failed attempts.', category: 'Authentication', expected_risk: 'Medium (58/100)' },
        { id: 'credential_anomaly', name: 'Simulate Credential Anomaly', description: 'Simulates brute-force credential stuffing spray across multiple synthetic accounts.', category: 'Credential Abuse', expected_risk: 'High (72/100)' },
        { id: 'honeypot_interaction', name: 'Simulate Honeypot Interaction', description: "Direct attacker interaction with Digital Labyrinth 'fake-finance-share' decoy canary file.", category: 'Deception Trap', expected_risk: 'Critical (92/100)' },
        { id: 'process_anomaly', name: 'Simulate Process Anomaly', description: 'Executes anomalous synthetic background process with elevated CPU consumption.', category: 'EDR Process', expected_risk: 'High (78/100)' },
        { id: 'phishing', name: 'Simulate Phishing', description: 'Ingests malicious lure email attempting credential harvesting and domain spoofing.', category: 'Email Security', expected_risk: 'High (82/100)' },
        { id: 'critical_incident', name: 'Simulate Critical Incident', description: 'Correlates multi-stage synthetic ransomware infiltration with high entropy changes.', category: 'Breach Infiltration', expected_risk: 'Critical (89/100)' }
      ]
    };
  }

  // 15. Phishing Samples & Analyze
  if (url.includes('/api/phishing/samples')) {
    return {
      status: 200,
      data: [
        { id: 'sample_1', title: 'High-Risk Urgent Credential Phish', sender: 'security-update@paypa1-security.com', subject: 'FINAL WARNING: Your Corporate Account Suspended in 24 Hours', body: 'URGENT ACTION REQUIRED: Please enter password and confirm one-time passcode at: https://paypa1-security.com/auth-verify to preserve your access.' },
        { id: 'sample_2', title: 'Executive Impersonation (CEO Wire Transfer)', sender: 'ceo.corporate.alert@gmail.com', subject: 'Confidential: Urgent wire transfer required today', body: 'Hi, I am in a board meeting. Please process an urgent wire transfer of $45,000 for vendor Q3 milestone payment immediately. Follow link: http://198.51.100.22/invoice-payment.' },
        { id: 'sample_3', title: 'Clean Operational Email (Baseline Safe)', sender: 'calendar-notifications@company.com', subject: 'Sprint Planning: Cyber Defense Platform 2026', body: 'Hi team, reminder for our upcoming Sprint 4 planning session scheduled for tomorrow at 10:00 AM.' }
      ]
    };
  }
  if (url.includes('/api/phishing/analyze')) {
    const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const bodyStr = `${data?.sender || ''} ${data?.subject || ''} ${data?.body || ''}`.toLowerCase();
    const isPhish = bodyStr.includes('urgent') || bodyStr.includes('password') || bodyStr.includes('paypa1') || bodyStr.includes('http://');
    return {
      status: 200,
      data: {
        classification: isPhish ? 'HIGH_RISK' : 'SAFE',
        risk_score: isPhish ? 88.0 : 12.0,
        confidence_score: isPhish ? 94.0 : 75.0,
        indicators_found: isPhish ? ['Urgency & Coercion Markers', 'Credential Harvesting Lure', 'Direct IP / Deceptive URL Structure'] : [],
        reasons: isPhish ? ['Psychological urgency coercion detected', 'Credential solicitation detected', 'Non-standard URL pattern detected'] : ['Clean synthetic message profile.'],
        recommended_action: isPhish ? 'QUARANTINE' : 'ALLOW',
        synthetic_threat_signature: 'PHISH-SYNTH-2026-X9'
      }
    };
  }

  // 16. Health
  if (url.includes('/api/health')) {
    return {
      status: 200,
      data: {
        status: 'HEALTHY',
        engines: {
          detection_engine: 'ONLINE',
          risk_engine: 'ONLINE',
          policy_engine: 'ONLINE',
          response_engine: 'ONLINE',
          recovery_engine: 'ONLINE'
        },
        author: 'Yashpreet Singh',
        year: 2026
      }
    };
  }

  return null;
};
