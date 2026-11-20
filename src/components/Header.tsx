import { useState } from 'react';
import { HEADER_AVATAR_URL, LOCATIONS, MEDIZAP_LOGO_URL } from '../data/medizapData';
import type { PageRoute } from '../types/medizap';
import { ResilientImage } from './ResilientImage';

interface HeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  globalSearch: string;
  onGlobalSearchChange: (value: string) => void;
  onGlobalSearchSubmit: () => void;
  onOpenAiAssistant: (initialQuery?: string) => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
  userName: string;
  isSignedIn: boolean;
  onSignOut: () => void;
  upcomingCount: number;
  isSupabaseConnected?: boolean;
}

export function Header({
  currentPage,
  onNavigate,
  selectedLocation,
  onSelectLocation,
  globalSearch,
  onGlobalSearchChange,
  onGlobalSearchSubmit,
  onOpenAiAssistant,
  onOpenAuthModal,
  userName,
  isSignedIn,
  onSignOut,
  upcomingCount,
  isSupabaseConnected = false,
}: HeaderProps) {
  const [locationOpen, setLocationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageRoute; label: string; special?: boolean }[] = [
    { id: 'home', label: 'Home' },
    { id: 'find-doctors', label: 'Find Doctors' },
    { id: 'hospitals', label: 'Hospitals' },
    { id: 'my-appointments', label: 'My Appointments' },
    { id: 'neumorphic-showcase', label: '✨ Soft UI System', special: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(28,28,28,0.04)]">
      <div className="h-[70px] w-full px-margin md:px-margin-lg flex items-center justify-between gap-space-md">
        {/* Brand */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-space-sm flex-shrink-0 text-left cursor-pointer"
        >
          <ResilientImage
            src={MEDIZAP_LOGO_URL}
            alt="Healthcare Logo"
            className="h-8 w-8 rounded-lg object-contain"
            fallbackIcon="local_hospital"
            fallbackLabel="HC"
          />
          <div className="flex flex-col">
            <span className="text-[18px] leading-none tracking-tight font-bold text-on-surface whitespace-nowrap">
              Healthcare
            </span>
            <span className="text-[11px] leading-none mt-1 text-on-surface-variant hidden sm:inline-block whitespace-nowrap">
              Healthcare, made simple.
            </span>
          </div>
        </button>

        {/* Database Status Indicator */}
        <div
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-surface-container-low border border-outline-variant/30 select-none"
          title={
            isSupabaseConnected
              ? 'Supabase database is connected & live sync is active'
              : 'Running in Local Mode. Add Supabase credentials in .env to connect.'
          }
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isSupabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="text-on-surface-variant">
            {isSupabaseConnected ? 'Supabase Connected' : 'Local Mode'}
          </span>
        </div>

        {/* Center Location + Search + AI Search */}
        <div className="hidden xl:flex items-center gap-space-sm flex-1 max-w-2xl mx-space-md">
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                setLocationOpen((prev) => !prev);
                setProfileOpen(false);
              }}
              className="flex items-center gap-space-xs px-3 py-2 bg-surface-container-low hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
              <span className="text-[13px] max-w-[140px] truncate">{selectedLocation}</span>
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>

            {locationOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/40 p-1.5 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-outline">
                  Select Service Region
                </div>
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      onSelectLocation(loc);
                      setLocationOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] flex items-center justify-between transition-colors ${
                      selectedLocation === loc
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <span>{loc}</span>
                    {selectedLocation === loc && (
                      <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onGlobalSearchSubmit();
            }}
            className="flex-1 flex items-center bg-surface-container-low rounded-lg px-3 py-1.5 focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary-container/25 transition-all"
          >
            <span className="material-symbols-outlined text-outline text-[20px] mr-2">search</span>
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => onGlobalSearchChange(e.target.value)}
              placeholder="Search doctors, hospitals, specialties..."
              className="w-full bg-transparent text-[13px] text-on-surface placeholder-outline focus:outline-none"
            />
            {globalSearch && (
              <button
                type="button"
                onClick={() => onGlobalSearchChange('')}
                className="text-outline hover:text-on-surface p-0.5"
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </form>

          <button
            type="button"
            onClick={() => onOpenAiAssistant(globalSearch.trim() || undefined)}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary-container/15 hover:bg-primary-container/25 text-primary rounded-lg transition-colors flex-shrink-0 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span className="text-[12px] font-semibold tracking-wide">AI Search ✨</span>
          </button>
        </div>

        {/* Right Nav + Auth/Profile */}
        <div className="flex items-center gap-space-md flex-shrink-0">
          <nav className="hidden lg:flex items-center gap-space-md">
            {navItems.map((item) => {
              const active = currentPage === item.id;
              if (item.special) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className="px-3.5 py-1.5 rounded-xl bg-[#E0E5EC] text-[#6C63FF] font-bold text-[13px] shadow-[3px_3px_6px_rgb(163,177,198,0.6),-3px_-3px_6px_rgba(255,255,255,0.7)] hover:shadow-[5px_5px_10px_rgb(163,177,198,0.7),-5px_-5px_10px_rgba(255,255,255,0.8)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[inset_2px_2px_4px_rgb(163,177,198,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.5)] transition-all cursor-pointer whitespace-nowrap"
                  >
                    {item.label}
                  </button>
                );
              }
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`text-[14px] whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'text-primary font-bold'
                      : 'text-on-surface-variant font-semibold hover:text-on-surface'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-space-sm relative">
            {!isSignedIn ? (
              <>
                <button
                  type="button"
                  onClick={() => onOpenAuthModal('login')}
                  className="hidden md:inline-flex text-[14px] font-semibold text-on-surface-variant hover:text-on-surface px-3 py-2 transition-colors whitespace-nowrap"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuthModal('signup')}
                  className="inline-flex items-center justify-center text-[14px] font-semibold bg-primary-container hover:bg-primary text-on-primary px-4 py-2 rounded-lg transition-all shadow-[0_1px_3px_0_rgba(28,28,28,0.04)] whitespace-nowrap"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('my-appointments')}
                  className="text-[13px] font-semibold text-on-surface-variant hover:text-primary px-2.5 py-1.5 rounded-lg bg-surface-container-low transition-colors whitespace-nowrap"
                >
                  {upcomingCount} Active Visits
                </button>
              </div>
            )}

            <button
              type="button"
              aria-label="User profile dropdown"
              onClick={() => {
                setProfileOpen((prev) => !prev);
                setLocationOpen(false);
              }}
              className="flex items-center p-0.5 rounded-full hover:ring-2 hover:ring-primary-container transition-all"
            >
              <ResilientImage
                src={HEADER_AVATAR_URL}
                alt={userName}
                className="w-8 h-8 rounded-full object-cover"
                fallbackLabel={userName}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-11 w-60 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 p-2 z-50">
                <div className="px-3 py-2 border-b border-surface-container mb-1">
                  <div className="text-[14px] font-bold text-on-surface truncate">{userName}</div>
                  <div className="text-[11px] text-on-surface-variant">Patient ID: #HC-88219</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('my-appointments');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
                  <span>My Appointments</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('find-doctors');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">person_search</span>
                  <span>Find Specialists</span>
                </button>
                {isSignedIn ? (
                  <button
                    type="button"
                    onClick={() => {
                      onSignOut();
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-error hover:bg-error-container/30 flex items-center gap-2 mt-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenAuthModal('login');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-primary font-semibold hover:bg-surface-container-low flex items-center gap-2 mt-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">login</span>
                    <span>Sign In to Portal</span>
                  </button>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container"
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-[20px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-t border-surface-container px-margin py-space-md flex flex-col gap-2 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-[14px] font-semibold ${
                currentPage === item.id
                  ? 'bg-primary-container/15 text-primary font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="flex items-center gap-2 pt-2 border-t border-surface-container">
            <button
              type="button"
              onClick={() => {
                onOpenAiAssistant();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 rounded-lg bg-primary-container/15 text-primary text-[13px] font-semibold flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>AI Search</span>
            </button>
            {!isSignedIn && (
              <button
                type="button"
                onClick={() => {
                  onOpenAuthModal('login');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-surface-container-low text-on-surface text-[13px] font-semibold"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
