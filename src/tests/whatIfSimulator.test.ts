import { describe, it, expect } from 'vitest';
import { getPresetStrategies } from '../utils/whatIfSimulator';

describe('What-If Strategy Simulator (Feature G)', () => {
  it('generates 3 comparative strategies with transparent assumptions', () => {
    const initialRisk = 84;
    const strategies = getPresetStrategies(initialRisk);

    expect(strategies.length).toBe(3);

    const s1 = strategies[0]; // Full Overhaul
    expect(s1.projectedRiskReductionPercent).toBe(87);
    expect(s1.projectedResidualRiskScore).toBeLessThan(15);
    expect(s1.estimatedCostUsd).toBe(4200);
    expect(s1.advantages.length).toBeGreaterThan(0);
    expect(s1.disadvantages.length).toBeGreaterThan(0);
    expect(s1.assumptions.length).toBeGreaterThan(0);

    const s2 = strategies[1]; // Software alerts
    expect(s2.projectedRiskReductionPercent).toBe(55);
    expect(s2.estimatedCostUsd).toBe(1200);

    const s3 = strategies[2]; // Status quo
    expect(s3.projectedRiskReductionPercent).toBe(0);
    expect(s3.projectedResidualRiskScore).toBe(initialRisk);
    expect(s3.netBenefitUsd).toBeLessThan(0);
  });

  it('correctly adapts residual risk to varying initial baseline risk scores', () => {
    const lowInitial = 30;
    const lowStrategies = getPresetStrategies(lowInitial);
    expect(lowStrategies[0].projectedResidualRiskScore).toBeLessThanOrEqual(10);

    const highInitial = 95;
    const highStrategies = getPresetStrategies(highInitial);
    expect(highStrategies[0].projectedResidualRiskScore).toBeLessThanOrEqual(15);
  });
});
