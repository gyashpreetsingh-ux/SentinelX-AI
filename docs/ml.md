# SentinelX AI — Machine Learning & Anomaly Detection Specification

**Author**: Yashpreet Singh (2026)  
**Platform**: SentinelX AI — Next-Gen Autonomous Cyber Defense Platform

---

## 1. Local Machine Learning Philosophy
Unlike traditional cybersecurity systems that transmit sensitive enterprise data to external third-party LLM APIs, **SentinelX AI** runs entirely on-premise/locally using scikit-learn. No employee telemetry, keystrokes, or logs ever escape the controlled environment.

---

## 2. Model Architecture: Isolation Forest
Anomalous events in cybersecurity are rare and distinct. The **Isolation Forest** algorithm isolates anomalies by randomly selecting a feature and randomly selecting a split value between the maximum and minimum values of the selected feature.

- **Estimators**: 150 Decision Trees
- **Contamination Factor**: 0.03 (3% expected anomaly prior in clean synthetic training set)
- **Random State**: 42 (Reproducible seed)
- **Max Samples**: Automatic subsampling

---

## 3. Feature Vectors (10 Dimensions)
1. `login_hour`: Fractional hour of the day (e.g. 9.25 = 09:15 AM). Normal baseline: 09:00 AM (± 1.2 hrs).
2. `session_duration`: Duration of interactive session in hours. Normal: 7.5 hrs.
3. `files_accessed`: Number of files touched per observation period. Normal: 22 files.
4. `failed_logins`: Preceding failed authentication attempts. Normal: 0–1.
5. `new_device`: Binary indicator (0.0 = known hardware fingerprint, 1.0 = unrecognized synthetic asset).
6. `resource_access_rate`: Requests per second. Normal: ~1.2 req/s.
7. `typing_deviation`: Keystroke dynamics variance relative to personal baseline (0.0 to 1.0). Normal: 0.12.
8. `mouse_deviation`: Mouse velocity and curvature deviation (0.0 to 1.0). Normal: 0.14.
9. `network_activity`: Data egress/ingress in megabytes. Normal: ~25 MB.
10. `honeypot_interaction`: Binary canary hit indicator (0.0 = clean, 1.0 = decoy breached).

---

## 4. Explainable AI (XAI) Attribution
For every anomaly flagged by Isolation Forest, SentinelX AI calculates:
- Normalized score: `[0.0, 1.0]`
- Feature-level Z-Score deviations: \(\Delta = \frac{x - \mu}{\sigma}\)
- Human-readable natural language justifications explaining exactly which dimensions contributed to the risk score.

---

© 2026 Yashpreet Singh. SentinelX AI — Autonomous Cyber Defense Platform.
