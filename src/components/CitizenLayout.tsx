import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  AlertTriangle,
  BookOpen,
  HelpCircle,
  Home,
  LayoutDashboard,
  ShieldAlert,
  Wallet,
  X,
} from 'lucide-react';
import { useFinvora } from '../context/FinvoraContext';
import { LANGUAGES } from '../i18n/translations';
import { VoiceAssistantDrawer } from './VoiceAssistantDrawer';

interface CitizenLayoutProps {
  children: React.ReactNode;
}

export const CitizenLayout: React.FC<CitizenLayoutProps> = ({ children }) => {
  const { language, setLanguage, t, ttsWarning, setTtsWarning } = useFinvora();

  const navItems = [
    { to: '/', label: t.navHome, icon: Home },
    { to: '/learn', label: t.navLearn, icon: BookOpen },
    { to: '/money', label: t.navMoney, icon: Wallet },
    { to: '/scam-rescue', label: t.navScam, icon: ShieldAlert },
    { to: '/help', label: t.navHelp, icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0F172A] flex flex-col">
      {/* Top Header + Persistent Multilingual Switcher */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b-2 border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 whitespace-nowrap"
          >
            <div className="w-10 h-10 rounded-xl bg-[#16A34A] flex items-center justify-center text-white font-extrabold text-xl shadow-[0_3px_0_0_#166534]">
              ₹
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#166534]">
              {t.appName}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#166534] font-bold text-sm hover:bg-[#DCFCE7] whitespace-nowrap shrink-0"
            >
              {t.actionProfile}
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-semibold text-sm hover:bg-[#F1F5F9] whitespace-nowrap shrink-0"
            >
              <LayoutDashboard className="w-4 h-4 text-[#166534]" />
              <span>{t.adminLink}</span>
            </Link>
          </div>
        </div>

        {/* Multilingual Selector Bar */}
        <div className="max-w-5xl mx-auto px-4 pb-2.5">
          <div
            className="flex items-center gap-2 overflow-x-auto no-scrollbar"
            role="group"
            aria-label="Language switcher"
          >
            {LANGUAGES.map((lang) => {
              const active = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-full text-sm font-bold transition-colors whitespace-nowrap shrink-0 border-2 ${
                    active
                      ? 'bg-[#166534] border-[#166534] text-white'
                      : 'bg-white border-[#CBD5E1] text-[#0F172A] hover:border-[#16A34A]'
                  }`}
                >
                  {lang.native}
                  {language === 'en' && lang.code !== 'en' && (
                    <span className={`ml-1.5 text-xs ${active ? 'text-[#DCFCE7]' : 'text-[#475569]'}`}>
                      {lang.english}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Missing Voice Warning Banner */}
      {ttsWarning && (
        <div className="max-w-5xl mx-auto w-full px-4 pt-3 sm:px-6 lg:px-8">
          <div
            role="alert"
            className="rounded-2xl bg-[#FEFCE8] border-2 border-[#D97706] p-4 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-[#D97706] shrink-0" />
              <p className="text-base font-bold text-[#0F172A]">{ttsWarning}</p>
            </div>
            <button
              type="button"
              onClick={() => setTtsWarning('')}
              aria-label="Close voice notice"
              className="w-10 h-10 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-5 pb-28 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Global Voice Microphone Assistant available on every page */}
      <VoiceAssistantDrawer />

      {/* Bottom Navigation Bar (5 tabs) */}
      <nav
        aria-label="Primary navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-[#CBD5E1] shadow-[0_-4px_12px_rgba(15,23,42,0.08)]"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center min-h-[68px] py-2 px-1 transition-colors border-t-4 ${
                    isActive
                      ? 'border-[#166534] bg-[#ECFDF5] text-[#166534] font-extrabold'
                      : 'border-transparent text-[#334155] hover:bg-[#F8FAFC] font-semibold'
                  }`
                }
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-[12px] sm:text-[13px] leading-tight text-center whitespace-nowrap truncate max-w-full">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
