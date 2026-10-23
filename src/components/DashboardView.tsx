import React, { useState } from 'react';
import { Incident, PreventiveAction } from '../types';

interface DashboardViewProps {
  incidents: Incident[];
  actions: PreventiveAction[];
  onSelectIncident: (incident: Incident) => void;
  onNavigateToReport: () => void;
  onNavigateToInvestigate: () => void;
  onApproveAction: (actionId: string) => Promise<void>;
  onReviewAction: (actionId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  incidents,
  actions,
  onSelectIncident,
  onNavigateToReport,
  onNavigateToInvestigate,
  onApproveAction,
  onReviewAction,
}) => {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '6m'>('6m');
  const [approvingActionId, setApprovingActionId] = useState<string | null>(null);

  // Derived real metrics
  const totalLogged = incidents.length + 38; // base legacy campus records + active session
  const recurrentCount = incidents.filter(
    (i) => i.description.toLowerCase().includes('similar') || i.description.toLowerCase().includes('recurrent')
  ).length + 12;
  const recurrentPercent = Math.round((recurrentCount / totalLogged) * 100);
  const activeCapaCount = actions.filter((a) => a.status === 'proposed' || a.status === 'approved' || a.status === 'in_progress').length;
  const resolvedCount = incidents.filter((i) => i.status === 'resolved' || i.status === 'closed').length + 26;
  const resolvedPercent = Math.round((resolvedCount / totalLogged) * 100);

  const handleApprove = async (actionId: string) => {
    try {
      setApprovingActionId(actionId);
      await onApproveAction(actionId);
    } finally {
      setApprovingActionId(null);
    }
  };

  const priorityActions = actions.slice(0, 2);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto pb-12 space-y-4">
      {/* Status Context Ribbon */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#222a3d] rounded-xl border border-[#334155] shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4fdbc8] animate-ping"></span>
          <span className="font-mono text-xs text-[#4fdbc8] uppercase tracking-widest font-semibold">
            Live Monitoring Active
          </span>
          <span className="text-xs text-[#bcc9cd] hidden sm:inline">| Bio-Safety Lab 3...</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#171f33] text-[#ffb95f] font-mono text-xs font-medium border border-[#3d494c]">
          DEMO DATA
        </span>
      </div>

      {/* Facility Incident Hub Banner */}
      <div className="bg-[#171f33] rounded-2xl p-5 border border-[#1e293b] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-2xl">science</span>
            <h1 className="font-headline font-bold text-xl sm:text-2xl text-[#dae2fd]">Facility Incident Hub</h1>
          </div>
          <p className="text-sm text-[#bcc9cd] mt-1">Learn from every failure. Prevent the next one.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateToReport}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#06b6d4] text-[#003640] font-headline font-bold text-xs uppercase tracking-wide shadow-md shadow-[#06b6d4]/20 hover:bg-[#4cd7f6] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Report Incident</span>
          </button>
          <button
            onClick={onNavigateToInvestigate}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#222a3d] text-[#dae2fd] border border-[#334155] hover:border-[#4cd7f6] font-headline font-bold text-xs uppercase tracking-wide active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">auto_awesome</span>
            <span>Investigate</span>
          </button>
        </div>
      </div>

      {/* Visual Diagnostic Zone Banner */}
      <div className="relative rounded-2xl overflow-hidden h-36 bg-[#131b2e] border border-[#1e293b] shadow-md group">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5SsKgqx-dL6TueGw29UG1tdGMr83_VOr1xSQc3_kpiRvRhLZHxSBov-z_Hov7PpYP36uvKL4TmhLnY0yLfuIiXyJEt9-zzau22LBGciAbJ9PYxLGQJbz9l8M3vuEQ9Umslo0KB_k8zy2YUvlMjG6XrrwR3yWhxtgyzWqMNLJvUGfZrKwEnFWqhKfdfKlVAx_kFig95JTJGyWXM_UVPGgxWmKWQwpBgyWqDa27lwNZlGoA7I1DG4XqMQ"
          alt="Bio-tech engineering diagnostics facility"
          className="w-full h-full object-cover opacity-35 filter saturate-150"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-[#0b1326]/60 to-transparent"></div>
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[#dae2fd]">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">hub</span>
            <span>3 Zones Evaluated • Next Sync: 4m</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-md bg-[#222a3d]/90 text-[#4cd7f6] font-mono text-xs font-semibold border border-[#3d494c]">
            RCA ENGINE v2.4
          </span>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Logged */}
        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#1e293b] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#bcc9cd] uppercase tracking-wider">Total Logged</span>
            <span className="material-symbols-outlined text-[#bcc9cd] text-[18px]">receipt_long</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline font-bold text-2xl sm:text-3xl text-[#dae2fd]">{totalLogged}</span>
            <span className="text-xs text-[#4cd7f6] font-mono">+3 mo</span>
          </div>
          <span className="text-[11px] text-[#869397] mt-1 truncate">Campus & IT telemetry</span>
        </div>

        {/* Recurrent */}
        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#1e293b] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#ffb95f] uppercase tracking-wider">Recurrent</span>
            <span className="material-symbols-outlined text-[#ffb95f] text-[18px]">sync_problem</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline font-bold text-2xl sm:text-3xl text-[#ffb95f]">{recurrentCount}</span>
            <span className="text-xs text-[#ffb95f] font-mono">{recurrentPercent}%</span>
          </div>
          <span className="text-[11px] text-[#ffb95f]/80 mt-1 truncate">Requires CAPA review</span>
        </div>

        {/* Active CAPA */}
        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#1e293b] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-wider">Active CAPA</span>
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">checklist</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline font-bold text-2xl sm:text-3xl text-[#4cd7f6]">{activeCapaCount}</span>
            <span className="text-xs text-[#4cd7f6] font-mono">open</span>
          </div>
          <span className="text-[11px] text-[#4fdbc8] mt-1 truncate">2 due this week</span>
        </div>

        {/* Resolved */}
        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#1e293b] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#4fdbc8] uppercase tracking-wider">Resolved</span>
            <span className="material-symbols-outlined text-[#4fdbc8] text-[18px]">check_circle</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline font-bold text-2xl sm:text-3xl text-[#4fdbc8]">{resolvedCount}</span>
            <span className="text-xs text-[#4fdbc8] font-mono">{resolvedPercent}%</span>
          </div>
          <span className="text-[11px] text-[#4fdbc8]/80 mt-1 truncate">Resolution goal met</span>
        </div>
      </div>

      {/* Critical Recurrence Alert Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#171f33] border border-[#ffb4ab]/30 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between pb-2 border-b border-[#222a3d]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab] animate-pulse"></span>
            <span className="font-mono text-xs text-[#ffb4ab] uppercase font-bold tracking-wider">
              Critical Recurrence Alert
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#222a3d] text-[#bcc9cd] font-mono text-[11px]">
            Zone: Lab 204-B / Centrifuge C-3
          </span>
        </div>

        <div className="mt-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <h2 className="font-headline font-bold text-base sm:text-lg text-[#dae2fd]">
              Centrifuge C-3 Rotor Vibration Exceeded Safe Threshold
            </h2>
            <p className="text-xs sm:text-sm text-[#bcc9cd] leading-relaxed">
              Causal engine matched 3 past anomalies across Bio-Lab centrifuges. Micro-galling wear curve on drive spindle
              identified under 11,850 RPM load.
            </p>
          </div>

          {/* Circular Risk Gauge Mini */}
          <div className="flex items-center gap-4 bg-[#131b2e] px-4 py-3 rounded-xl border border-[#334155] shrink-0">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#222a3d]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#ffb4ab]"
                  strokeDasharray="84, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-mono font-bold text-xs text-[#ffb4ab]">84</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs text-[#ffb4ab] font-bold uppercase">Critical Risk (84/100)</span>
              <span className="text-[11px] text-[#bcc9cd]">Estimated failure &lt;72 hrs</span>
              <button
                onClick={onNavigateToInvestigate}
                className="mt-1 flex items-center gap-1 text-xs text-[#4cd7f6] hover:underline font-semibold"
              >
                <span>Inspect</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Incident & Recurrence Trajectory Chart */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#171f33] border border-[#1e293b] shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-headline font-bold text-base text-[#dae2fd]">Incident & Recurrence Trajectory</h2>
            <p className="text-xs text-[#bcc9cd]">Frequency comparison over time</p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-[#131b2e] rounded-xl border border-[#222a3d]">
            {(['30d', '90d', '6m'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  timeRange === r
                    ? 'bg-[#222a3d] text-[#4cd7f6] font-bold shadow-sm'
                    : 'text-[#bcc9cd] hover:text-[#dae2fd]'
                }`}
              >
                {r === '30d' ? '30 Days' : r === '90d' ? '90 Days' : '6 Mos'}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#06b6d4]"></span>
            <span className="text-[#bcc9cd]">Total Incidents</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ffb95f]"></span>
            <span className="text-[#bcc9cd]">Recurring</span>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="w-full h-44 bg-[#0b1326] rounded-xl p-3 relative flex items-end justify-between border border-[#1e293b]">
          {[
            { month: 'Nov', total: 6, rec: 2, hTotal: 40, hRec: 20 },
            { month: 'Dec', total: 4, rec: 1, hTotal: 28, hRec: 14 },
            { month: 'Jan', total: 9, rec: 3, hTotal: 65, hRec: 32 },
            { month: 'Feb', total: 14, rec: 5, hTotal: 95, hRec: 48 },
            { month: 'Mar', total: 7, rec: 2, hTotal: 52, hRec: 22 },
            { month: 'Apr', total: 11, rec: 4, hTotal: 78, hRec: 38 },
          ].map((bar) => (
            <div key={bar.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              {/* Tooltip on hover */}
              <div className="hidden group-hover:block absolute top-2 bg-[#222a3d] border border-[#334155] px-2 py-1 rounded text-[11px] font-mono text-[#dae2fd] shadow-md z-20">
                {bar.month}: {bar.total} Total, {bar.rec} Recurrent
              </div>
              <div className="w-full flex items-end justify-center gap-1.5 h-32">
                <div
                  style={{ height: `${bar.hTotal}%` }}
                  className="w-4 sm:w-6 bg-gradient-to-t from-[#00687a] to-[#06b6d4] rounded-t-md transition-all group-hover:brightness-125"
                ></div>
                <div
                  style={{ height: `${bar.hRec}%` }}
                  className="w-2.5 sm:w-3.5 bg-[#ffb95f] rounded-t-md opacity-90 transition-all group-hover:brightness-125"
                ></div>
              </div>
              <span className="font-mono text-xs text-[#bcc9cd]">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Actions Section */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#171f33] border border-[#1e293b] shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-headline font-bold text-base text-[#dae2fd]">Priority Actions</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#ffb4ab]/20 text-[#ffb4ab] font-mono text-xs">
              {actions.filter((a) => a.status === 'proposed').length} Required
            </span>
          </div>
          <button
            onClick={onNavigateToInvestigate}
            className="text-xs text-[#4cd7f6] hover:underline font-mono font-semibold"
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          {priorityActions.map((action) => (
            <div
              key={action.id}
              className="p-3.5 rounded-xl bg-[#131b2e] border border-[#222a3d] space-y-2 hover:border-[#334155] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-[#ffb4ab]/20 text-[#ffb4ab] font-mono text-[11px] font-bold">
                  {action.priority}
                </span>
                <span className="font-mono text-[11px] text-[#ffb95f] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  {action.suggestedDeadline}
                </span>
              </div>
              <p className="font-headline font-semibold text-sm text-[#dae2fd]">{action.title}</p>
              <p className="text-xs text-[#bcc9cd]">Assigned to: {action.responsibleRole}</p>

              <div className="flex items-center justify-between pt-2 border-t border-[#1e293b]">
                <span className="text-[11px] text-[#4fdbc8] font-mono flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Validated by AI Memory
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(action.id)}
                    disabled={approvingActionId === action.id || action.status === 'approved'}
                    className="px-3 py-1 rounded-lg bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] font-mono text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {action.status === 'approved' ? 'Approved' : approvingActionId === action.id ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => onReviewAction(action.id)}
                    className="px-3 py-1 rounded-lg bg-[#222a3d] hover:bg-[#334155] text-[#dae2fd] font-mono text-xs font-medium transition-all"
                  >
                    Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Incidents Stream Live Feed */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#171f33] border border-[#1e293b] shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-headline font-bold text-base text-[#dae2fd]">Recent Incidents Stream</h2>
          <span className="font-mono text-xs text-[#4fdbc8] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4fdbc8] animate-ping"></span>
            Live feed
          </span>
        </div>

        <div className="space-y-2.5">
          {incidents.map((incident) => {
            const isRecurrent =
              incident.description.toLowerCase().includes('similar') ||
              incident.description.toLowerCase().includes('recurrent');
            return (
              <div
                key={incident.id}
                onClick={() => onSelectIncident(incident)}
                className="p-3.5 rounded-xl bg-[#131b2e] border border-[#222a3d] hover:border-[#06b6d4] cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#4cd7f6]">#{incident.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                        incident.severity === 'critical'
                          ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                          : incident.severity === 'high'
                          ? 'bg-[#ffb95f]/20 text-[#ffb95f]'
                          : 'bg-[#4fdbc8]/20 text-[#4fdbc8]'
                      }`}
                    >
                      {incident.severity}
                    </span>
                    <span className="text-xs text-[#bcc9cd] truncate">{incident.location}</span>
                  </div>
                  <span className="font-mono text-xs text-[#869397]">{incident.timestamp}</span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <p className="font-headline font-medium text-sm text-[#dae2fd] group-hover:text-[#4cd7f6] transition-colors line-clamp-1">
                    {incident.title}
                  </p>
                  <span className="material-symbols-outlined text-[#869397] group-hover:text-[#4cd7f6] text-[18px]">
                    chevron_right
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  {isRecurrent ? (
                    <span className="px-2 py-0.5 rounded bg-[#ffb95f]/15 text-[#ffb95f] font-mono text-[11px] font-medium">
                      Likely Recurrence (Pattern match)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-[#4fdbc8]/15 text-[#4fdbc8] font-mono text-[11px] font-medium">
                      Isolated anomaly
                    </span>
                  )}
                  <span className="font-mono text-[#bcc9cd]">
                    Status: <strong className="text-[#dae2fd] capitalize">{incident.status}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
