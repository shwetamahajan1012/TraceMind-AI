import React from 'react';

export type TabId = 'dashboard' | 'report' | 'investigate' | 'risk-and-actions' | 'simulation';

interface BottomNavProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  onQuickReportClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab, onQuickReportClick }) => {
  const tabs = [
    { id: 'dashboard' as TabId, label: 'Dashboard', icon: 'dashboard' },
    { id: 'report' as TabId, label: 'Report', icon: 'warning' },
    { id: 'investigate' as TabId, label: 'Investigate', icon: 'auto_awesome' },
    { id: 'risk-and-actions' as TabId, label: 'Risk & CAPA', icon: 'verified_user' },
    { id: 'simulation' as TabId, label: 'Simulation', icon: 'tune' },
  ];

  return (
    <>
      {/* Floating Quick Action FAB */}
      {activeTab !== 'report' && (
        <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-40">
          <button
            onClick={onQuickReportClick}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#06b6d4] to-[#4cd7f6] text-[#003640] font-headline font-semibold text-sm rounded-full shadow-[0_4px_20px_rgba(6,182,212,0.4)] hover:shadow-[0_6px_24px_rgba(6,182,212,0.6)] active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#acedff]"
            aria-label="Report new incident telemetry"
          >
            <span className="material-symbols-outlined text-[20px]">add_alert</span>
            <span className="font-mono text-xs uppercase tracking-wider font-bold">Report Incident</span>
          </button>
        </div>
      )}

      {/* Persistent Navigation Bar */}
      <nav
        aria-label="Main Navigation"
        className="fixed bottom-0 w-full z-50 pb-safe bg-[#0b1326]/90 backdrop-blur-xl border-t border-[#1e293b] shadow-[0_-2px_12px_rgba(0,0,0,0.5)]"
      >
        <div className="max-w-2xl mx-auto flex justify-around items-center h-16 px-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4cd7f6] ${
                  isActive
                    ? 'text-[#4cd7f6] font-semibold scale-105'
                    : 'text-[#bcc9cd] hover:text-[#dae2fd]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {tab.icon}
                </span>
                <span className="font-mono text-[11px] tracking-tight mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
