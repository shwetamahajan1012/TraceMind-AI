import React, { useState } from 'react';
import { CriticalityTier, Incident, IntakeProtocol } from '../types';

interface ReportViewProps {
  onSubmitIncident: (incidentData: Partial<Incident>, autoAnalyze: boolean) => Promise<void>;
  onReset: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ onSubmitIncident, onReset }) => {
  const [protocol, setProtocol] = useState<IntakeProtocol>('lab_equip');
  const [title, setTitle] = useState('Centrifuge C-3 Rotor Vibration Exceeded Safe Threshold');
  const [category, setCategory] = useState('Laboratory Equipment & Biosafety');
  const [location, setLocation] = useState('Bio-Tech Annex, Lab Room 204-B');
  const [timestamp, setTimestamp] = useState('Today, 10:45 AM');
  const [severity, setSeverity] = useState<CriticalityTier>('critical');
  const [impact, setImpact] = useState('Sample Loss & Protocol Delayed');
  const [downtime, setDowntime] = useState('5.5 Hours');
  const [description, setDescription] = useState(
    'During high-speed centrifugation (12,000 RPM) of clinical trial samples, the emergency vibration sensor tripped and automatic brake engaged. Rotor was balanced within standard +/- 0.05g tolerance before cycle. Similar wobble noted last Tuesday.'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // NLP Pre-Scan recurrence detection
  const hasRecurrenceKeywords = /similar|wobble|repeated|chatter|again|previous|recurring|drift/i.test(description);

  const handleSetNow = () => {
    const now = new Date();
    setTimestamp(`Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
  };

  const handleSubmit = async (autoAnalyze: boolean) => {
    if (!title.trim() || title.trim().length < 5) {
      setValidationError('Please enter a descriptive incident headline (min 5 characters).');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setValidationError('Please describe the failure sequence narrative (min 10 characters).');
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    try {
      const downtimeNum = parseFloat(downtime) || 5.5;
      await onSubmitIncident(
        {
          title: title.trim(),
          category,
          intakeProtocol: protocol,
          severity,
          location: location.trim(),
          timestamp,
          downtimeHours: downtimeNum,
          impactClassification: impact === 'Sample Loss & Protocol Delayed'
            ? 'Sample Loss & Protocol Delayed (> 4 hrs work backlog created)'
            : 'Minor Delay (< 1 hr), complete sample preservation',
          description: description.trim(),
          evidence: [
            {
              id: 'art-01',
              name: 'rotor_spindle_photo.jpg',
              type: 'image',
              sizeFormatted: '1.8 MB',
              url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQR7p-ZvDjbQzrRfDI7KLpQf1zTZ0IHF38yHBxD6x_bgkJ86Xk7oVNflEqDWUadaRVVWcc_Cjl8kvK49hYXkiyqLNDiBvYNxLwm7kmZA5Z12UCIlaGWnXw9BSujNmTUqketxTV88GZK7QIxqXSoDxWPwsDYv3O2JNk0xUTs_6h6EnJbCH0m-eZseAjQlGuHMD7btou_yYrGeOHPIL-wCcRh3q96os2TWlNI3Ww7YhCyBvKjZaRcVywQw',
              summary: 'Optical surface inspection showing circumferential micro-wear marks on lower bearing race.',
            },
            {
              id: 'art-02',
              name: 'sensor_telemetry_apr24.csv',
              type: 'csv',
              sizeFormatted: '3,400 data points synced',
              summary: 'Synchronous accelerometer spectrum indicating 4.28 mm/s vibration trip.',
            },
          ],
        },
        autoAnalyze
      );
      setSubmitSuccess(true);
    } catch (err: any) {
      setValidationError(err.message || 'Failed to submit incident');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      alert(`Attached telemetry asset: ${file.name} (${Math.round(file.size / 1024)} KB). Hashed for evidence chain.`);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-16 space-y-4">
      {/* Status Context Ribbon */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#222a3d] rounded-xl border border-[#334155] shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4fdbc8] animate-ping"></span>
          <span className="font-mono text-xs text-[#4fdbc8] uppercase tracking-widest font-semibold">
            Active Ingestion Engine
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#171f33] text-[#ffb95f] font-mono text-xs font-medium border border-[#3d494c]">
          DEMO DATA
        </span>
      </div>

      {/* Screen Narrative Header */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">dynamic_form</span>
          <h1 className="font-headline font-bold text-xl text-[#dae2fd]">New Incident Telemetry</h1>
        </div>
        <p className="text-xs sm:text-sm text-[#bcc9cd]">
          Log an operational disruption or safety anomaly for AI pattern detection.
        </p>
      </div>

      {/* Mode Selector (Intake Protocol) */}
      <div className="flex flex-col space-y-1.5">
        <label className="font-mono text-xs text-[#bcc9cd] uppercase tracking-wider">Intake Protocol</label>
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#171f33] rounded-xl border border-[#222a3d]">
          {[
            { id: 'lab_equip' as IntakeProtocol, label: 'Lab Equip' },
            { id: 'it_outage' as IntakeProtocol, label: 'IT Outage' },
            { id: 'safety_bio' as IntakeProtocol, label: 'Safety / Bio' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setProtocol(item.id)}
              className={`py-2 px-1 text-center rounded-lg font-mono text-xs transition-all ${
                protocol === item.id
                  ? 'bg-[#222a3d] text-[#dae2fd] font-bold shadow-sm border border-[#334155]'
                  : 'text-[#bcc9cd] hover:text-[#dae2fd]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div className="p-3 rounded-xl bg-[#ffb4ab]/15 border border-[#ffb4ab]/40 text-[#ffb4ab] text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{validationError}</span>
        </div>
      )}

      {/* 01 Primary Anomaly Spec */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#131b2e] border border-[#1e293b] space-y-4 shadow-md">
        <div className="flex items-center justify-between pb-1 border-b border-[#222a3d]">
          <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-wider font-semibold">
            01 // Primary Anomaly Spec
          </span>
          <span className="flex items-center gap-1 font-mono text-[11px] text-[#4fdbc8]">
            <span className="material-symbols-outlined text-[16px]">verified</span> Telemetry Synced
          </span>
        </div>

        {/* Title Field */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="incident-title" className="font-headline font-semibold text-xs text-[#dae2fd]">
              Incident Subject / Headline
            </label>
            <span className="font-mono text-[11px] text-[#bcc9cd]">{title.length}/120</span>
          </div>
          <div className="relative">
            <input
              id="incident-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-11 px-3.5 bg-[#171f33] border border-[#334155] rounded-xl text-[#dae2fd] text-xs sm:text-sm outline-none focus:border-[#4cd7f6] focus:ring-1 focus:ring-[#4cd7f6] transition-colors"
            />
            <span className="absolute right-3 top-3 material-symbols-outlined text-[#4fdbc8] text-[20px]">
              check_circle
            </span>
          </div>
          <p className="text-[11px] text-[#869397]">State the affected hardware identifier and observable failure mode.</p>
        </div>

        {/* Category & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="category-select" className="font-headline font-semibold text-xs text-[#dae2fd]">
              Classification Domain
            </label>
            <div className="relative">
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-3 bg-[#171f33] border border-[#334155] rounded-xl text-[#dae2fd] text-xs sm:text-sm outline-none focus:border-[#4cd7f6] appearance-none"
              >
                <option value="Laboratory Equipment & Biosafety">Laboratory Equipment & Biosafety</option>
                <option value="IT Network & Sensor Stream">IT Network & Sensor Stream</option>
                <option value="Chemical Safety & Containment">Chemical Safety & Containment</option>
                <option value="HVAC & Ambient Environmental Control">HVAC & Ambient Environmental Control</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-3 material-symbols-outlined text-[#bcc9cd] text-[20px]">
                arrow_drop_down
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="location-input" className="font-headline font-semibold text-xs text-[#dae2fd]">
              Location / Workstation ID
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 material-symbols-outlined text-[#bcc9cd] text-[18px]">
                location_on
              </span>
              <input
                id="location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-11 pl-9 pr-3 bg-[#171f33] border border-[#334155] rounded-xl text-[#dae2fd] text-xs sm:text-sm outline-none focus:border-[#4cd7f6]"
              />
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="timestamp-input" className="font-headline font-semibold text-xs text-[#dae2fd]">
              Recorded Anomaly Timestamp
            </label>
            <span className="font-mono text-[11px] text-[#4fdbc8] font-semibold">UTC-05:00</span>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-3 material-symbols-outlined text-[#bcc9cd] text-[18px]">
                schedule
              </span>
              <input
                id="timestamp-input"
                type="text"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="w-full h-11 pl-9 pr-3 bg-[#171f33] border border-[#334155] rounded-xl text-[#dae2fd] text-xs sm:text-sm outline-none focus:border-[#4cd7f6]"
              />
            </div>
            <button
              type="button"
              onClick={handleSetNow}
              className="px-4 h-11 bg-[#222a3d] hover:bg-[#334155] text-[#4cd7f6] font-mono text-xs font-bold rounded-xl border border-[#3d494c] transition-colors flex items-center gap-1 active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* 02 Severity & Risk Tiers */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#131b2e] border border-[#1e293b] space-y-4 shadow-md">
        <div className="flex items-center justify-between pb-1 border-b border-[#222a3d]">
          <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-wider font-semibold">
            02 // Severity & Risk Tiers
          </span>
          <span className="px-2 py-0.5 rounded bg-[#ffb4ab]/15 text-[#ffb4ab] font-mono text-[10px] uppercase font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-pulse"></span> Escalated
          </span>
        </div>

        {/* Criticality Selector */}
        <div className="flex flex-col space-y-1.5">
          <label className="font-headline font-semibold text-xs text-[#dae2fd]">Criticality Tier</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'low' as CriticalityTier, label: 'Low', icon: 'low_priority', color: 'text-[#4fdbc8]' },
              { id: 'medium' as CriticalityTier, label: 'Med', icon: 'warning_amber', color: 'text-[#ffb95f]' },
              { id: 'high' as CriticalityTier, label: 'High', icon: 'priority_high', color: 'text-[#e79400]' },
              { id: 'critical' as CriticalityTier, label: 'Critical', icon: 'error', color: 'text-[#ffb4ab]' },
            ].map((t) => {
              const isSelected = severity === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSeverity(t.id)}
                  className={`py-2.5 px-1 rounded-xl font-mono text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-[#93000a] text-[#ffdad6] border border-[#ffb4ab] shadow-lg shadow-[#93000a]/30'
                      : 'bg-[#171f33] text-[#bcc9cd] border border-[#222a3d] hover:border-[#334155]'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[16px] ${isSelected ? 'text-[#ffdad6]' : t.color}`}>
                    {t.icon}
                  </span>
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Operational Impact & Downtime */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex flex-col space-y-1.5">
            <label className="font-headline font-semibold text-xs text-[#dae2fd]">
              Operational Impact Classification
            </label>
            <div className="p-2 bg-[#171f33] rounded-xl border border-[#222a3d] space-y-2">
              <label
                onClick={() => setImpact('Sample Loss & Protocol Delayed')}
                className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                  impact === 'Sample Loss & Protocol Delayed'
                    ? 'bg-[#222a3d] text-[#dae2fd] border border-[#06b6d4]/40'
                    : 'text-[#bcc9cd] hover:bg-[#1e293b]'
                }`}
              >
                <span className="material-symbols-outlined text-[#4cd7f6] text-[18px] mt-0.5">
                  {impact === 'Sample Loss & Protocol Delayed' ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-medium">Sample Loss & Protocol Delayed</span>
                  <span className="text-[10px] text-[#ffb95f] font-mono">&gt; 4 hrs work backlog created</span>
                </div>
              </label>

              <label
                onClick={() => setImpact('Minor Delay')}
                className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                  impact === 'Minor Delay'
                    ? 'bg-[#222a3d] text-[#dae2fd] border border-[#06b6d4]/40'
                    : 'text-[#bcc9cd] hover:bg-[#1e293b]'
                }`}
              >
                <span className="material-symbols-outlined text-[#4cd7f6] text-[18px] mt-0.5">
                  {impact === 'Minor Delay' ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
                <span className="text-xs">Minor Delay (&lt; 1 hr), sample preserved</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="downtime-input" className="font-headline font-semibold text-xs text-[#dae2fd]">
                Estimated Downtime
              </label>
              <span className="font-mono text-[11px] text-[#4fdbc8] font-semibold">Takt Impact: -18%</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-3 material-symbols-outlined text-[#bcc9cd] text-[18px]">
                timelapse
              </span>
              <input
                id="downtime-input"
                type="text"
                value={downtime}
                onChange={(e) => setDowntime(e.target.value)}
                className="w-full h-11 pl-9 pr-3 bg-[#171f33] border border-[#334155] rounded-xl text-[#dae2fd] text-xs sm:text-sm outline-none focus:border-[#4cd7f6]"
              />
            </div>
          </div>
        </div>

        {/* Failure Sequence Narrative */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="description-input" className="font-headline font-semibold text-xs text-[#dae2fd]">
              Failure Sequence Narrative
            </label>
            <span className="font-mono text-[11px] text-[#4cd7f6] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">auto_fix_high</span> NLP Pre-Scan Active
            </span>
          </div>
          <textarea
            id="description-input"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-[#171f33] border border-[#334155] rounded-xl text-[#dae2fd] text-xs sm:text-sm leading-relaxed outline-none focus:border-[#4cd7f6] resize-none"
          />
          <div className="flex items-center justify-between">
            {hasRecurrenceKeywords ? (
              <span className="font-mono text-[11px] text-[#4fdbc8] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check</span> Recurrence keyword detected: "Similar wobble"
              </span>
            ) : (
              <span className="font-mono text-[11px] text-[#bcc9cd]">Enter keywords to trigger causal matching</span>
            )}
            <span className="font-mono text-[11px] text-[#869397]">{description.length} chars</span>
          </div>
        </div>
      </div>

      {/* 03 Photographic Telemetry */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#131b2e] border border-[#1e293b] space-y-3 shadow-md">
        <div className="flex items-center justify-between pb-1 border-b border-[#222a3d]">
          <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-wider font-semibold">
            03 // Photographic Telemetry
          </span>
          <span className="font-mono text-xs text-[#bcc9cd]">2 Artifacts Attached</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Card 1: Photo */}
          <div className="relative rounded-xl overflow-hidden h-28 bg-[#171f33] border border-[#222a3d] group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQR7p-ZvDjbQzrRfDI7KLpQf1zTZ0IHF38yHBxD6x_bgkJ86Xk7oVNflEqDWUadaRVVWcc_Cjl8kvK49hYXkiyqLNDiBvYNxLwm7kmZA5Z12UCIlaGWnXw9BSujNmTUqketxTV88GZK7QIxqXSoDxWPwsDYv3O2JNk0xUTs_6h6EnJbCH0m-eZseAjQlGuHMD7btou_yYrGeOHPIL-wCcRh3q96os2TWlNI3Ww7YhCyBvKjZaRcVywQw"
              alt="Centrifuge spindle shaft diagnostic photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060e20] via-transparent to-transparent flex items-end p-2">
              <span className="font-mono text-xs text-[#dae2fd] truncate">rotor_spindle_photo.jpg</span>
            </div>
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#04b4a2] text-[#003f38] font-mono text-[10px] font-bold">
              1.8 MB
            </div>
          </div>

          {/* Card 2: CSV Log */}
          <div className="relative rounded-xl overflow-hidden h-28 bg-[#171f33] border border-[#222a3d] p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[26px]">insights</span>
              <span className="px-2 py-0.5 rounded-full bg-[#222a3d] text-[#4cd7f6] font-mono text-[10px]">
                CSV LOG
              </span>
            </div>
            <div>
              <p className="font-mono text-xs text-[#dae2fd] truncate">sensor_telemetry_apr24.csv</p>
              <p className="font-mono text-[11px] text-[#4fdbc8]">3,400 data points synced</p>
            </div>
          </div>
        </div>

        {/* Dropper Box */}
        <label className="p-4 rounded-xl bg-[#222a3d]/60 border border-dashed border-[#334155] hover:border-[#4cd7f6] flex flex-col items-center justify-center text-center space-y-1.5 cursor-pointer transition-colors">
          <input type="file" onChange={handleFileDrop} className="hidden" />
          <div className="w-10 h-10 rounded-full bg-[#171f33] flex items-center justify-center text-[#4cd7f6] shadow-inner">
            <span className="material-symbols-outlined text-[22px]">cloud_upload</span>
          </div>
          <span className="font-headline font-semibold text-xs text-[#dae2fd]">
            Drop or Tap to Attach Diagnostic Telemetry
          </span>
          <span className="text-[11px] text-[#869397]">
            Supports .CSV, .JSON vibration dumps, or JPG optical scans (up to 50MB)
          </span>
        </label>
      </div>

      {/* AI Correlative Notice Banner */}
      <div className="p-4 rounded-2xl bg-[#222a3d] border border-[#334155] relative overflow-hidden shadow-md">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#06b6d4] text-[#003640] shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[20px]">smart_toy</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-sm text-[#dae2fd]">TraceMind Recurrence Engine</span>
              <span className="px-1.5 py-0.2 rounded bg-[#06b6d4]/20 text-[#4cd7f6] font-mono text-[10px]">LIVE</span>
            </div>
            <p className="text-xs text-[#bcc9cd] leading-relaxed">
              TraceMind AI will compare this report against <strong className="text-[#dae2fd]">342 historical lab records</strong> to evaluate recurrence probability, isolate root cause pathways, and draft automated CAPA tickets.
            </p>
          </div>
        </div>
      </div>

      {/* Primary & Secondary Actions */}
      <div className="flex flex-col space-y-2.5 pt-2">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleSubmit(true)}
          className="relative overflow-hidden w-full h-14 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#4cd7f6] text-[#003640] font-headline font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#06b6d4]/30 active:scale-[0.98] transition-all disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[22px]">progress_activity</span>
              <span>Correlating 342 Historical Nodes...</span>
            </>
          ) : submitSuccess ? (
            <>
              <span className="material-symbols-outlined text-[22px]">verified</span>
              <span>Pattern Triangulated & Saved!</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[22px]">electric_bolt</span>
              <span>Analyze Incident with TraceMind AI</span>
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="h-11 rounded-xl bg-[#171f33] border border-[#334155] hover:border-[#4cd7f6] text-[#dae2fd] font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="h-11 rounded-xl bg-[#060e20] text-[#bcc9cd] hover:text-[#dae2fd] border border-[#1e293b] font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">cancel</span>
            <span>Discard Form</span>
          </button>
        </div>
      </div>
    </div>
  );
};
