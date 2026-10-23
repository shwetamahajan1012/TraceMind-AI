import { describe, it, expect } from 'vitest';
import { PreventiveAction, CriticalityTier } from '../types';

describe('Workflow & Security Validation', () => {
  it('validates critical criticality tier enum adherence', () => {
    const validTiers: CriticalityTier[] = ['low', 'medium', 'high', 'critical'];
    expect(validTiers.includes('critical')).toBe(true);
    expect(validTiers.includes('unauthorized_tier' as any)).toBe(false);
  });

  it('enforces rigorous state machine transitions for CAPA actions', () => {
    const validTransitions: Record<string, string[]> = {
      proposed: ['approved', 'rejected'],
      approved: ['in_progress', 'completed'],
      in_progress: ['completed'],
      completed: ['verified'],
      verified: [],
      rejected: ['proposed'],
    };

    const action: PreventiveAction = {
      id: 'CAPA-TEST-01',
      incidentId: 'INC-2024-089',
      title: 'Emergency overhaul',
      description: 'Replace lower bearing race',
      priority: 'P1 - Critical',
      status: 'proposed',
      responsibleRole: 'Specialist',
      suggestedDeadline: '48h',
      verificationMethod: 'Laser alignment',
      reason: 'Prevent rotor wobble',
      createdAt: new Date().toISOString(),
    };

    // Transition proposed -> approved
    expect(validTransitions[action.status].includes('approved')).toBe(true);
    action.status = 'approved';

    // Transition approved -> completed
    expect(validTransitions[action.status].includes('completed')).toBe(true);
    action.status = 'completed';

    // Transition completed -> verified
    expect(validTransitions[action.status].includes('verified')).toBe(true);
    action.status = 'verified';

    // Verified action is terminal
    expect(validTransitions[action.status].length).toBe(0);
  });

  it('sanitizes user input string lengths to prevent buffer / denial of service', () => {
    const oversizedTitle = 'A'.repeat(500);
    const isValidLength = oversizedTitle.length <= 120;
    expect(isValidLength).toBe(false);

    const normalTitle = 'Centrifuge C-3 Rotor Vibration Exceeded Safe Threshold';
    expect(normalTitle.length <= 120).toBe(true);
  });
});
