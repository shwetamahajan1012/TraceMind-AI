# TraceMind AI

> **"Learn from every failure. Prevent the next one."**

TraceMind AI is a full-stack, enterprise-grade incident investigation and recurrence prevention platform engineered for IT infrastructure teams, laboratory maintenance departments, and high-reliability operational facilities.

---

## 🔬 Core Capabilities & Workflow

TraceMind AI implements a complete 11-step end-to-end incident investigation and failure-prevention lifecycle:

1. **New Incident Telemetry Intake**: Operators log operational disruptions with structured hardware identifiers, classification domain, criticality tiers (Low, Medium, High, Critical), downtime estimates, and diagnostic attachments (.CSV vibration dumps, optical inspection photos).
2. **Real-Time NLP Pre-Scan**: Analyzes narrative text in real-time to isolate recurrence keywords (*"similar wobble"*, *"repeated spike"*).
3. **Evidence-Based AI Investigation**: Server-side Gemini 3.8 Flash model synthesizes telemetry waveforms and organizational maintenance records.
4. **Epistemic Tiers Separation**: Strictly segregates evidence into:
   - **Tier 1: Confirmed Facts** (measured sensor metrics, balance log deltas).
   - **Tier 2: Supporting Evidence** (Pearson correlation scores, overhaul incubation timeline).
   - **Tier 3: AI Hypotheses** (inferred mechanical spalling, thermal harmonic resonance).
   - **Tier 4: Alternative Explanations & Gaps** (isolator drift ruled out, missing SCADA RTD logs).
5. **Deterministic Recurrence Risk Engine (v4.2)**: A mathematical algorithm calculates a bounded [0–100] recurrence risk score based on:
   - Component Age Past Recommended Spindle Hours (Weight: 35%)
   - Historical Failure Recurrence & MTBF Degradation (Weight: 40%)
   - Ambient Operational Stress & Thermal Excursions (Weight: 25%)
6. **Actionable Preventive Recommendations (CAPA)**: Translates root causes into prioritized corrective and preventive action tickets with verification methods, responsible roles, and deadlines.
7. **Human-in-the-Loop Governance**: Automated AI proposals cannot unilaterally self-approve; authorized operators and safety leads approve, edit, reject, complete, and sign-off on actions.
8. **What-If Strategy Simulator**: Compares multi-tier intervention paths (Full Mechanical Overhaul vs. Predictive Telemetry Alerts vs. Status Quo), projecting net risk reduction, avoided downtime costs, and trade-offs.
9. **Organizational Memory & Vector Match**: Surfaces past identical equipment failures (e.g. Centrifuge B-2 with 94% Pearson correlation) and historical resolutions.
10. **Tamper-Evident Cryptographic Audit Logging**: Every incident creation, status transition, and AI investigation is hashed into a sequential SHA-256 hash chain for regulatory auditability.
11. **Real Operational Analytics**: High-level KPI dashboards derived directly from actual recorded incidents and verified actions.

---

## 🛡️ Security Architecture

- **Zero Client Secret Exposure**: `GEMINI_API_KEY` is exclusively accessed server-side via `process.env.GEMINI_API_KEY`. No API keys or tokens are exposed to the client or in Vite bundles.
- **Defensive AI Engineering**: System instructions are strictly separated from user-provided incident text to defend against prompt injection. AI output is strictly validated against a typed JSON schema before rendering.
- **Input Sanitization & Payload Boundaries**: Server enforces strict payload size limits (10MB max), string length boundaries, and type validation on all incoming API routes.
- **Tamper-Evident SHA-256 Hash Chaining**: Every lifecycle event creates an immutable audit log entry chained to the preceding event hash.
- **Role-Based Authorization**: Endpoints verify session tokens and role-based authority (Operator, Lead Investigator, Quality & Safety Lead, Facilities Admin).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, Material Symbols Outlined
- **Backend**: Node.js, Express, tsx
- **AI Integration**: `@google/genai` (Gemini 3.8 Flash)
- **Testing**: Vitest automated test suite

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js >= 18
- npm or bun

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Ensure `GEMINI_API_KEY` is configured:
```env
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```
*(Note: If no API key is provided, the application gracefully operates in deterministic rule-based fallback mode).*

### 3. Run Automated Tests
```bash
npm test
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 📊 Automated Test Coverage

The test suite validates:
- **Unit Tests**:
  - Deterministic risk engine score bounding (0 - 100)
  - Factor-level point contributions (Age: 35%, MTBF: 40%, Stress: 25%)
  - What-If strategy calculation logic and downtime avoidance estimation
  - Cryptographic SHA-256 audit chaining and tamper detection
- **Security & Workflow Tests**:
  - Criticality tier validation
  - Strict CAPA state machine transitions (`proposed` -> `approved` -> `completed` -> `verified`)
  - Input length sanitization

---

## 📄 License
Apache-2.0
