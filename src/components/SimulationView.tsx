import React, { useState } from 'react';
import { AuditLogEntry, WhatIfStrategy } from '../types';
import { getPresetStrategies } from '../utils/whatIfSimulator';

interface SimulationViewProps {
  initialScore: number;
  auditLogs: AuditLogEntry[];
  latestAuditHash: string;
}

export const SimulationView: React.FC<SimulationViewProps> = ({
  initialScore,
  auditLogs,
  latestAuditHash,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'simulation' | 'memory' | 'audit'>('simulation');
  const [customScore, setCustomScore] = useState(initialScore || 84);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Search in memory
  const [searchQuery, setSearchQuery] = useState('');

  const strategies: WhatIfStrategy[] = getPresetStrategies(customScore);

  const historicalRecords = [
    {
      id: 'INC-2023-112',
      title: 'Centrifuge B-2 Bearing Seizure during RPM Ramp',
      timeAgo: '14 mos ago',
      category: 'Laboratory Equipment & Biosafety',
      matchScore: 94,
      relevance: 'Identical bearing race harmonic frequency spike at 11,800 RPM in the same equipment class (Centrifuge B-2), occurring after >1,200 operating hours.',
      resolution: 'Prevented full stator burn-out by replacing lower bearing race within 48h. Rotor undamaged.',
      verified: true,
    },
    {
      id: 'INC-2023-045',
      title: 'Autoclave Rotary Pump Harmonic Oscillation',
      timeAgo: '19 mos ago',
      category: 'HVAC & Pressure Systems',
      matchScore: 68,
      relevance: 'Similar acoustic chatter detected in rotary assembly prior to trip.',
      resolution: 'Resolved via dampener gasket replacement and realignment.',
      verified: true,
    },
    {
      id: 'INC-2022-098',
      title: 'Spectrometer Optical Bench Thermal Drift',
      timeAgo: '26 mos ago',
      category: 'Optical & Spectroscopy',
      matchScore: 54,
      relevance: 'Secondary thermal excursion due to cleanroom HVAC cycle oscillation.',
      resolution: 'Installed dual-redundant RTD temperature sensors with SCADA hysteresis band.',
      verified: true,
    },
  ];

  const filteredRecords = historicalRecords.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.relevance.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-16 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#222a3d] rounded-xl border border-[#334155] shadow-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">tune</span>
          <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-wider font-semibold">
            What-If Simulator & Memory Core
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#171f33] text-[#4fdbc8] font-mono text-[10px] font-bold border border-[#3d494c]">
          ACTIVE ENGINE
        </span>
      </div>

      {/* Sub Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-[#171f33] rounded-xl border border-[#222a3d]">
        <button
          onClick={() => setActiveSubTab('simulation')}
          className={`py-2 px-1 text-center rounded-lg font-mono text-xs transition-all flex items-center justify-center gap-1 ${
            activeSubTab === 'simulation'
              ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
              : 'text-[#bcc9cd] hover:text-[#dae2fd]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">tune</span>
          <span>What-If Sim</span>
        </button>
        <button
          onClick={() => setActiveSubTab('memory')}
          className={`py-2 px-1 text-center rounded-lg font-mono text-xs transition-all flex items-center justify-center gap-1 ${
            activeSubTab === 'memory'
              ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
              : 'text-[#bcc9cd] hover:text-[#dae2fd]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">auto_stories</span>
          <span>Org Memory</span>
        </button>
        <button
          onClick={() => setActiveSubTab('audit')}
          className={`py-2 px-1 text-center rounded-lg font-mono text-xs transition-all flex items-center justify-center gap-1 ${
            activeSubTab === 'audit'
              ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
              : 'text-[#bcc9cd] hover:text-[#dae2fd]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">lock</span>
          <span>Audit Chain</span>
        </button>
      </div>

      {/* 1. What-If Simulation View */}
      {activeSubTab === 'simulation' && (
        <div className="space-y-4">
          {/* Baseline Risk Slider */}
          <div className="p-4 rounded-2xl bg-[#171f33] border border-[#1e293b] shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="sim-risk-slider" className="font-headline font-semibold text-xs sm:text-sm text-[#dae2fd]">
                Simulate Baseline Incident Recurrence Score:
              </label>
              <span className="font-mono font-bold text-sm text-[#ffb4ab]">{customScore}/100</span>
            </div>
            <input
              id="sim-risk-slider"
              type="range"
              min="10"
              max="100"
              value={customScore}
              onChange={(e) => setCustomScore(Number(e.target.value))}
              className="w-full accent-[#06b6d4] bg-[#222a3d] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-[#869397]">
              <span>10 (Low Risk)</span>
              <span>50 (Moderate)</span>
              <span className="text-[#ffb4ab]">100 (Imminent Failure)</span>
            </div>
          </div>

          {/* Strategy Comparison Cards */}
          <div className="space-y-3">
            {strategies.map((strat, idx) => (
              <div
                key={strat.id}
                className={`p-4 sm:p-5 rounded-2xl border shadow-md space-y-3 ${
                  idx === 0
                    ? 'bg-[#171f33] border-[#06b6d4]/50 shadow-[#06b6d4]/10'
                    : 'bg-[#131b2e] border-[#222a3d]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#06b6d4]/20 text-[#4cd7f6] flex items-center justify-center font-mono text-xs font-bold">
                      S{idx + 1}
                    </span>
                    <h3 className="font-headline font-bold text-sm sm:text-base text-[#dae2fd]">{strat.name}</h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-bold ${
                      strat.projectedRiskReductionPercent > 70
                        ? 'bg-[#4fdbc8]/20 text-[#4fdbc8]'
                        : strat.projectedRiskReductionPercent > 30
                        ? 'bg-[#06b6d4]/20 text-[#4cd7f6]'
                        : 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                    }`}
                  >
                    -{strat.projectedRiskReductionPercent}% Risk
                  </span>
                </div>

                <p className="text-xs text-[#bcc9cd] leading-relaxed">{strat.description}</p>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0b1326] p-3 rounded-xl border border-[#222a3d] text-center">
                  <div>
                    <span className="text-[10px] text-[#bcc9cd] font-mono block">Estimated Cost</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#dae2fd]">
                      ${strat.estimatedCostUsd.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#bcc9cd] font-mono block">Downtime</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#ffb95f]">
                      {strat.expectedDowntimeHours} hrs
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#bcc9cd] font-mono block">Residual Risk</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#4fdbc8]">
                      {strat.projectedResidualRiskScore}/100
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#bcc9cd] font-mono block">Net Benefit</span>
                    <span className={`font-mono font-bold text-xs sm:text-sm ${strat.netBenefitUsd >= 0 ? 'text-[#4fdbc8]' : 'text-[#ffb4ab]'}`}>
                      {strat.netBenefitUsd >= 0 ? '+' : ''}${strat.netBenefitUsd.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-start gap-1.5 text-[#4fdbc8]">
                    <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">add_circle</span>
                    <span>{strat.advantages[0]}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[#ffb95f]">
                    <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">remove_circle</span>
                    <span>{strat.disadvantages[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Operational Disclaimer */}
          <div className="p-3 rounded-xl bg-[#060e20] border border-[#222a3d] text-[11px] text-[#869397] leading-relaxed">
            <strong className="text-[#bcc9cd]">Operational Notice:</strong> All projected figures are computational estimates derived from deterministic Bayesian Markov reliability equations, not guaranteed financial returns.
          </div>
        </div>
      )}

      {/* 2. Organizational Memory View */}
      {activeSubTab === 'memory' && (
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-3 material-symbols-outlined text-[#bcc9cd] text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search historical lab memory (e.g. Centrifuge, Autoclave, vibration, bearing)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-9 pr-3 bg-[#171f33] border border-[#334155] rounded-xl text-xs sm:text-sm text-[#dae2fd] outline-none focus:border-[#4cd7f6]"
            />
          </div>

          <div className="space-y-3">
            {filteredRecords.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#bcc9cd] bg-[#171f33] rounded-2xl border border-[#222a3d]">
                No matching historical incidents found in organizational repository.
              </div>
            ) : (
              filteredRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-[#171f33] border border-[#1e293b] shadow-md space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#222a3d] font-mono text-xs text-[#4cd7f6] font-bold">
                        {rec.id}
                      </span>
                      <span className="font-mono text-xs text-[#bcc9cd]">{rec.timeAgo}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#4fdbc8]/15 text-[#4fdbc8] font-mono text-xs font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4fdbc8]"></span>
                      {rec.matchScore}% Match
                    </span>
                  </div>

                  <h3 className="font-headline font-semibold text-sm text-[#dae2fd]">{rec.title}</h3>

                  <div className="bg-[#131b2e] p-3 rounded-xl border border-[#222a3d] space-y-1">
                    <span className="font-mono text-[11px] text-[#4cd7f6] font-semibold block">
                      Why this record matches:
                    </span>
                    <p className="text-xs text-[#bcc9cd] leading-relaxed">{rec.relevance}</p>
                  </div>

                  <div className="bg-[#131b2e] p-3 rounded-xl border border-[#222a3d] space-y-1">
                    <span className="font-mono text-[11px] text-[#4fdbc8] font-semibold block">
                      Historical Resolution Applied:
                    </span>
                    <p className="text-xs text-[#dae2fd] leading-relaxed">{rec.resolution}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. Cryptographic Audit Chain View */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#171f33] border border-[#1e293b] shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#4cd7f6] font-semibold uppercase tracking-wider">
                Cryptographic Audit Log
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#4fdbc8]/20 text-[#4fdbc8] font-mono text-[10px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">verified</span>
                Chain Verified
              </span>
            </div>
            <div className="flex items-center justify-between bg-[#0b1326] p-2.5 rounded-xl border border-[#222a3d]">
              <span className="font-mono text-xs text-[#bcc9cd] truncate">
                Latest Root Hash: <span className="text-[#dae2fd]">{latestAuditHash}</span>
              </span>
              <button
                onClick={() => handleCopyHash(latestAuditHash)}
                className="px-2 py-1 rounded bg-[#222a3d] text-[11px] font-mono text-[#4cd7f6] hover:bg-[#334155] shrink-0 ml-2"
              >
                {copiedHash === latestAuditHash ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-[#131b2e] border border-[#222a3d] space-y-1.5 font-mono text-xs"
              >
                <div className="flex items-center justify-between text-[#869397] text-[11px]">
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span className="text-[#4cd7f6]">{log.actor.name} ({log.actor.role})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-[#222a3d] text-[#ffb95f] text-[10px] font-bold">
                    {log.action}
                  </span>
                  <span className="text-[#dae2fd] truncate">{log.details}</span>
                </div>
                <div className="text-[10px] text-[#869397] truncate pt-1 border-t border-[#1e293b]">
                  Hash: {log.hash}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
