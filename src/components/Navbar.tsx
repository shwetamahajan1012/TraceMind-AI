import React, { useState } from 'react';
import { UserSession } from '../types';

interface NavbarProps {
  currentUser: UserSession;
  onSwitchUser: (user: UserSession) => void;
  systemHealth: { status: string; aiEngine: string } | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onSwitchUser, systemHealth }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const availableUsers: UserSession[] = [
    {
      userId: 'usr-sarah-k',
      name: 'Sarah K.',
      role: 'Lead Investigator',
      email: 's.k@tracemind.lab',
      organizationId: 'lab-ops-01',
    },
    {
      userId: 'usr-vance',
      name: 'Dr. M. Vance',
      role: 'Quality & Safety Lead',
      email: 'm.vance@tracemind.lab',
      organizationId: 'lab-ops-01',
    },
    {
      userId: 'usr-marcus',
      name: 'Marcus T.',
      role: 'Operator',
      email: 'm.t@tracemind.lab',
      organizationId: 'lab-ops-01',
    },
    {
      userId: 'usr-admin',
      name: 'Chief Biosafety Officer',
      role: 'Facilities Admin',
      email: 'admin@tracemind.lab',
      organizationId: 'lab-ops-01',
    },
  ];

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#0b1326]/90 backdrop-blur-xl border-b border-[#1e293b] shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#00687a] flex items-center justify-center shadow-lg shadow-[#06b6d4]/20 border border-[#4cd7f6]/40">
            <span className="material-symbols-outlined text-[#003640] text-2xl font-bold">biotech</span>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-lg sm:text-xl text-[#dae2fd] tracking-tight leading-none">
                TraceMind AI
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#222a3d] text-[#4cd7f6] font-mono text-[10px] sm:text-xs uppercase tracking-wide border border-[#3d494c]">
                DEMO | LAB-OPS
              </span>
            </div>
            <span className="text-xs text-[#bcc9cd] line-clamp-1 leading-tight font-sans mt-0.5 hidden xs:inline">
              Learn from every failure. Prevent the next one.
            </span>
          </div>
        </div>

        {/* Right: Engine Status, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Engine indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#131b2e] border border-[#222a3d]">
            <span className="w-2 h-2 rounded-full bg-[#4fdbc8] animate-pulse"></span>
            <span className="text-xs text-[#bcc9cd] font-mono">
              {systemHealth?.aiEngine || 'Gemini 3.8 Flash Online'}
            </span>
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-10 h-10 flex items-center justify-center rounded-lg text-[#bcc9cd] hover:text-[#4cd7f6] hover:bg-[#171f33] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4cd7f6]"
              aria-label="Toggle notifications"
              aria-expanded={showNotifications}
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#ffb4ab] ring-2 ring-[#0b1326] animate-pulse"></span>
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#171f33] border border-[#334155] p-4 shadow-2xl z-50">
                <div className="flex items-center justify-between pb-2 border-b border-[#222a3d]">
                  <span className="font-headline font-semibold text-sm text-[#dae2fd]">Diagnostic Alerts</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#ffb4ab]/20 text-[#ffb4ab] font-mono text-[10px]">
                    2 Unresolved
                  </span>
                </div>
                <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto">
                  <div className="p-2.5 rounded-lg bg-[#131b2e] border border-[#ffb4ab]/30 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#ffb4ab] text-[18px] mt-0.5">warning</span>
                    <div>
                      <p className="text-xs font-semibold text-[#dae2fd]">Centrifuge C-3 Recurrence Trigger</p>
                      <p className="text-[11px] text-[#bcc9cd] mt-0.5">84/100 probability threshold crossed in Lab 204-B.</p>
                      <span className="text-[10px] text-[#ffb95f] font-mono">14m ago · Escalated to P1</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#131b2e] border border-[#222a3d] flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#4cd7f6] text-[18px] mt-0.5">verified_user</span>
                    <div>
                      <p className="text-xs font-semibold text-[#dae2fd]">CAPA-2024-002 Approved</p>
                      <p className="text-[11px] text-[#bcc9cd] mt-0.5">SCADA vibration alert rule authorized by Sarah K.</p>
                      <span className="text-[10px] text-[#4fdbc8] font-mono">1h ago · In Progress</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-full mt-3 py-1.5 text-center text-xs text-[#4cd7f6] hover:underline font-mono"
                >
                  Dismiss Alerts
                </button>
              </div>
            )}
          </div>

          {/* User Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#171f33] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4cd7f6]"
              aria-label="User account and role menu"
              aria-expanded={showUserMenu}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#06b6d4] to-[#4fdbc8] flex items-center justify-center font-bold text-xs text-[#003640] border border-[#acedff]">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-medium text-[#dae2fd]">{currentUser.name}</span>
                <span className="text-[10px] text-[#4cd7f6] font-mono">{currentUser.role}</span>
              </div>
              <span className="material-symbols-outlined text-[#bcc9cd] text-lg">arrow_drop_down</span>
            </button>

            {/* User Switcher Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#171f33] border border-[#334155] p-3 shadow-2xl z-50">
                <div className="pb-2 border-b border-[#222a3d]">
                  <p className="text-xs text-[#bcc9cd] font-mono uppercase">Simulate Role / User</p>
                  <p className="text-xs text-[#dae2fd] font-semibold mt-0.5">Switch active credentials</p>
                </div>
                <div className="mt-2 space-y-1">
                  {availableUsers.map((u) => (
                    <button
                      key={u.userId}
                      onClick={() => {
                        onSwitchUser(u);
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        currentUser.userId === u.userId
                          ? 'bg-[#06b6d4]/20 text-[#4cd7f6] font-semibold border border-[#06b6d4]/30'
                          : 'text-[#bcc9cd] hover:bg-[#222a3d] hover:text-[#dae2fd]'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-[10px] text-[#bcc9cd]">{u.role}</div>
                      </div>
                      {currentUser.userId === u.userId && (
                        <span className="material-symbols-outlined text-sm text-[#4cd7f6]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
