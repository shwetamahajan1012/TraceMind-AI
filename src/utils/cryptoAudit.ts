/**
 * TraceMind AI - Audit Hash Chaining (SHA-256)
 * Provides cryptographically tamper-evident investigation audit records.
 */

export async function computeSha256(data: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Node.js fallback or simple deterministic string hash if SubtleCrypto is unavailable in test
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'tm_' + Math.abs(hash).toString(16).padStart(16, '0') + 'd9a4';
}

export async function generateAuditEntry(
  prevHash: string,
  actor: { name: string; role: string; email: string },
  action: string,
  entityType: 'incident' | 'investigation' | 'preventive_action' | 'risk_assessment',
  entityId: string,
  details: string
) {
  const timestamp = new Date().toISOString();
  const rawPayload = `${prevHash}|${timestamp}|${actor.email}|${action}|${entityType}|${entityId}|${details}`;
  const hash = await computeSha256(rawPayload);
  return {
    id: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp,
    actor,
    action,
    entityType,
    entityId,
    details,
    prevHash,
    hash,
  };
}
