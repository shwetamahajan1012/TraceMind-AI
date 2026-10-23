/**
 * TraceMind AI - What-If Strategy Simulator
 *
 * Deterministically calculates projected risk reduction, downtime impact,
 * and cost trade-offs between preventive strategies.
 */

import { WhatIfStrategy } from '../types';

export function getPresetStrategies(initialRiskScore: number): WhatIfStrategy[] {
  // Downtime cost model based on standard lab / IT production line: ~$2,500/hr downtime
  const HOURLY_DOWNTIME_COST = 2500;

  // Strategy 1: Full Spindle & Bearing Overhaul + Sensor Ring (Comprehensive CAPA)
  const s1Reduction = 0.87; // 87% mitigation
  const s1ResidualRisk = Math.max(5, Math.round(initialRiskScore * (1 - s1Reduction)));
  const s1Cost = 4200;
  const s1DowntimeHours = 4.0;
  // If baseline unaddressed downtime risk is 8 hours:
  const s1AvoidedHours = Math.max(0, 10 - s1DowntimeHours);
  const s1AvoidedCost = s1AvoidedHours * HOURLY_DOWNTIME_COST;

  // Strategy 2: Automated 200-Hour SCADA Vibration Telemetry Alerting Only (Predictive Software)
  const s2Reduction = 0.55;
  const s2ResidualRisk = Math.max(10, Math.round(initialRiskScore * (1 - s2Reduction)));
  const s2Cost = 1200;
  const s2DowntimeHours = 1.0;
  const s2AvoidedHours = Math.max(0, 6 - s2DowntimeHours);
  const s2AvoidedCost = s2AvoidedHours * HOURLY_DOWNTIME_COST;

  // Strategy 3: Status Quo (Run to Fail / Standard Periodic Visual Check)
  const s3Cost = 0;
  const s3DowntimeHours = 18.0;

  return [
    {
      id: 'strat-comprehensive',
      name: 'Mechanical Assembly Overhaul + Dynamic Sensor Clamp',
      description: 'Physical replacement of lower bearing race combined with continuous 100Hz vibration telemetry streaming to SCADA.',
      estimatedCostUsd: s1Cost,
      expectedDowntimeHours: s1DowntimeHours,
      projectedRiskReductionPercent: Math.round(s1Reduction * 100),
      projectedResidualRiskScore: s1ResidualRisk,
      avoidedDowntimeCostUsd: s1AvoidedCost,
      netBenefitUsd: s1AvoidedCost - s1Cost,
      assumptions: [
        'OEM replacement bearing race meets DIN-625 tolerance standards',
        'Technician certified for laser rotational shaft alignment',
        'Avoided downtime calculation assumes $2,500/hr operational loss during unscheduled freeze',
      ],
      advantages: [
        'Maximum recurrence risk reduction (-87%)',
        'Eliminates latent micro-galling from previous duty cycles',
        'Real-time automated trip prevents stator motor burnout',
      ],
      disadvantages: [
        'Requires 4-hour scheduled maintenance window',
        'Higher upfront parts procurement ($4,200)',
      ],
    },
    {
      id: 'strat-predictive-telemetry',
      name: 'Software-Only Predictive Telemetry Alerts',
      description: 'Configure high-frequency vibration envelope alarms in SCADA without immediate physical component teardown.',
      estimatedCostUsd: s2Cost,
      expectedDowntimeHours: s2DowntimeHours,
      projectedRiskReductionPercent: Math.round(s2Reduction * 100),
      projectedResidualRiskScore: s2ResidualRisk,
      avoidedDowntimeCostUsd: s2AvoidedCost,
      netBenefitUsd: s2AvoidedCost - s2Cost,
      assumptions: [
        'Existing piezo-electric accelerometer sensor fidelity remains un-degraded',
        'On-call technician responds within 15 minutes of SCADA alarm trigger',
      ],
      advantages: [
        'Minimal equipment downtime (1.0 hour calibration)',
        'Low upfront investment ($1,200)',
        'Rapid deployment within 24 hours',
      ],
      disadvantages: [
        'Underlying mechanical bearing wear is not repaired, only watched',
        'Residual risk remains elevated at ~' + s2ResidualRisk + '/100',
        'Risk of false positives during seismic lab bench movements',
      ],
    },
    {
      id: 'strat-status-quo',
      name: 'Status Quo (Periodic Bi-Monthly Visual Inspection)',
      description: 'Continue scheduled 60-day visual checks without adding continuous telemetry or premature overhaul.',
      estimatedCostUsd: s3Cost,
      expectedDowntimeHours: s3DowntimeHours,
      projectedRiskReductionPercent: 0,
      projectedResidualRiskScore: initialRiskScore,
      avoidedDowntimeCostUsd: 0,
      netBenefitUsd: -1 * (s3DowntimeHours * HOURLY_DOWNTIME_COST),
      assumptions: [
        'Equipment remains operable until catastrophic vibration threshold engages emergency brake',
      ],
      advantages: [
        'Zero immediate maintenance expenditure',
        'Zero scheduled downtime today',
      ],
      disadvantages: [
        'Catastrophic failure probability remains at ' + initialRiskScore + '/100',
        'Estimated ~18 hours of unscheduled downtime on next trip',
        'High risk of sample loss and laboratory protocol cancellation',
      ],
    },
  ];
}
