import { Incident, InvestigationResult, PreventiveAction, UserSession } from '../types';

export const CURRENT_USER: UserSession = {
  userId: 'usr-sarah-k',
  name: 'Sarah K.',
  role: 'Lead Investigator',
  email: 's.k@tracemind.lab',
  organizationId: 'lab-ops-01',
};

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-2024-089',
    title: 'Centrifuge C-3 Rotor Vibration Exceeded Safe Threshold',
    category: 'Laboratory Equipment & Biosafety',
    intakeProtocol: 'lab_equip',
    severity: 'critical',
    location: 'Bio-Tech Annex, Lab Room 204-B',
    timestamp: 'Today, 10:45 AM',
    downtimeHours: 5.5,
    impactClassification: 'Sample Loss & Protocol Delayed (> 4 hrs work backlog created)',
    description:
      'During high-speed centrifugation (12,000 RPM) of clinical trial samples, the emergency vibration sensor tripped and automatic brake engaged. Rotor was balanced within standard +/- 0.05g tolerance before cycle. Similar wobble noted last Tuesday.',
    status: 'investigating',
    evidence: [
      {
        id: 'art-01',
        name: 'rotor_spindle_photo.jpg',
        type: 'image',
        sizeFormatted: '1.8 MB',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQR7p-ZvDjbQzrRfDI7KLpQf1zTZ0IHF38yHBxD6x_bgkJ86Xk7oVNflEqDWUadaRVVWcc_Cjl8kvK49hYXkiyqLNDiBvYNxLwm7kmZA5Z12UCIlaGWnXw9BSujNmTUqketxTV88GZK7QIxqXSoDxWPwsDYv3O2JNk0xUTs_6h6EnJbCH0m-eZseAjQlGuHMD7btou_yYrGeOHPIL-wCcRh3q96os2TWlNI3Ww7YhCyBvKjZaRcVywQw',
        summary: 'High precision diagnostic close-up of brushed steel centrifuge spindle shaft showing micro-wear marks under inspection LED lighting.',
      },
      {
        id: 'art-02',
        name: 'sensor_telemetry_apr24.csv',
        type: 'csv',
        sizeFormatted: '3,400 data points synced',
        summary: 'Continuous 100Hz vibration accelerometer trace capturing excursion above 3.5 mm/s safe limit to 4.28 mm/s peak trip point.',
      },
    ],
    telemetrySnapshot: {
      sensorId: 'AXIS-Z-MOTOR',
      peakValue: 4.28,
      unit: 'mm/s',
      baseline: 0.8,
      safeLimit: 3.5,
      rpm: 11850,
      dataPointsCount: 3400,
    },
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    createdBy: 'Sarah K.',
    organizationId: 'lab-ops-01',
  },
  {
    id: 'INC-2024-084',
    title: 'Subnet Switch Packet Drop & Gateway Desync',
    category: 'IT Network & Sensor Stream',
    intakeProtocol: 'it_outage',
    severity: 'medium',
    location: 'IT Core Rack 2, Server Room 102',
    timestamp: 'Today, 08:30 AM',
    downtimeHours: 0.8,
    impactClassification: 'Minor Delay (< 1 hr), complete sample preservation',
    description:
      'Transient 800ms packet flood on core VLAN 14 caused secondary telemetry broker disconnect. Automated warm failover engaged after 4 retries.',
    status: 'resolved',
    evidence: [
      {
        id: 'art-03',
        name: 'vlan_port_dump.json',
        type: 'json',
        sizeFormatted: '412 KB',
        summary: 'Wireshark packet capture showing CRC error bursts on port Gi0/24.',
      },
    ],
    resolvedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    createdBy: 'Marcus T.',
    organizationId: 'lab-ops-01',
  },
  {
    id: 'INC-2024-079',
    title: 'Chiller Unit Coolant Leakage & Temperature Spike',
    category: 'HVAC & Ambient Environmental Control',
    intakeProtocol: 'lab_equip',
    severity: 'high',
    location: 'HVAC Sub-3, Basement Utility Core',
    timestamp: 'Yesterday, 14:15 PM',
    downtimeHours: 3.2,
    impactClassification: 'Environmental deviation (lab exceeded 24°C upper operating limit for 48 min)',
    description:
      'Coolant loop pressure dropped below 2.2 bar due to o-ring seal creep. Ambient temperature in Bio-Safety Lab 3 climbed to 24.6°C before tertiary chiller was engaged.',
    status: 'investigating',
    evidence: [
      {
        id: 'art-04',
        name: 'chiller_pressure_chart.png',
        type: 'image',
        sizeFormatted: '2.1 MB',
        summary: 'SCADA pressure decay timeline showing pressure loss rate of -0.4 bar/hr.',
      },
    ],
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    createdBy: 'David P.',
    organizationId: 'lab-ops-01',
  },
  {
    id: 'INC-2024-071',
    title: 'Autoclave Thermal Valve Overheat & Cyclic Fatigue',
    category: 'Laboratory Equipment & Biosafety',
    intakeProtocol: 'safety_bio',
    severity: 'critical',
    location: 'Zone: Lab B-04 Sterilization Bay',
    timestamp: '3 days ago',
    downtimeHours: 7.0,
    impactClassification: 'Sterilization queue backed up 18 hours',
    description:
      'Pressure relief valve PRV-04 failed to seat fully during post-cycle exhaust, triggering safety pressure interlock. Causal engine matched 3 past anomalies.',
    status: 'investigating',
    evidence: [],
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
    createdBy: 'Elena R.',
    organizationId: 'lab-ops-01',
  },
];

export const INITIAL_PREVENTIVE_ACTIONS: PreventiveAction[] = [
  {
    id: 'CAPA-2024-001',
    incidentId: 'INC-2024-089',
    title: 'Emergency overhaul and replacement of lower spindle bearing assembly',
    description:
      'Disassemble motor housing, clean stator shaft, and press-fit replacement ceramic hybrid bearing race (Lot #SP-8820-K or verified alternate).',
    priority: 'P1 - Critical',
    status: 'proposed',
    responsibleRole: 'Sr. Equipment Maintenance Specialist (M. Vance)',
    suggestedDeadline: 'Within 48h (Apr 26)',
    verificationMethod: 'Laser alignment & 15-min vibration burn-in @ 13,000 RPM',
    reason: 'Eliminate primary source of harmonic oscillation before catastrophic stator spindle galling occurs.',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'CAPA-2024-002',
    incidentId: 'INC-2024-089',
    title: 'Implement automated 200-hour telemetry vibration drift alerts in SCADA',
    description:
      'Configure automated anomaly rule in telemetry ingestion pipeline to flag RMS acceleration drift exceeding 2.5 mm/s sustained for >10 seconds.',
    priority: 'P2 - High',
    status: 'approved',
    responsibleRole: 'Lab Systems Admin',
    suggestedDeadline: 'Due: May 05, 2024',
    verificationMethod: 'Synthetic alert injection test with recorded CSV waveform',
    reason: 'Early detection of bearing wear before emergency brake trip threshold is breached during active sample centrifugation.',
    approvedBy: 'Sarah K.',
    approvedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'CAPA-2024-003',
    incidentId: 'INC-2024-089',
    title: 'Update Standard Operating Procedure (SOP-LAB-014) for rotor pre-balancing',
    description:
      'Revise digital checklist to mandate dual-tare scale verification printout attachment to run batch sheet.',
    priority: 'P3 - Moderate',
    status: 'approved',
    responsibleRole: 'Quality Assurance Officer',
    suggestedDeadline: 'Due: May 12, 2024',
    verificationMethod: 'Staff digital quiz & training sign-off',
    reason: 'Prevent human operator imbalance errors from confounding mechanical vibration diagnostics.',
    approvedBy: 'Dr. M. Vance',
    approvedAt: new Date(Date.now() - 1800 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'CAPA-2024-004',
    incidentId: 'INC-2024-071',
    title: 'Recalibrate pressure relief sensor PRV-04 and replace Viton seat',
    description:
      'Perform pneumatic pressure pop test and lap valve seat to restore gas-tight seal under 134°C steam autoclaving.',
    priority: 'P1 - Critical',
    status: 'proposed',
    responsibleRole: 'Lab Tech Lead (Dr. M. Vance)',
    suggestedDeadline: 'Due: In 2 Days',
    verificationMethod: 'Hydrostatic pressure decay test at 3.5 bar for 30 minutes',
    reason: 'Eliminate recurrent autoclave overpressure shutdown alerts.',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'CAPA-2024-005',
    incidentId: 'INC-2024-079',
    title: 'Update chemical fume hood shutdown protocol & chiller backup swap',
    description:
      'Standardize valve changeover schedule and wire emergency coolant flow interlock directly into alarm annunciator.',
    priority: 'P2 - High',
    status: 'proposed',
    responsibleRole: 'Facilities Safety Board',
    suggestedDeadline: 'Due: Apr 28',
    verificationMethod: 'Simulated coolant loss failover drill',
    reason: 'Prevent secondary ambient temperature excursions in sensitive cleanrooms.',
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
  },
];

export const INITIAL_INVESTIGATION: InvestigationResult = {
  incidentId: 'INC-2024-089',
  investigatedAt: '2 hrs ago',
  modelUsed: 'TraceMind v4.2 / Gemini 3.8 Flash',
  confidenceScore: 89,
  confidenceLimitation:
    'Score reflects telemetry waveform correlation against 342 historical maintenance logs. It does not replace metallurgical physical disassembly or vibration spectrum sign-off by a certified engineer.',
  epistemicTiers: {
    confirmedFacts: [
      {
        id: 'fact-1',
        text: 'Vibration breached 4.28 mm/s trip limit at 11,850 RPM right before active trip command was triggered.',
        source: 'TELEMETRY: SENSOR_ACCEL_RMS#3',
        sourceType: 'telemetry',
      },
      {
        id: 'fact-2',
        text: 'Pre-run balance verification passed: Dual-bucket load delta logged at 0.02g (tolerance threshold is ±0.15g).',
        source: 'LOG: BALANCE_SCALE_AUTO_LOG',
        sourceType: 'log',
      },
      {
        id: 'fact-3',
        text: 'Drive shaft spindle replaced 4 months ago during routine preventive overhaul (WO #88219).',
        source: 'ERP: PM-RECORD-Q3',
        sourceType: 'erp',
      },
    ],
    supportingEvidence: [
      {
        id: 'ev-1',
        text: 'Accelerometer harmonic curve matches signature of verified failure #INC-2023-112 with a 94% Pearson correlation.',
        metric: 'Pearson r = 0.94',
        correlationScore: 94,
      },
      {
        id: 'ev-2',
        text: 'Drive shaft spindle replaced 4 months ago, matching localized mechanical wear incubation curves after ~1,400 hours continuous duty.',
        metric: '1,420 operating hours',
        correlationScore: 88,
      },
    ],
    aiHypotheses: [
      {
        id: 'hyp-1',
        title: 'Dynamic bearing race galling secondary to ambient thermal excursions',
        mechanism: 'Harmonic resonance triggered by localized micro-spalling under high-G centrifugal stress.',
        confidence: 78,
        severity: 'high',
      },
      {
        id: 'hyp-2',
        title: 'Vibration isolator table misalignment following bench realignment',
        mechanism: 'Uneven dampening following recent bench realignment and laboratory floor buffing.',
        confidence: 22,
        severity: 'moderate',
      },
    ],
    dataGapsAndUncertainty: [
      {
        id: 'gap-1',
        description: 'Lubrication temperature log missing: motor housing RTD sensor logged offline 12 days prior; temp gradient unavailable.',
        impact: 'High uncertainty regarding whether insufficient lubricant viscosity exacerbated bearing race spalling.',
        suggestedAction: 'REQUEST SCADA HISTORIAN RESCAN & RTD SENSOR RE-TEST',
      },
      {
        id: 'gap-2',
        description: 'Contractor torque-spec signoff pending for drive clamp fastener bolts.',
        impact: 'Cannot rule out minor asymmetric clamping force during last month overhaul.',
        suggestedAction: 'AWAIT THIRD-PARTY MAINTENANCE TORQUE CALIBRATION CERTIFICATE',
      },
    ],
  },
  rootCauses: [
    {
      id: 'rc-1',
      rank: 1,
      title: 'Spindle Bearing Micro-wear & Galling',
      probability: 78,
      severityTier: 'high',
      supportingEvidence:
        'Harmonic vibration profile matches rapid mechanical spalling at 11,800 RPM. Synchronous cross-axis vibration signature indicates localized race degradation rather than rotor unbalance.',
      epistemicUncertainty:
        'Model inference relies on frequency harmonics from single axis. Physical housing teardown is mandated to verify localized surface pitting.',
      isPrimary: true,
    },
    {
      id: 'rc-2',
      rank: 2,
      title: 'Vibration Isolator Table Misalignment',
      probability: 22,
      severityTier: 'moderate',
      supportingEvidence:
        'Table elastomeric displacement was 1.8mm following recent bench realignment, but low harmonic frequencies do not explain the sharp 11.85k RPM spike.',
      epistemicUncertainty:
        'Displacement is sub-threshold at 1.8mm elastomeric compression; low probability as primary cause.',
      isPrimary: false,
    },
  ],
  historicalMatches: [
    {
      incidentId: 'INC-2023-112',
      title: 'Centrifuge B-2 Bearing Seizure during RPM Ramp',
      timeAgo: '14 mos ago',
      matchScore: 94,
      similarityReason:
        'Identical bearing race harmonic frequency spike at 11,800 RPM in the same equipment class (Centrifuge B-2), occurring after >1,200 operating hours.',
      historicalResolution:
        'Prevented full stator burn-out by replacing lower bearing race within 48h. Rotor undamaged.',
    },
    {
      incidentId: 'INC-2023-045',
      title: 'Autoclave Rotary Pump Harmonic Oscillation',
      timeAgo: '19 mos ago',
      matchScore: 68,
      similarityReason:
        'Similar high-frequency acoustic chatter detected in rotary assembly prior to trip.',
      historicalResolution: 'Resolved via dampener gasket replacement and realignment.',
    },
  ],
  diagnosticChecklist: [
    {
      id: 'diag-1',
      title: '1. Perform manual spindle spin test without rotor mounted',
      description: 'Isolate acoustic friction from aeromechanical rotor drag.',
      completed: false,
      limitationNotice:
        'Score reflects telemetry waveform correlation against 342 historical maintenance logs. It does not replace metallurgical physical disassembly or vibration spectrum sign-off by a certified engineer.',
    },
    {
      id: 'diag-2',
      title: '2. Extract motor bearing thermal logs from facility SCADA',
      description: 'Audit heat spike timeline in the 48-hour ramp window.',
      completed: false,
      limitationNotice:
        'Score reflects telemetry waveform correlation against 342 historical maintenance logs. It does not replace metallurgical physical disassembly or vibration spectrum sign-off by a certified engineer.',
    },
    {
      id: 'diag-3',
      title: '3. Query supplier batch serial number for defect alerts',
      description: 'Check vendor database for batch lot #SP-8820-K.',
      completed: false,
    },
  ],
  customNotes: [],
  aiAnalysisStatus: 'completed',
  auditHash: 'tm_7f9b8c2d1e0a4f56e9c4',
};
