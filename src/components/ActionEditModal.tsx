import React, { useState } from 'react';
import { ActionPriority, PreventiveAction } from '../types';

interface ActionEditModalProps {
  action?: PreventiveAction | null;
  incidentId: string;
  onClose: () => void;
  onSave: (actionData: Partial<PreventiveAction>) => Promise<void>;
}

export const ActionEditModal: React.FC<ActionEditModalProps> = ({
  action,
  incidentId,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(action?.title || '');
  const [description, setDescription] = useState(action?.description || '');
  const [priority, setPriority] = useState<ActionPriority>(action?.priority || 'P2 - High');
  const [responsibleRole, setResponsibleRole] = useState(
    action?.responsibleRole || 'Sr. Equipment Maintenance Specialist'
  );
  const [suggestedDeadline, setSuggestedDeadline] = useState(action?.suggestedDeadline || 'Within 7 Days');
  const [verificationMethod, setVerificationMethod] = useState(
    action?.verificationMethod || 'Laser alignment & diagnostic burn-in'
  );
  const [reason, setReason] = useState(action?.reason || 'Mitigate identified failure vector');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.trim().length < 5) {
      setError('Title must be at least 5 characters');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await onSave({
        incidentId,
        title: title.trim(),
        description: description.trim(),
        priority,
        responsibleRole: responsibleRole.trim(),
        suggestedDeadline: suggestedDeadline.trim(),
        verificationMethod: verificationMethod.trim(),
        reason: reason.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save action');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060e20]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#171f33] border border-[#334155] rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#222a3d]">
          <h2 className="font-headline font-bold text-base text-[#dae2fd]">
            {action ? 'Edit Preventive Action' : 'Propose New CAPA Action'}
          </h2>
          <button onClick={onClose} className="text-[#bcc9cd] hover:text-[#dae2fd]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {error && (
          <div className="p-2.5 rounded-lg bg-[#93000a]/20 border border-[#ffb4ab]/40 text-[#ffb4ab] text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="flex flex-col space-y-1">
            <label className="font-semibold text-[#dae2fd]">Action Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Recalibrate pressure relief sensor PRV-04"
              className="w-full h-10 px-3 bg-[#131b2e] border border-[#334155] rounded-xl text-[#dae2fd] outline-none focus:border-[#4cd7f6]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col space-y-1">
              <label className="font-semibold text-[#dae2fd]">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ActionPriority)}
                className="w-full h-10 px-3 bg-[#131b2e] border border-[#334155] rounded-xl text-[#dae2fd] outline-none focus:border-[#4cd7f6]"
              >
                <option value="P1 - Critical">P1 - Critical</option>
                <option value="P2 - High">P2 - High</option>
                <option value="P3 - Moderate">P3 - Moderate</option>
                <option value="P4 - Low">P4 - Low</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="font-semibold text-[#dae2fd]">Deadline</label>
              <input
                type="text"
                value={suggestedDeadline}
                onChange={(e) => setSuggestedDeadline(e.target.value)}
                placeholder="e.g. Within 48 hours"
                className="w-full h-10 px-3 bg-[#131b2e] border border-[#334155] rounded-xl text-[#dae2fd] outline-none focus:border-[#4cd7f6]"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-semibold text-[#dae2fd]">Responsible Role / Person</label>
            <input
              type="text"
              value={responsibleRole}
              onChange={(e) => setResponsibleRole(e.target.value)}
              className="w-full h-10 px-3 bg-[#131b2e] border border-[#334155] rounded-xl text-[#dae2fd] outline-none focus:border-[#4cd7f6]"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-semibold text-[#dae2fd]">Verification Method</label>
            <input
              type="text"
              value={verificationMethod}
              onChange={(e) => setVerificationMethod(e.target.value)}
              placeholder="e.g. Laser alignment & 15-min vibration burn-in"
              className="w-full h-10 px-3 bg-[#131b2e] border border-[#334155] rounded-xl text-[#dae2fd] outline-none focus:border-[#4cd7f6]"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-semibold text-[#dae2fd]">Detailed Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Technical procedure steps and counter-measures..."
              className="w-full p-2.5 bg-[#131b2e] border border-[#334155] rounded-xl text-[#dae2fd] outline-none focus:border-[#4cd7f6] resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#222a3d]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#222a3d] text-[#bcc9cd] font-mono text-xs hover:text-[#dae2fd]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-[#06b6d4] text-[#003640] font-headline font-bold text-xs hover:bg-[#4cd7f6] transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : action ? 'Update Action' : 'Submit CAPA Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
