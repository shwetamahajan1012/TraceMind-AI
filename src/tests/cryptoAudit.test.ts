import { describe, it, expect } from 'vitest';
import { computeSha256, generateAuditEntry } from '../utils/cryptoAudit';

describe('Tamper-Evident Audit Chaining (Feature I)', () => {
  it('computes deterministic hashes for string payloads', async () => {
    const payload = 'INC-2024-089|vibration_exceeded_threshold|2026-10-23';
    const hash1 = await computeSha256(payload);
    const hash2 = await computeSha256(payload);

    expect(hash1).toBe(hash2);
    expect(hash1.length).toBeGreaterThan(10);
  });

  it('chains audit log hashes sequentially with actor and timestamp records', async () => {
    const genesisHash = '00000000000000000000000000000000';
    const actor = { name: 'Sarah K.', role: 'Lead Investigator', email: 's.k@tracemind.lab' };

    const entry1 = await generateAuditEntry(
      genesisHash,
      actor,
      'INCIDENT_CREATED',
      'incident',
      'INC-2024-089',
      'Created incident report'
    );

    expect(entry1.prevHash).toBe(genesisHash);
    expect(entry1.hash).toBeDefined();

    const entry2 = await generateAuditEntry(
      entry1.hash,
      actor,
      'CAPA_APPROVED',
      'preventive_action',
      'CAPA-2024-001',
      'Approved spindle overhaul'
    );

    expect(entry2.prevHash).toBe(entry1.hash);
    expect(entry2.hash).not.toBe(entry1.hash);
  });
});
