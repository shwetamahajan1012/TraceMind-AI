import React, { useState } from 'react';
import { Incident, PreventiveAction, RecurrenceRiskAssessment } from '../types';

interface RiskAndActionsViewProps {
  incident: Incident;
  riskAssessment: RecurrenceRiskAssessment;
  actions: PreventiveAction[];
  onApproveAction: (actionId: string) => Promise<void>;
  onRejectAction: (actionId: string, reason?: string) => Promise<void>;
  onCompleteAction: (actionId: string) => Promise<void>;
  onVerifyAction: (actionId: string) => Promise<void>;
  onEditAction: (action: PreventiveAction) => void;
  onProposeNewAction: () => void;
  onNavigateToSimulation: () => void;
}

export const RiskAndActionsView: React.FC<RiskAndActionsViewProps> = ({
  incident,
  riskAssessment,
  actions,
  onApproveAction,
  onRejectAction,
  onCompleteAction,
  onVerifyAction,
  onEditAction,
  onProposeNewAction,
  onNavigateToSimulation,
}) => {
  const [rejectingActionId, setRejectingActionId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Calculate live intervention impact based on approved / completed actions
  const incidentActions = actions.filter((a) => a.incidentId === incident.id);
  const approvedOrDoneCount = incidentActions.filter((a) => a.status === 'approved' || a.status === 'completed' || a.status === 'verified').length;
  const projectedRisk = Math.max(8, Math.round(riskAssessment.score * Math.pow(0.4, approvedOrDoneCount)));
  const avoidedDowntimeDollars = approvedOrDoneCount >= 2 ? 14200 : approvedOrDoneCount === 1 ? 8500 : 0;
  const mitigationPercent = Math.min(92, approvedOrDoneCount * 44);

  const handleConfirmReject = async (actionId: string) => {
    if (rejectReason.trim()) {
      await onRejectAction(actionId, rejectReason.trim());
      setRejectingActionId(null);
      setRejectReason('');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-16 space-y-4">
      {/* Top Header Ribbon */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#222a3d] rounded-xl border border-[#334155] shadow-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">verified_user</span>
          <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-wider font-semibold">
            CAPA Intelligence Engine
          </span>
          <span className="font-mono text-xs text-[#bcc9cd]">#{incident.id}</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#171f33] text-[#ffb95f] font-mono text-[10px] font-bold border border-[#3d494c]">
          DEMO DATA
        </span>
      </div>

      {/* Incident Sub-Header */}
      <div className="p-4 rounded-2xl bg-[#171f33] border border-[#1e293b] shadow-md flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#93000a]/40 text-[#ffb4ab] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#ffb4ab]/30">
              HIGH RECURRENCE
            </span>
            <span className="text-xs text-[#bcc9cd] font-mono">Centrifuge-Bio7 · Unit C-4</span>
          </div>
          <h1 className="font-headline font-bold text-base sm:text-lg text-[#dae2fd] mt-1">
            Lower Spindle Bearing Thermal Anomaly
          </h1>
          <span className="text-xs text-[#869397] mt-0.5">Telemetry Anomaly detected 3.2 hrs prior to fail-stop</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#222a3d] flex items-center justify-center text-[#4cd7f6] border border-[#334155]">
          <span className="material-symbols-outlined text-[22px]">manage_search</span>
        </div>
      </div>

      {/* Recurrence Risk Assessment Arc Gauge Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#171f33] border border-[#1e293b] shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb95f] text-[20px]">local_fire_department</span>
            <h2 className="font-headline font-bold text-base text-[#dae2fd]">Recurrence Risk Assessment</h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#222a3d] text-[#4cd7f6] font-mono text-xs font-semibold border border-[#334155]">
            Bayesian Projection
          </span>
        </div>

        {/* Semi-Circular SVG Gauge */}
        <div className="relative w-full flex flex-col items-center justify-center pt-2">
          <svg className="w-64 h-36 overflow-visible" viewBox="0 0 200 110">
            {/* Background Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#222a3d"
              strokeWidth="16"
              strokeLinecap="round"
            />
            {/* Active Risk Score Arc (84% of 180 deg) */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#riskGaugeGrad)"
              strokeWidth="16"
              strokeDasharray="251.2"
              strokeDashoffset={`${251.2 * (1 - (riskAssessment.score / 100))}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="riskGaugeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4fdbc8" />
                <stop offset="50%" stopColor="#ffb95f" />
                <stop offset="100%" stopColor="#ffb4ab" />
              </linearGradient>
            </defs>
            {/* Needle indicator dot */}
            <circle cx="165" cy="55" r="5" fill="#ffdad6" className="animate-pulse shadow-lg" />
          </svg>

          {/* Central Score readout */}
          <div className="absolute top-14 flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <span className="font-headline font-bold text-4xl sm:text-5xl text-[#dae2fd]">{riskAssessment.score}</span>
              <span className="font-mono text-xs text-[#bcc9cd]">/ 100</span>
            </div>
            <span className="font-mono text-xs text-[#ffb4ab] font-bold tracking-wider uppercase mt-0.5">
              High Recurrence Probability
            </span>
          </div>

          <div className="w-64 flex justify-between text-[11px] font-mono text-[#869397] px-1 mt-1">
            <span>0 Safe</span>
            <span>50 Mod</span>
            <span className="text-[#ffb4ab]">100 Critical</span>
          </div>
        </div>

        {/* Predictive Window Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-[#131b2e] border border-[#222a3d] space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#bcc9cd]">
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              <span>Predicted Window</span>
            </div>
            <p className="font-headline font-bold text-base text-[#dae2fd]">
              {riskAssessment.predictedWindowDays.min} to {riskAssessment.predictedWindowDays.max} Days
            </p>
            <span className="text-[11px] text-[#ffb95f] font-mono">If unaddressed</span>
          </div>

          <div className="p-3 rounded-xl bg-[#131b2e] border border-[#222a3d] space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#bcc9cd]">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>Risk Trend</span>
            </div>
            <p className="font-headline font-bold text-base text-[#ffb4ab]">
              +{riskAssessment.trendVsBaselinePercent}%
            </p>
            <span className="text-[11px] text-[#bcc9cd] font-mono">vs. Org Baseline</span>
          </div>
        </div>
      </div>

      {/* Model Uncertainty Notice */}
      <div className="p-4 rounded-2xl bg-[#171f33] border border-[#ffb95f]/30 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#ffb95f]">
            <span className="material-symbols-outlined text-[20px]">warning</span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider">Model Uncertainty Notice</span>
          </div>
          <span className="font-mono text-xs text-[#bcc9cd]">Conf: {riskAssessment.confidencePercent}%</span>
        </div>
        <p className="text-xs text-[#bcc9cd] leading-relaxed">
          Recurrence estimations are statistical projections derived from <strong className="text-[#dae2fd]">342 historical maintenance records</strong> and sensor telemetry. Estimates depend on logged maintenance fidelity and operating environment variables.
        </p>
      </div>

      {/* Scoring Weights & Architecture Breakdown */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#171f33] border border-[#1e293b] space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-wider font-semibold">
            Σ Scoring Weights & Architecture
          </span>
        </div>
        <p className="text-xs text-[#bcc9cd] leading-relaxed">
          Bayesian failure probability weighted by component age (<strong className="text-[#4cd7f6]">35%</strong>), historical MTBF degradation (<strong className="text-[#4cd7f6]">40%</strong>), and operational stress thermal cycles (<strong className="text-[#ffb95f]">25%</strong>).
        </p>
        {/* Multi-segment weight bar */}
        <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-[#131b2e]">
          <div style={{ width: '35%' }} className="h-full bg-[#06b6d4]"></div>
          <div style={{ width: '40%' }} className="h-full bg-[#4fdbc8]"></div>
          <div style={{ width: '25%' }} className="h-full bg-[#ffb95f]"></div>
        </div>
        <div className="flex justify-between text-[11px] font-mono text-[#bcc9cd] pt-1">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#06b6d4]"></span> Age 35%</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#4fdbc8]"></span> MTBF 40%</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ffb95f]"></span> Stress 25%</span>
        </div>
      </div>

      {/* Contributing Risk Factors List */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#171f33] border border-[#1e293b] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">sort</span>
            <h2 className="font-headline font-bold text-base text-[#dae2fd]">Contributing Risk Factors</h2>
          </div>
          <span className="font-mono text-xs text-[#bcc9cd]">Σ = {riskAssessment.score} pts</span>
        </div>

        <div className="space-y-2.5">
          {riskAssessment.factors.map((f) => (
            <div key={f.code} className="p-3.5 rounded-xl bg-[#131b2e] border border-[#222a3d] space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-[18px] ${f.scoreContribution > 30 ? 'text-[#ffb4ab]' : 'text-[#ffb95f]'}`}>
                    {f.scoreContribution > 30 ? 'alarm' : 'thermostat'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#222a3d] text-[#bcc9cd] font-mono text-[10px]">
                    Weight: {f.severityLevel === 'high' ? 'High' : 'Medium'}
                  </span>
                  <span className="font-mono text-[10px] text-[#4cd7f6]">#{f.code}</span>
                </div>
                <span className="font-mono font-bold text-sm text-[#ffb4ab]">+{f.scoreContribution} pts</span>
              </div>
              <p className="font-headline font-semibold text-xs sm:text-sm text-[#dae2fd]">{f.name}</p>
              <p className="text-xs text-[#bcc9cd]">{f.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended CAPA Plan (Feature E) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#171f33] border border-[#1e293b] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4fdbc8] text-[20px]">task_alt</span>
            <h2 className="font-headline font-bold text-base text-[#dae2fd]">Recommended CAPA Plan</h2>
          </div>
          <span className="font-mono text-xs text-[#bcc9cd]">{incidentActions.length} Actions</span>
        </div>

        <div className="space-y-3">
          {incidentActions.map((action) => {
            const isApproved = action.status === 'approved';
            const isCompleted = action.status === 'completed';
            const isVerified = action.status === 'verified';
            const isRejected = action.status === 'rejected';

            return (
              <div
                key={action.id}
                className="p-4 rounded-xl bg-[#131b2e] border border-[#222a3d] space-y-3 hover:border-[#334155] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#93000a]/40 text-[#ffb4ab] font-mono text-[10px] font-bold">
                      {action.priority}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                        isVerified
                          ? 'bg-[#4fdbc8]/20 text-[#4fdbc8]'
                          : isCompleted
                          ? 'bg-[#06b6d4]/20 text-[#4cd7f6]'
                          : isApproved
                          ? 'bg-[#4fdbc8]/15 text-[#4fdbc8]'
                          : isRejected
                          ? 'bg-[#93000a]/30 text-[#ffdad6]'
                          : 'bg-[#ffb95f]/20 text-[#ffb95f]'
                      }`}
                    >
                      {action.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#bcc9cd] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {action.suggestedDeadline}
                  </span>
                </div>

                <div>
                  <h3 className="font-headline font-bold text-sm text-[#dae2fd]">{action.title}</h3>
                  <p className="text-xs text-[#bcc9cd] mt-1 leading-relaxed">{action.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-[#171f33] p-2.5 rounded-lg border border-[#222a3d]">
                  <div className="flex items-center gap-1.5 text-[#bcc9cd]">
                    <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">badge</span>
                    <span>Role: <strong className="text-[#dae2fd]">{action.responsibleRole}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#bcc9cd]">
                    <span className="material-symbols-outlined text-[16px] text-[#4fdbc8]">fact_check</span>
                    <span>Verify: <strong className="text-[#dae2fd] truncate">{action.verificationMethod}</strong></span>
                  </div>
                </div>

                {/* Action controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#1e293b]">
                  <div className="flex items-center gap-1.5">
                    {action.status === 'proposed' && (
                      <>
                        <button
                          onClick={() => onApproveAction(action.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] font-mono text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">check</span>
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => onEditAction(action)}
                          className="px-3 py-1.5 rounded-lg bg-[#222a3d] hover:bg-[#334155] text-[#dae2fd] font-mono text-xs transition-all flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setRejectingActionId(action.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#93000a]/30 hover:bg-[#93000a]/50 text-[#ffb4ab] font-mono text-xs transition-all flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {action.status === 'approved' && (
                      <button
                        onClick={() => onCompleteAction(action.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] font-mono text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">done_all</span>
                        <span>Mark as Complete</span>
                      </button>
                    )}

                    {action.status === 'completed' && (
                      <button
                        onClick={() => onVerifyAction(action.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#4fdbc8] hover:bg-[#71f8e4] text-[#003731] font-mono text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>Sign-off & Verify</span>
                      </button>
                    )}
                  </div>

                  <span className="text-[11px] text-[#4fdbc8] font-mono flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">shield</span>
                    Tamper-evident Audit Tracked
                  </span>
                </div>

                {/* Reject Reason input dialog */}
                {rejectingActionId === action.id && (
                  <div className="p-3 rounded-lg bg-[#222a3d] border border-[#ffb4ab]/40 space-y-2 mt-2">
                    <label className="text-xs text-[#ffb4ab] font-mono">Specify rejection reason:</label>
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g. Incompatible with manufacturer warranty contract"
                      className="w-full h-9 px-2 bg-[#131b2e] rounded border border-[#334155] text-xs text-[#dae2fd] outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setRejectingActionId(null)}
                        className="px-2.5 py-1 text-xs text-[#bcc9cd] font-mono"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleConfirmReject(action.id)}
                        className="px-3 py-1 bg-[#93000a] text-[#ffdad6] rounded text-xs font-mono font-bold"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Propose New Action Button */}
        <button
          type="button"
          onClick={onProposeNewAction}
          className="w-full py-2.5 rounded-xl bg-[#222a3d] hover:bg-[#334155] text-[#4cd7f6] border border-[#334155] font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Propose Custom Preventive Action</span>
        </button>
      </div>

      {/* Simulated Intervention Impact (Feature G Preview) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#171f33] to-[#131b2e] border border-[#06b6d4]/40 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">tune</span>
            <span className="font-mono text-xs text-[#4cd7f6] font-bold uppercase tracking-wider">
              Simulated Intervention Impact
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#06b6d4]/20 text-[#4cd7f6] font-mono text-xs font-bold">
            {mitigationPercent}% Mitigation
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#222a3d] text-center">
          <div>
            <span className="text-[11px] text-[#bcc9cd] font-mono block">Initial Risk</span>
            <span className="font-headline font-bold text-xl text-[#ffb4ab]">{riskAssessment.score}/100</span>
          </div>
          <div>
            <span className="text-[11px] text-[#4cd7f6] font-mono block">Projected Risk</span>
            <span className="font-headline font-bold text-xl text-[#4fdbc8]">{projectedRisk}/100</span>
          </div>
          <div>
            <span className="text-[11px] text-[#bcc9cd] font-mono block">Avoided Downtime</span>
            <span className="font-headline font-bold text-xl text-[#4cd7f6]">${avoidedDowntimeDollars.toLocaleString()}</span>
          </div>
        </div>

        <p className="text-xs text-[#bcc9cd] leading-relaxed">
          Executing bearings overhaul and automated telemetry vibration drift alarm breaks the primary thermal vibration cascade pathway.
        </p>

        <button
          type="button"
          onClick={onNavigateToSimulation}
          className="w-full py-3 rounded-xl bg-[#222a3d] hover:bg-[#334155] text-[#4cd7f6] border border-[#4cd7f6]/40 font-headline font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
        >
          <span>Explore Full What-If Simulator & Org Memory</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

      {/* Forensic Asset Imagery */}
      <div className="p-4 rounded-2xl bg-[#171f33] border border-[#1e293b] space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-[#bcc9cd] uppercase tracking-wider">Forensic Asset Imagery</span>
          <span className="font-mono text-xs text-[#4cd7f6]">Demo Telemetry Snap</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative rounded-xl overflow-hidden h-28 bg-[#131b2e] border border-[#222a3d]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQR7p-ZvDjbQzrRfDI7KLpQf1zTZ0IHF38yHBxD6x_bgkJ86Xk7oVNflEqDWUadaRVVWcc_Cjl8kvK49hYXkiyqLNDiBvYNxLwm7kmZA5Z12UCIlaGWnXw9BSujNmTUqketxTV88GZK7QIxqXSoDxWPwsDYv3O2JNk0xUTs_6h6EnJbCH0m-eZseAjQlGuHMD7btou_yYrGeOHPIL-wCcRh3q96os2TWlNI3Ww7YhCyBvKjZaRcVywQw"
              alt="Spindle lower hub visual inspection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060e20] via-transparent to-transparent flex items-end p-2">
              <div>
                <p className="font-mono text-[11px] text-[#dae2fd]">SPINDLE LOWER HUB</p>
                <p className="font-mono text-[10px] text-[#4cd7f6]">Thermal wear index: 0.88</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden h-28 bg-[#131b2e] border border-[#222a3d] p-3 flex flex-col justify-between">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[28px]">graphic_eq</span>
            <div>
              <p className="font-mono text-[11px] text-[#dae2fd]">SCADA TELEMETRY SNAP</p>
              <p className="font-mono text-[10px] text-[#4fdbc8]">13,000 RPM harmonic peak</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
