import { describe, it, expect } from 'vitest';
import { calculateRecurrenceRisk, RISK_WEIGHTS, RISK_THRESHOLDS } from '../utils/riskEngine';
import { Incident } from '../types';

const baseTestIncident: Incident = {
  id: 'INC-TEST-001',
  title: 'Test Centrifuge Vibration',
  category: 'Laboratory Equipment & Biosafety',
  intakeProtocol: 'lab_equip',
  severity: 'critical',
  location: 'Lab Room 204-B',
  timestamp: 'Just now',
  downtimeHours: 4.5,
  impactClassification: 'Protocol Delayed',
  description: 'Centrifuge vibration trip detected at 12,000 RPM.',
  status: 'open',
  evidence: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'Tester',
  organizationId: 'lab-ops-01',
};

describe('Deterministic Risk Engine (Feature D)', () => {
  it('produces bounded score between 0 and 100 for high stress parameters', () => {
    const result = calculateRecurrenceRisk({
      incident: baseTestIncident,
      historicalRecurrenceCount: 3,
      unresolvedRootCause: true,
      actions: [],
      operatingHoursRatio: 1.35,
      thermalExcursionsCount: 8,
    });

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.riskCategory).toBe('critical');
    expect(result.factors.length).toBe(3);
  });

  it('bounds minimum score cleanly to 0 when all actions are verified and baseline is low', () => {
    const lowIncident: Incident = {
      ...baseTestIncident,
      severity: 'low',
      status: 'resolved',
    };

    const result = calculateRecurrenceRisk({
      incident: lowIncident,
      historicalRecurrenceCount: 0,
      unresolvedRootCause: false,
      actions: [
        {
          id: 'CAPA-1',
          incidentId: lowIncident.id,
          title: 'Action 1',
          description: '',
          priority: 'P1 - Critical',
          status: 'verified',
          responsibleRole: 'Lead',
          suggestedDeadline: 'Now',
          verificationMethod: 'Test',
          reason: 'Fixed',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'CAPA-2',
          incidentId: lowIncident.id,
          title: 'Action 2',
          description: '',
          priority: 'P2 - High',
          status: 'verified',
          responsibleRole: 'Lead',
          suggestedDeadline: 'Now',
          verificationMethod: 'Test',
          reason: 'Fixed',
          createdAt: new Date().toISOString(),
        },
      ],
      operatingHoursRatio: 0.5,
      thermalExcursionsCount: 0,
    });

    expect(result.score).toBe(0);
    expect(result.riskCategory).toBe('low');
  });

  it('computes documented weight proportions and factor contributions accurately', () => {
    expect(RISK_WEIGHTS.COMPONENT_AGE).toBe(0.35);
    expect(RISK_WEIGHTS.HISTORICAL_MTBF).toBe(0.40);
    expect(RISK_WEIGHTS.OPERATIONAL_STRESS).toBe(0.25);
    expect(RISK_WEIGHTS.COMPONENT_AGE + RISK_WEIGHTS.HISTORICAL_MTBF + RISK_WEIGHTS.OPERATIONAL_STRESS).toBe(1.0);

    const result = calculateRecurrenceRisk({
      incident: baseTestIncident,
      historicalRecurrenceCount: 1,
      unresolvedRootCause: true,
      actions: [],
      operatingHoursRatio: 1.18,
      thermalExcursionsCount: 6,
    });

    const ageFactor = result.factors.find((f) => f.code === 'SP-104');
    const stressFactor = result.factors.find((f) => f.code === 'HVAC-Z-B');
    const histFactor = result.factors.find((f) => f.code === 'HIST-MTBF');

    expect(ageFactor).toBeDefined();
    expect(stressFactor).toBeDefined();
    expect(histFactor).toBeDefined();

    expect(ageFactor?.scoreContribution).toBe(42);
    expect(stressFactor?.scoreContribution).toBe(26);
    expect(histFactor?.scoreContribution).toBe(16);
  });

  it('determines correct predicted recurrence window based on score', () => {
    const criticalResult = calculateRecurrenceRisk({
      incident: baseTestIncident,
      historicalRecurrenceCount: 2,
      unresolvedRootCause: true,
      actions: [],
    });
    expect(criticalResult.predictedWindowDays.min).toBe(3);
    expect(criticalResult.predictedWindowDays.max).toBe(14);
  });
});
