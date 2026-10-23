/**
 * TraceMind AI - Core Domain Types
 */

export type CriticalityTier = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'open' | 'investigating' | 'mitigated' | 'resolved' | 'closed';
export type IntakeProtocol = 'lab_equip' | 'it_outage' | 'safety_bio';

export interface Incident {
  id: string; // e.g. "INC-2024-089"
  title: string;
  category: string;
  intakeProtocol: IntakeProtocol;
  severity: CriticalityTier;
  location: string;
  timestamp: string; // ISO string or human string
  downtimeHours: number;
  impactClassification: string;
  description: string;
  status: IncidentStatus;
  evidence: IncidentArtifact[];
  telemetrySnapshot?: {
    sensorId: string;
    peakValue: number;
    unit: string;
    baseline: number;
    safeLimit: number;
    rpm?: number;
    dataPointsCount?: number;
  };
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  organizationId: string;
}

export interface IncidentArtifact {
  id: string;
  name: string;
  type: 'image' | 'csv' | 'json' | 'log';
  sizeBytes?: number;
  sizeFormatted?: string;
  url?: string;
  summary?: string;
}

export interface EpistemicTriad {
  confirmedFacts: Array<{
    id: string;
    text: string;
    source: string;
    sourceType: 'telemetry' | 'log' | 'operator' | 'erp';
  }>;
  supportingEvidence: Array<{
    id: string;
    text: string;
    metric?: string;
    correlationScore?: number;
  }>;
  aiHypotheses: Array<{
    id: string;
    title: string;
    mechanism: string;
    confidence: number; // 0 - 100
    severity: 'low' | 'moderate' | 'high' | 'critical';
  }>;
  dataGapsAndUncertainty: Array<{
    id: string;
    description: string;
    impact: string;
    suggestedAction: string;
  }>;
}

export interface RootCauseHypothesis {
  id: string;
  rank: number;
  title: string;
  probability: number; // 0 - 100
  severityTier: 'low' | 'moderate' | 'high' | 'critical';
  supportingEvidence: string;
  epistemicUncertainty: string;
  isPrimary?: boolean;
}

export interface HistoricalMatch {
  incidentId: string;
  title: string;
  timeAgo: string;
  matchScore: number; // 0 - 100
  similarityReason: string;
  historicalResolution: string;
}

export interface DiagnosticCheckItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  limitationNotice?: string;
  completedAt?: string;
}

export interface InvestigationResult {
  incidentId: string;
  investigatedAt: string;
  modelUsed: string;
  confidenceScore: number;
  confidenceLimitation: string;
  epistemicTiers: EpistemicTriad;
  rootCauses: RootCauseHypothesis[];
  historicalMatches: HistoricalMatch[];
  diagnosticChecklist: DiagnosticCheckItem[];
  customNotes?: string[];
  aiAnalysisStatus: 'completed' | 'insufficient_evidence' | 'fallback_mode';
  auditHash: string;
}

export interface RiskFactorContribution {
  name: string;
  code: string;
  weightPercent: number; // e.g. 35
  scoreContribution: number; // points added e.g. +42
  maxPoints: number;
  details: string;
  severityLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface RecurrenceRiskAssessment {
  incidentId: string;
  score: number; // 0 - 100
  riskCategory: 'low' | 'moderate' | 'high' | 'critical';
  predictedWindowDays: { min: number; max: number };
  trendVsBaselinePercent: number;
  confidencePercent: number;
  factors: RiskFactorContribution[];
  explanation: string;
  assumptions: string[];
  calculatedAt: string;
  algorithmVersion: string;
}

export type ActionStatus = 'proposed' | 'approved' | 'in_progress' | 'completed' | 'verified' | 'rejected';
export type ActionPriority = 'P1 - Critical' | 'P2 - High' | 'P3 - Moderate' | 'P4 - Low';

export interface PreventiveAction {
  id: string;
  incidentId: string;
  title: string;
  description: string;
  priority: ActionPriority;
  status: ActionStatus;
  responsibleRole: string;
  suggestedDeadline: string;
  verificationMethod: string;
  reason: string;
  approvedBy?: string;
  approvedAt?: string;
  completedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface WhatIfStrategy {
  id: string;
  name: string;
  description: string;
  estimatedCostUsd: number;
  expectedDowntimeHours: number;
  projectedRiskReductionPercent: number; // e.g. 87%
  projectedResidualRiskScore: number; // e.g. 11
  avoidedDowntimeCostUsd: number;
  netBenefitUsd: number;
  assumptions: string[];
  advantages: string[];
  disadvantages: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    role: string;
    email: string;
  };
  action: string;
  entityType: 'incident' | 'investigation' | 'preventive_action' | 'risk_assessment';
  entityId: string;
  details: string;
  prevHash: string;
  hash: string;
}

export interface UserSession {
  userId: string;
  name: string;
  role: 'Operator' | 'Lead Investigator' | 'Quality & Safety Lead' | 'Facilities Admin';
  email: string;
  organizationId: string;
}
