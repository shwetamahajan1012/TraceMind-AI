import React, { useState } from 'react';
import { Incident, InvestigationResult } from '../types';

interface InvestigateViewProps {
  incident: Incident;
  investigation: InvestigationResult;
  onProceedToRisk: () => void;
  onRerunAnalysis: () => Promise<void>;
  onAddNote: (note: string) => void;
}

export const InvestigateView: React.FC<InvestigateViewProps> = ({
  incident,
  investigation,
  onProceedToRisk,
  onRerunAnalysis,
  onAddNote,
}) => {
  const [activeTriadTab, setActiveTriadTab] = useState<'facts' | 'evidence' | 'hypotheses' | 'gaps'>('facts');
  const [checklist, setChecklist] = useState(investigation.diagnosticChecklist);
  const [isRerunning, setIsRerunning] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [telemetrySyncState, setTelemetrySyncState] = useState<'synced' | 'syncing'>('synced');

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = checklist.filter((item) => item.completed).length;

  const handleRerun = async () => {
    try {
      setIsRerunning(true);
      await onRerunAnalysis();
    } finally {
      setIsRerunning(false);
    }
  };

  const handleSyncTelemetry = () => {
    setTelemetrySyncState('syncing');
    setTimeout(() => {
      setTelemetrySyncState('synced');
    }, 1200);
  };

  const handleSaveNote = () => {
    if (newNoteText.trim()) {
      onAddNote(newNoteText.trim());
      setNewNoteText('');
      setShowAddNoteModal(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-16 space-y-4">
      {/* Demo Data Banner */}
      <div className="w-full bg-[#222a3d] rounded-xl px-3.5 py-2 flex items-center justify-between border border-[#334155] shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[18px] shrink-0">science</span>
          <p className="font-mono text-xs text-[#bcc9cd] truncate">
            <span className="text-[#4cd7f6] font-semibold uppercase">Simulated Run</span> · Synthetic telemetry feed active
          </p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[#06b6d4]/20 text-[#4cd7f6] font-mono text-[10px] shrink-0 border border-[#06b6d4]/30">
          ENV: LAB-C
        </span>
      </div>

      {/* Incident Header Summary Card */}
      <div className="w-full bg-[#171f33] rounded-2xl p-4 sm:p-5 border border-[#1e293b] shadow-md flex flex-col space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-wider">
              #{incident.id} · {incident.category}
            </span>
            <h1 className="font-headline font-bold text-base sm:text-lg text-[#dae2fd] mt-0.5 leading-snug">
              Investigation: {incident.title}
            </h1>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#93000a]/40 text-[#ffb4ab] font-mono text-[11px] uppercase tracking-wide shrink-0 flex items-center gap-1 border border-[#ffb4ab]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-ping"></span>
            {incident.severity}
          </span>
        </div>

        {/* Metadata Pill Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-[#131b2e] rounded-xl p-2.5 flex items-center gap-2 border border-[#222a3d]">
            <span className="material-symbols-outlined text-[#bcc9cd] text-[16px]">schedule</span>
            <span className="text-xs text-[#bcc9cd] truncate">2 hrs ago by {incident.createdBy || 'Sarah K.'}</span>
          </div>
          <div className="bg-[#131b2e] rounded-xl p-2.5 flex items-center gap-2 border border-[#222a3d]">
            <span className="material-symbols-outlined text-[#4fdbc8] text-[16px]">psychology</span>
            <span className="text-xs text-[#4fdbc8] truncate font-mono">{investigation.modelUsed}</span>
          </div>
        </div>

        {/* AI Diagnostic Status Pill */}
        <div className="w-full bg-[#222a3d] rounded-xl p-2.5 flex items-center justify-between border border-[#334155]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">verified</span>
            <span className="text-xs text-[#dae2fd] font-medium truncate">AI Diagnostic Synthesis Complete</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-mono text-xs text-[#4cd7f6] font-semibold">Confidence</span>
            <span className="px-2 py-0.5 rounded-full bg-[#06b6d4] text-[#003640] font-mono text-xs font-bold">
              {investigation.confidenceScore}%
            </span>
          </div>
        </div>

        {/* Confidence Limitation Notice */}
        <div className="w-full bg-[#060e20] rounded-xl p-3 border border-[#222a3d] flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[#ffb95f] text-[18px] shrink-0 mt-0.5">shield_with_heart</span>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[11px] text-[#ffb95f] font-semibold uppercase tracking-wider">
              Confidence Limitation & Verification Mandate
            </span>
            <p className="text-xs text-[#bcc9cd] mt-0.5 leading-snug">
              {investigation.confidenceLimitation}
            </p>
          </div>
        </div>
      </div>

      {/* Telemetry Diagnostic Waveform Mini-Visualizer */}
      <div className="w-full bg-[#171f33] rounded-2xl p-4 border border-[#1e293b] shadow-md flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">show_chart</span>
            <span className="font-headline font-semibold text-xs sm:text-sm text-[#dae2fd]">
              Spindle Harmonic Telemetry
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#ffb4ab] bg-[#93000a]/40 px-2 py-0.5 rounded-full border border-[#ffb4ab]/30">
            TRIP: 4.28 mm/s @ 11.85k RPM
          </span>
        </div>

        <div className="w-full h-24 bg-[#060e20] rounded-xl overflow-hidden relative p-2 flex items-end border border-[#222a3d]">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
            <div className="w-full h-[1px] bg-[#869397]"></div>
            <div className="w-full h-[1px] bg-[#869397]"></div>
            <div className="w-full h-[1px] bg-[#ffb4ab]"></div>
            <div className="w-full h-[1px] bg-[#869397]"></div>
          </div>
          {/* SVG Waveform Trace */}
          <svg className="w-full h-full overflow-visible relative z-10" preserveAspectRatio="none" viewBox="0 0 320 80">
            <defs>
              <linearGradient id="traceGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 65 Q 40 64, 80 62 T 160 58 T 220 50 T 260 40 T 285 10 L 290 8 L 300 70 L 320 72"
              fill="none"
              stroke="#4cd7f6"
              strokeLinecap="round"
              strokeWidth="2.5"
            />
            <path
              d="M 0 65 Q 40 64, 80 62 T 160 58 T 220 50 T 260 40 T 285 10 L 290 8 L 300 70 L 320 72 L 320 80 L 0 80 Z"
              fill="url(#traceGrad)"
            />
            <circle cx="285" cy="10" r="4" fill="#ffb4ab" className="animate-ping" />
            <circle cx="285" cy="10" r="3" fill="#ffb4ab" />
          </svg>
          <span className="absolute bottom-1 right-2 font-mono text-[10px] text-[#bcc9cd]/80">T-00:00:03.4</span>
        </div>

        <div className="flex items-center justify-between text-[#bcc9cd] font-mono text-[11px] pt-1">
          <span>Baseline: 0.8 mm/s</span>
          <span className="text-[#ffb95f]">Brake Engaged: +140ms</span>
          <span>Safe Limit: 3.5 mm/s</span>
        </div>
      </div>

      {/* Lab Centrifuge Photographic Telemetry Viewer */}
      <div className="w-full bg-[#171f33] rounded-2xl overflow-hidden border border-[#1e293b] shadow-md flex flex-col">
        <div className="relative w-full h-44 bg-[#222a3d]">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5SsKgqx-dL6TueGw29UG1tdGMr83_VOr1xSQc3_kpiRvRhLZHxSBov-z_Hov7PpYP36uvKL4TmhLnY0yLfuIiXyJEt9-zzau22LBGciAbJ9PYxLGQJbz9l8M3vuEQ9Umslo0KB_k8zy2YUvlMjG6XrrwR3yWhxtgyzWqMNLJvUGfZrKwEnFWqhKfdfKlVAx_kFig95JTJGyWXM_UVPGgxWmKWQwpBgyWqDa27lwNZlGoA7I1DG4XqMQ"
            alt="Centrifuge spindle shaft diagnostic frame"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171f33] via-[#171f33]/60 to-transparent"></div>
          <div className="absolute top-3 left-3 bg-[#060e20]/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-[#334155]">
            <span className="w-2 h-2 rounded-full bg-[#4fdbc8] animate-pulse"></span>
            <span className="font-mono text-[11px] text-[#4fdbc8]">Sensor Node: AXIS-Z-MOTOR</span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="font-headline font-semibold text-sm text-[#dae2fd]">Diagnostic Frame C-3</span>
            <span className="font-mono text-[11px] text-[#4cd7f6] px-2 py-0.5 rounded-full bg-[#2d3449]/90 border border-[#4cd7f6]/30">
              ID: ROTOR-VIB-01
            </span>
          </div>
        </div>
      </div>

      {/* Epistemic Triad (4-Tier Separation of Facts, Evidence, Hypotheses, Gaps) */}
      <div className="w-full flex flex-col space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">account_tree</span>
            <h2 className="font-headline font-bold text-base text-[#dae2fd]">Epistemic Tiers Separation</h2>
          </div>
          <span className="font-mono text-xs text-[#4cd7f6] font-semibold uppercase tracking-wider">
            4-Tier Hierarchy
          </span>
        </div>

        {/* Tab switchers */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-[#171f33] rounded-xl border border-[#222a3d]">
          {[
            { id: 'facts' as const, label: 'Facts', icon: 'check_circle', color: 'text-[#4fdbc8]' },
            { id: 'evidence' as const, label: 'Evidence', icon: 'query_stats', color: 'text-[#4cd7f6]' },
            { id: 'hypotheses' as const, label: 'Hypotheses', icon: 'psychology', color: 'text-[#4cd7f6]' },
            { id: 'gaps' as const, label: 'Gaps', icon: 'help', color: 'text-[#ffb95f]' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTriadTab(tab.id)}
              className={`py-2 px-1 rounded-lg text-center font-mono text-[11px] transition-all flex items-center justify-center gap-1 ${
                activeTriadTab === tab.id
                  ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
                  : 'text-[#bcc9cd] hover:text-[#dae2fd]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
              <span className="hidden xs:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Panes */}
        {activeTriadTab === 'facts' && (
          <div className="space-y-2">
            {investigation.epistemicTiers.confirmedFacts.map((fact) => (
              <div key={fact.id} className="bg-[#171f33] rounded-xl p-3.5 border border-[#1e293b] flex items-start gap-3 shadow-sm">
                <span className="material-symbols-outlined text-[#4fdbc8] text-[20px] mt-0.5">verified</span>
                <div className="flex flex-col min-w-0">
                  <p className="text-xs sm:text-sm text-[#dae2fd] font-medium leading-relaxed">{fact.text}</p>
                  <span className="font-mono text-[11px] text-[#4fdbc8] mt-1">{fact.source}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTriadTab === 'evidence' && (
          <div className="space-y-2">
            {investigation.epistemicTiers.supportingEvidence.map((ev) => (
              <div key={ev.id} className="bg-[#171f33] rounded-xl p-3.5 border border-[#1e293b] flex items-start gap-3 shadow-sm">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[20px] mt-0.5">query_stats</span>
                <div className="flex flex-col min-w-0">
                  <p className="text-xs sm:text-sm text-[#dae2fd] font-medium leading-relaxed">{ev.text}</p>
                  {ev.metric && <span className="font-mono text-[11px] text-[#4cd7f6] mt-1">{ev.metric}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTriadTab === 'hypotheses' && (
          <div className="space-y-2">
            {investigation.epistemicTiers.aiHypotheses.map((hyp) => (
              <div key={hyp.id} className="bg-[#171f33] rounded-xl p-3.5 border border-[#1e293b] flex flex-col space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-[#06b6d4]/20 text-[#4cd7f6] font-mono text-[11px] font-bold">
                    {hyp.title}
                  </span>
                  <span className="font-mono text-[11px] text-[#4cd7f6] font-bold">{hyp.confidence}% Confidence</span>
                </div>
                <p className="text-xs sm:text-sm text-[#bcc9cd] leading-relaxed">{hyp.mechanism}</p>
              </div>
            ))}
          </div>
        )}

        {activeTriadTab === 'gaps' && (
          <div className="space-y-2">
            {investigation.epistemicTiers.dataGapsAndUncertainty.map((gap) => (
              <div key={gap.id} className="bg-[#171f33] rounded-xl p-3.5 border border-[#1e293b] flex items-start gap-3 shadow-sm">
                <span className="material-symbols-outlined text-[#ffb95f] text-[20px] mt-0.5">help</span>
                <div className="flex flex-col min-w-0">
                  <p className="text-xs sm:text-sm text-[#dae2fd] font-medium leading-relaxed">{gap.description}</p>
                  <p className="text-[11px] text-[#bcc9cd] mt-0.5">{gap.impact}</p>
                  <span className="font-mono text-[11px] text-[#ffb95f] font-bold mt-1 uppercase">
                    Action: {gap.suggestedAction}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Root Cause Diagnosis (Probabilistic Ranking) */}
      <div className="w-full flex flex-col space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">biotech</span>
            <h2 className="font-headline font-bold text-base text-[#dae2fd]">AI Root Cause Diagnosis</h2>
          </div>
          <span className="font-mono text-xs text-[#bcc9cd]">Probabilistic Ranking</span>
        </div>

        {investigation.rootCauses.map((rc) => (
          <div key={rc.id} className="w-full bg-[#171f33] rounded-2xl p-4 sm:p-5 border border-[#1e293b] shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span
                className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                  rc.isPrimary
                    ? 'bg-[#06b6d4] text-[#003640]'
                    : 'bg-[#222a3d] text-[#bcc9cd]'
                }`}
              >
                {rc.isPrimary && <span className="material-symbols-outlined text-[14px]">stars</span>}
                {rc.isPrimary ? 'Primary AI Hypothesis' : 'Alternative Explanation'}
              </span>
              <span
                className={`font-mono text-[11px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  rc.severityTier === 'high' ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]' : 'bg-[#222a3d] text-[#bcc9cd]'
                }`}
              >
                {rc.severityTier} Severity
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#06b6d4]/20 text-[#4cd7f6] flex items-center justify-center font-mono font-bold text-sm shrink-0">
                  {rc.rank}
                </div>
                <h3 className="font-headline font-bold text-sm sm:text-base text-[#dae2fd]">{rc.title}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#06b6d4]/20 text-[#4cd7f6] font-mono text-xs font-bold shrink-0">
                {rc.probability}% Probable
              </span>
            </div>

            {/* Probability Bar */}
            <div className="w-full h-2 bg-[#222a3d] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#06b6d4] to-[#4cd7f6] rounded-full"
                style={{ width: `${rc.probability}%` }}
              ></div>
            </div>

            {/* Proof & Uncertainty */}
            <div className="bg-[#131b2e] rounded-xl p-3 space-y-1.5 border border-[#222a3d]">
              <div className="flex items-center gap-1.5 text-[#4cd7f6]">
                <span className="material-symbols-outlined text-[16px]">query_stats</span>
                <span className="font-mono text-xs font-semibold">Telemetry Proof & Spectral Fit</span>
              </div>
              <p className="text-xs text-[#dae2fd] leading-relaxed">{rc.supportingEvidence}</p>
            </div>

            <div className="bg-[#222a3d]/60 rounded-xl p-3 flex items-start gap-2 border border-[#334155]">
              <span className="material-symbols-outlined text-[#ffb95f] text-[18px] shrink-0 mt-0.5">info</span>
              <div className="flex flex-col">
                <span className="font-mono text-[11px] text-[#ffb95f] font-bold uppercase">Epistemic Uncertainty</span>
                <p className="text-xs text-[#bcc9cd] mt-0.5 leading-relaxed">{rc.epistemicUncertainty}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Organizational Memory (Vector Match) */}
      <div className="w-full flex flex-col space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4fdbc8] text-[20px]">auto_stories</span>
            <h2 className="font-headline font-bold text-base text-[#dae2fd]">Organizational Memory</h2>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#04b4a2]/20 text-[#4fdbc8] font-mono text-xs font-semibold">
            Vector Match
          </span>
        </div>

        {investigation.historicalMatches.map((match) => (
          <div key={match.incidentId} className="w-full bg-[#171f33] rounded-2xl p-4 border border-[#1e293b] shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#222a3d] font-mono text-xs text-[#4cd7f6] font-bold">
                  {match.incidentId}
                </span>
                <span className="font-mono text-xs text-[#bcc9cd]">{match.timeAgo}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#4fdbc8]/15 text-[#4fdbc8] font-mono text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4fdbc8]"></span>
                {match.matchScore}% Match
              </span>
            </div>

            <p className="font-headline font-semibold text-sm text-[#dae2fd]">{match.title}</p>

            <div className="bg-[#131b2e] rounded-xl p-3 flex items-start gap-2 border border-[#222a3d]">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[16px] shrink-0 mt-0.5">analytics</span>
              <div className="flex flex-col">
                <span className="font-mono text-xs text-[#4cd7f6] font-semibold">Relevance Analysis</span>
                <p className="text-xs text-[#dae2fd] mt-0.5 leading-relaxed">{match.similarityReason}</p>
              </div>
            </div>

            <div className="bg-[#131b2e] rounded-xl p-3 flex items-start gap-2 border border-[#222a3d]">
              <span className="material-symbols-outlined text-[#4fdbc8] text-[16px] shrink-0 mt-0.5">verified_user</span>
              <div className="flex flex-col">
                <span className="font-mono text-xs text-[#4fdbc8] font-semibold">Historical Resolution</span>
                <p className="text-xs text-[#bcc9cd] mt-0.5 leading-relaxed">{match.historicalResolution}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Diagnostics Checklist */}
      <div className="w-full flex flex-col space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">checklist</span>
            <h2 className="font-headline font-bold text-base text-[#dae2fd]">Recommended Diagnostics</h2>
          </div>
          <span className={`font-mono text-xs font-bold ${completedCount === checklist.length ? 'text-[#4fdbc8]' : 'text-[#4cd7f6]'}`}>
            {completedCount}/{checklist.length} Done
          </span>
        </div>

        <div className="w-full bg-[#171f33] rounded-2xl p-4 sm:p-5 border border-[#1e293b] shadow-md space-y-3">
          {checklist.map((item, idx) => (
            <React.Fragment key={item.id}>
              {idx > 0 && <div className="w-full h-[1px] bg-[#222a3d]"></div>}
              <label
                onClick={() => toggleChecklist(item.id)}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => {}}
                  className="w-5 h-5 rounded mt-0.5 bg-[#222a3d] border-[#334155] text-[#06b6d4] focus:ring-0 shrink-0 cursor-pointer"
                />
                <div className="flex flex-col min-w-0">
                  <span
                    className={`font-headline text-xs sm:text-sm font-semibold transition-colors ${
                      item.completed ? 'line-through text-[#869397]' : 'text-[#dae2fd] group-hover:text-[#4cd7f6]'
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="text-xs text-[#bcc9cd] mt-0.5">{item.description}</span>
                </div>
              </label>
            </React.Fragment>
          ))}

          {/* Add custom note button */}
          <button
            type="button"
            onClick={() => setShowAddNoteModal(true)}
            className="w-full mt-2 py-2.5 px-3 rounded-xl bg-[#222a3d] text-[#dae2fd] hover:text-[#4cd7f6] hover:bg-[#2d3449] border border-[#334155] transition-colors flex items-center justify-center gap-2 font-mono text-xs font-medium"
          >
            <span className="material-symbols-outlined text-[16px]">add_comment</span>
            <span>Add Custom Investigation Note</span>
          </button>
        </div>
      </div>

      {/* Bottom CTA Navigation */}
      <div className="w-full pt-2 flex flex-col space-y-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleRerun}
            disabled={isRerunning}
            className="py-3 px-3 rounded-xl bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] border border-[#334155] font-mono text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[#4cd7f6] text-[18px] ${isRerunning ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>{isRerunning ? 'Analyzing...' : 'Rerun AI Analysis'}</span>
          </button>

          <button
            type="button"
            onClick={handleSyncTelemetry}
            className="py-3 px-3 rounded-xl bg-[#222a3d] hover:bg-[#2d3449] text-[#4cd7f6] border border-[#334155] font-mono text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span className={`material-symbols-outlined text-[18px] ${telemetrySyncState === 'syncing' ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{telemetrySyncState === 'syncing' ? 'Syncing...' : 'Re-sync Telemetry'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onProceedToRisk}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#4cd7f6] text-[#003640] font-headline font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#06b6d4]/25 active:scale-[0.99] transition-transform"
        >
          <span>Proceed to Risk & Action Plan</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[#869397] font-mono text-[11px] pt-1">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          <span>Investigation findings cryptographically hashed: {investigation.auditHash.slice(0, 14)}...</span>
        </div>
      </div>

      {/* Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 z-50 bg-[#060e20]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#171f33] border border-[#334155] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#222a3d]">
              <span className="font-headline font-bold text-base text-[#dae2fd]">Add Custom Investigation Note</span>
              <button onClick={() => setShowAddNoteModal(false)} className="text-[#bcc9cd] hover:text-[#dae2fd]">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="e.g. Inspected motor coupling during shift change. Visual scoring on lower race verified with optical borescope."
              className="w-full p-3 bg-[#131b2e] border border-[#334155] rounded-xl text-xs sm:text-sm text-[#dae2fd] outline-none focus:border-[#4cd7f6] resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddNoteModal(false)}
                className="px-4 py-2 rounded-xl bg-[#222a3d] text-[#bcc9cd] font-mono text-xs hover:text-[#dae2fd]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                className="px-4 py-2 rounded-xl bg-[#06b6d4] text-[#003640] font-headline font-bold text-xs hover:bg-[#4cd7f6]"
              >
                Append to Audit Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
