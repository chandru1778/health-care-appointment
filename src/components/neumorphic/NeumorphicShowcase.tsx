import React, { useState } from 'react';
import {
  NeumorphicBadge,
  NeumorphicButton,
  NeumorphicCard,
  NeumorphicIconWell,
  NeumorphicInput,
  NeumorphicNestedDepth,
  NeumorphicSwitch,
  NeumorphicTabs,
  NeumorphicTextarea,
} from './index';

interface NeumorphicShowcaseProps {
  onBackToApp?: () => void;
}

export const NeumorphicShowcase: React.FC<NeumorphicShowcaseProps> = ({ onBackToApp }) => {
  // Interactive state
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'healthcare' | 'tokens'>('overview');
  const [switch1, setSwitch1] = useState(true);
  const [switch2, setSwitch2] = useState(false);
  const [searchVal, setSearchVal] = useState('Dr. Sarah Jenkins');
  const [notesVal, setNotesVal] = useState('Patient reported mild chest tightness during morning walk.');
  const [selectedSpecialty, setSelectedSpecialty] = useState('cardio');
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoActive, setVideoActive] = useState(true);
  const [heartRate, setHeartRate] = useState(72);
  const [appointmentBooked, setAppointmentBooked] = useState(false);

  return (
    <div className="min-h-screen bg-[#E0E5EC] text-[#3D4852] font-body selection:bg-[#6C63FF]/20 selection:text-[#3D4852] pb-24">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#E0E5EC]/90 backdrop-blur-md px-6 md:px-12 py-4 shadow-[0_4px_12px_rgb(163,177,198,0.35)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <NeumorphicIconWell depth="inset" size="sm" shape="circle" className="text-[#6C63FF]">
              <span className="material-symbols-outlined text-lg">water_drop</span>
            </NeumorphicIconWell>
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-[#3D4852]">
                Neumorphism
              </span>
              <span className="text-xs text-[#6B7280] ml-2 font-medium hidden sm:inline-block">
                Soft UI Design System
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <NeumorphicTabs
            tabs={[
              { id: 'overview', label: 'Philosophy' },
              { id: 'components', label: 'Component Lab' },
              { id: 'healthcare', label: 'Healthcare Demo' },
              { id: 'tokens', label: 'Tokens & DNA' },
            ]}
            activeId={activeTab}
            onChange={(id) => setActiveTab(id as any)}
            className="hidden md:flex"
          />

          {/* Right Action */}
          <div className="flex items-center gap-3">
            {onBackToApp && (
              <NeumorphicButton
                variant="secondary"
                size="sm"
                onClick={onBackToApp}
                className="flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span>Return to MediZap</span>
              </NeumorphicButton>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-3 flex justify-center">
          <NeumorphicTabs
            tabs={[
              { id: 'overview', label: 'Overview' },
              { id: 'components', label: 'Lab' },
              { id: 'healthcare', label: 'App' },
              { id: 'tokens', label: 'Tokens' },
            ]}
            activeId={activeTab}
            onChange={(id) => setActiveTab(id as any)}
            className="w-full justify-between"
          />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 mt-8 md:mt-12 space-y-16">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & PHILOSOPHY */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-16 animate-in fade-in duration-300">
            {/* Hero Section */}
            <section className="relative py-12 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-2xl space-y-6">
                <div className="inline-flex items-center gap-2">
                  <NeumorphicBadge variant="inset" tone="accent" size="md">
                    <span className="w-2 h-2 rounded-full bg-[#6C63FF] animate-pulse"></span>
                    Molded Tactile Surface
                  </NeumorphicBadge>
                  <NeumorphicBadge variant="inset" tone="teal" size="md">
                    WCAG AAA & AA Compliant
                  </NeumorphicBadge>
                </div>

                <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#3D4852] leading-[1.15]">
                  Molded from the same surface. Never flat.
                </h1>

                <p className="text-lg md:text-xl text-[#6B7280] leading-relaxed font-normal">
                  Neumorphism creates physical depth through dual opposing RGB shadows—light source
                  from top-left, cool dark shadow at bottom-right—on monochromatic cool clay{' '}
                  <code className="text-[#3D4852] font-semibold bg-[#E0E5EC] px-2 py-0.5 rounded-lg shadow-[inset_2px_2px_4px_rgb(163,177,198,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]">
                    #E0E5EC
                  </code>
                  .
                </p>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <NeumorphicButton
                    variant="primary"
                    size="lg"
                    onClick={() => setActiveTab('components')}
                  >
                    <span className="material-symbols-outlined text-xl">widgets</span>
                    <span>Explore Component Lab</span>
                  </NeumorphicButton>

                  <NeumorphicButton
                    variant="secondary"
                    size="lg"
                    onClick={() => setActiveTab('healthcare')}
                  >
                    <span className="material-symbols-outlined text-xl">medical_services</span>
                    <span>Live Healthcare UI</span>
                  </NeumorphicButton>
                </div>
              </div>

              {/* Ambient Floating 3D Nested Element */}
              <div className="relative flex items-center justify-center p-8">
                <div className="animate-neu-float">
                  <NeumorphicNestedDepth
                    size="lg"
                    centerContent={
                      <div className="flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-[#6C63FF]">
                          fingerprint
                        </span>
                        <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mt-1">
                          Tactile
                        </span>
                      </div>
                    }
                  />
                </div>
              </div>
            </section>

            {/* Core Signatures Grid */}
            <section className="space-y-8">
              <div>
                <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-[#3D4852]">
                  Unique Visual Signatures
                </h2>
                <p className="text-[#6B7280] mt-1">
                  Engineered with strict mathematical physics and soft ceramic aesthetics.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Signature 1 */}
                <NeumorphicCard variant="extruded" hoverable padding="lg" className="space-y-4">
                  <NeumorphicIconWell depth="inset-deep" size="lg" shape="rounded" className="text-[#6C63FF]">
                    <span className="material-symbols-outlined text-3xl">wb_sunny</span>
                  </NeumorphicIconWell>
                  <h3 className="font-display font-bold text-xl text-[#3D4852]">Dual Opposing Shadows</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    Light casts pure white at -9px / -9px while cool blue-grey falls at +9px / +9px.
                    Alpha transparency creates seamless atmospheric blending.
                  </p>
                </NeumorphicCard>

                {/* Signature 2 */}
                <NeumorphicCard variant="extruded" hoverable padding="lg" className="space-y-4">
                  <NeumorphicIconWell depth="inset-deep" size="lg" shape="rounded" className="text-[#38B2AC]">
                    <span className="material-symbols-outlined text-3xl">layers</span>
                  </NeumorphicIconWell>
                  <h3 className="font-display font-bold text-xl text-[#3D4852]">Complex Nested Depth</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    Containers extrude outward, inner wells stamp deep into the surface, and focal
                    elements rise back up to convey tangible multi-layer physics.
                  </p>
                </NeumorphicCard>

                {/* Signature 3 */}
                <NeumorphicCard variant="extruded" hoverable padding="lg" className="space-y-4">
                  <NeumorphicIconWell depth="inset-deep" size="lg" shape="rounded" className="text-[#6C63FF]">
                    <span className="material-symbols-outlined text-3xl">accessibility_new</span>
                  </NeumorphicIconWell>
                  <h3 className="font-display font-bold text-xl text-[#3D4852]">Accessible Contrast</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    Primary typography delivers 7.5:1 contrast (WCAG AAA), while secondary text provides
                    4.6:1 (WCAG AA). Zero illegible low-contrast text.
                  </p>
                </NeumorphicCard>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: COMPONENT LAB */}
        {/* ========================================================================= */}
        {activeTab === 'components' && (
          <div className="space-y-16 animate-in fade-in duration-300">
            <div>
              <h2 className="font-display font-extrabold text-3xl tracking-tight text-[#3D4852]">
                Component Lab
              </h2>
              <p className="text-[#6B7280] mt-1">
                Interact with live buttons, inputs, icon wells, toggles, and nested depth controls.
              </p>
            </div>

            {/* Buttons Section */}
            <NeumorphicCard variant="extruded" padding="lg" className="space-y-8">
              <div className="flex items-center justify-between border-b border-transparent pb-2">
                <div>
                  <h3 className="font-display font-bold text-xl text-[#3D4852]">Interactive Buttons</h3>
                  <p className="text-sm text-[#6B7280]">
                    Extruded default, -1px lift on hover, physical press-down + inset shadow on active.
                  </p>
                </div>
                <NeumorphicBadge variant="inset" tone="accent" size="sm">
                  300ms Physics
                </NeumorphicBadge>
              </div>

              {/* Button Variants */}
              <div className="flex flex-wrap items-center gap-6">
                <NeumorphicButton variant="primary" size="md">
                  <span className="material-symbols-outlined text-lg">star</span>
                  <span>Primary Violet</span>
                </NeumorphicButton>

                <NeumorphicButton variant="secondary" size="md">
                  <span className="material-symbols-outlined text-lg">touch_app</span>
                  <span>Molded Clay</span>
                </NeumorphicButton>

                <NeumorphicButton variant="teal" size="md">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  <span>Teal Action</span>
                </NeumorphicButton>

                <NeumorphicButton variant="danger" size="md">
                  <span className="material-symbols-outlined text-lg">delete</span>
                  <span>Danger State</span>
                </NeumorphicButton>

                <NeumorphicButton variant="secondary" size="md" disabled>
                  <span>Disabled State</span>
                </NeumorphicButton>
              </div>

              {/* Button Sizes & Icon Buttons */}
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#A3B1C6]/30">
                <NeumorphicButton variant="secondary" size="sm">
                  Small (38px)
                </NeumorphicButton>
                <NeumorphicButton variant="secondary" size="md">
                  Medium (48px)
                </NeumorphicButton>
                <NeumorphicButton variant="secondary" size="lg">
                  Large (56px)
                </NeumorphicButton>

                <NeumorphicButton variant="secondary" size="icon" aria-label="Favorite">
                  <span className="material-symbols-outlined text-xl text-[#6C63FF]">favorite</span>
                </NeumorphicButton>

                <NeumorphicButton variant="secondary" size="icon" aria-label="Notifications">
                  <span className="material-symbols-outlined text-xl text-[#38B2AC]">notifications</span>
                </NeumorphicButton>

                <NeumorphicButton variant="primary" size="icon" aria-label="Add New">
                  <span className="material-symbols-outlined text-xl">add</span>
                </NeumorphicButton>
              </div>
            </NeumorphicCard>

            {/* Inputs & Form Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <NeumorphicCard variant="extruded" padding="lg" className="space-y-6">
                <h3 className="font-display font-bold text-xl text-[#3D4852]">Form Inputs</h3>
                <p className="text-sm text-[#6B7280]">
                  Deep inset well with focus transition to <code>insetDeep</code> and 2px violet ring offset.
                </p>

                <NeumorphicInput
                  label="Search Doctor or Specialty"
                  placeholder="e.g. Cardiologist, Neurologist..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  leftIcon={<span className="material-symbols-outlined text-xl">search</span>}
                  rightIcon={
                    searchVal ? (
                      <button
                        type="button"
                        onClick={() => setSearchVal('')}
                        className="cursor-pointer hover:text-[#3D4852]"
                      >
                        <span className="material-symbols-outlined text-lg">close</span>
                      </button>
                    ) : undefined
                  }
                  helperText="Press Enter or search to filter clinical registry"
                />

                <NeumorphicInput
                  label="Email Address"
                  placeholder="alex.morgan@healthmail.com"
                  defaultValue="alex.morgan@healthmail.com"
                  leftIcon={<span className="material-symbols-outlined text-xl">mail</span>}
                />

                <NeumorphicTextarea
                  label="Clinical Symptoms & Notes"
                  placeholder="Describe your health concern..."
                  value={notesVal}
                  onChange={(e) => setNotesVal(e.target.value)}
                  helperText="Confidential medical context encrypted under HIPAA compliance"
                />
              </NeumorphicCard>

              {/* Switches, Toggles & Icon Wells */}
              <NeumorphicCard variant="extruded" padding="lg" className="space-y-8 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-xl text-[#3D4852]">Tactile Toggles & Wells</h3>
                  <p className="text-sm text-[#6B7280] mt-1">
                    Molded inset track with extruded sliding knob and drilled icon wells.
                  </p>
                </div>

                {/* Switches */}
                <div className="space-y-4">
                  <NeumorphicSwitch
                    checked={switch1}
                    onChange={setSwitch1}
                    label="Instant AI Medical Triage"
                    description="Enable proactive diagnostic suggestions prior to consultation"
                  />

                  <NeumorphicSwitch
                    checked={switch2}
                    onChange={setSwitch2}
                    label="SMS Slot Reminders"
                    description="Receive 2-hour alert notifications on mobile device"
                  />
                </div>

                {/* Drilled Wells Showcase */}
                <div className="space-y-3 pt-4 border-t border-[#A3B1C6]/30">
                  <span className="text-sm font-semibold text-[#3D4852]">Drilled Icon Wells</span>
                  <div className="flex flex-wrap items-center gap-4">
                    <NeumorphicIconWell depth="inset-deep" shape="circle" size="md" className="text-[#6C63FF]">
                      <span className="material-symbols-outlined">ecg_heart</span>
                    </NeumorphicIconWell>

                    <NeumorphicIconWell depth="inset-deep" shape="circle" size="md" className="text-[#38B2AC]">
                      <span className="material-symbols-outlined">stethoscope</span>
                    </NeumorphicIconWell>

                    <NeumorphicIconWell depth="inset-deep" shape="square" size="md" className="text-[#3D4852]">
                      <span className="material-symbols-outlined">pill</span>
                    </NeumorphicIconWell>

                    <NeumorphicIconWell depth="inset" shape="square" size="md" className="text-[#6C63FF]">
                      <span className="material-symbols-outlined">clinical_notes</span>
                    </NeumorphicIconWell>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="space-y-3 pt-4 border-t border-[#A3B1C6]/30">
                  <span className="text-sm font-semibold text-[#3D4852]">Status & Pill Badges</span>
                  <div className="flex flex-wrap items-center gap-3">
                    <NeumorphicBadge variant="inset" tone="teal">
                      ● Active Confirmed
                    </NeumorphicBadge>
                    <NeumorphicBadge variant="inset" tone="accent">
                      Teleconsult Ready
                    </NeumorphicBadge>
                    <NeumorphicBadge variant="extruded" tone="danger">
                      ER Attention
                    </NeumorphicBadge>
                    <NeumorphicBadge variant="extruded" tone="default">
                      Follow-up Needed
                    </NeumorphicBadge>
                  </div>
                </div>
              </NeumorphicCard>
            </div>

            {/* Nested Depth Interactive Showcase */}
            <NeumorphicCard variant="extruded" padding="lg" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-xl text-[#3D4852]">
                    Complex Nested Depth (Extruded → Inset → Extruded)
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    Hover over the 3D model below to experience natural physical depth and micro-interaction deceleration.
                  </p>
                </div>
                <NeumorphicBadge variant="inset" tone="accent" size="sm">
                  Hover to rotate & scale
                </NeumorphicBadge>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-12 py-8">
                <NeumorphicNestedDepth
                  size="md"
                  centerContent={
                    <span className="material-symbols-outlined text-4xl text-[#6C63FF]">
                      health_and_safety
                    </span>
                  }
                />

                <div className="max-w-md space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-sm text-[#6C63FF] px-2 py-0.5 rounded-lg bg-[#E0E5EC] shadow-[inset_2px_2px_4px_rgb(163,177,198,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]">
                      L1
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#3D4852]">Extruded Base Ring</p>
                      <p className="text-xs text-[#6B7280]">9px dual opposing shadow casting from surface</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="font-bold text-sm text-[#38B2AC] px-2 py-0.5 rounded-lg bg-[#E0E5EC] shadow-[inset_2px_2px_4px_rgb(163,177,198,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]">
                      L2
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#3D4852]">Inset Deep Well</p>
                      <p className="text-xs text-[#6B7280]">10px deep concave shadow carved inward</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="font-bold text-sm text-[#3D4852] px-2 py-0.5 rounded-lg bg-[#E0E5EC] shadow-[inset_2px_2px_4px_rgb(163,177,198,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]">
                      L3
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#3D4852]">Extruded Core Pill</p>
                      <p className="text-xs text-[#6B7280]">Convex physical core rising with 180° rotation on hover</p>
                    </div>
                  </div>
                </div>
              </div>
            </NeumorphicCard>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: REAL-WORLD HEALTHCARE UI DEMO (MEDIZAP IN SOFT UI) */}
        {/* ========================================================================= */}
        {activeTab === 'healthcare' && (
          <div className="space-y-16 animate-in fade-in duration-300">
            <div>
              <h2 className="font-display font-extrabold text-3xl tracking-tight text-[#3D4852]">
                Healthcare Application UI
              </h2>
              <p className="text-[#6B7280] mt-1">
                How MediZap components look and feel when rendered in the Neumorphic Soft UI design system.
              </p>
            </div>

            {/* Doctor Card Demo */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Doctor Profile Card */}
              <NeumorphicCard variant="extruded" hoverable padding="lg" className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <NeumorphicIconWell depth="inset-deep" shape="circle" size="lg" className="text-[#6C63FF]">
                      <span className="material-symbols-outlined text-3xl">person</span>
                    </NeumorphicIconWell>
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#3D4852]">Dr. Sophia Patel</h3>
                      <p className="text-xs text-[#6B7280]">MD, FACC · Cardiology</p>
                      <p className="text-xs text-[#38B2AC] font-semibold mt-1">14 yrs clinical experience</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]">
                  <span className="text-[#6B7280]">Hospital:</span>
                  <span className="font-semibold text-[#3D4852]">Metro Health Center</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-amber-500 text-lg">star</span>
                    <span className="font-bold text-sm text-[#3D4852]">4.95</span>
                    <span className="text-xs text-[#6B7280]">(182 reviews)</span>
                  </div>
                  <NeumorphicBadge variant="inset" tone="teal">
                    Available Today
                  </NeumorphicBadge>
                </div>

                <div className="pt-2">
                  <NeumorphicButton
                    variant={appointmentBooked ? 'teal' : 'primary'}
                    size="md"
                    className="w-full"
                    onClick={() => setAppointmentBooked(!appointmentBooked)}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {appointmentBooked ? 'check' : 'calendar_month'}
                    </span>
                    <span>{appointmentBooked ? 'Slot Confirmed!' : 'Book Consultation'}</span>
                  </NeumorphicButton>
                </div>
              </NeumorphicCard>

              {/* Vitals & Health Biometrics Card */}
              <NeumorphicCard variant="extruded" padding="lg" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#3D4852]">Live Patient Vitals</h3>
                    <p className="text-xs text-[#6B7280]">Real-time telemetry stream</p>
                  </div>
                  <NeumorphicBadge variant="inset" tone="teal" size="sm">
                    ● Synced
                  </NeumorphicBadge>
                </div>

                {/* Heart Rate Metric */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280] flex items-center gap-2">
                      <span className="material-symbols-outlined text-rose-500 text-base">favorite</span>
                      Heart Rate
                    </span>
                    <span className="font-bold text-[#3D4852]">{heartRate} BPM</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-[#E0E5EC] shadow-[inset_2px_2px_4px_rgb(163,177,198,0.7),inset_-2px_-2px_4px_rgba(255,255,255,0.6)] p-0.5">
                    <div
                      className="h-full rounded-full bg-[#6C63FF] transition-all duration-500"
                      style={{ width: `${(heartRate / 120) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <NeumorphicButton
                      variant="secondary"
                      size="sm"
                      onClick={() => setHeartRate(Math.max(60, heartRate - 4))}
                    >
                      -
                    </NeumorphicButton>
                    <NeumorphicButton
                      variant="secondary"
                      size="sm"
                      onClick={() => setHeartRate(Math.min(115, heartRate + 4))}
                    >
                      +
                    </NeumorphicButton>
                  </div>
                </div>

                {/* Blood Pressure & Oxygen */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 rounded-2xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgb(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
                    <span className="text-xs text-[#6B7280]">Blood Pressure</span>
                    <p className="font-bold text-lg text-[#3D4852] mt-0.5">118 / 78</p>
                    <span className="text-[10px] text-[#38B2AC] font-semibold">Optimal</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgb(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
                    <span className="text-xs text-[#6B7280]">SpO2 Saturation</span>
                    <p className="font-bold text-lg text-[#3D4852] mt-0.5">99 %</p>
                    <span className="text-[10px] text-[#38B2AC] font-semibold">Normal</span>
                  </div>
                </div>
              </NeumorphicCard>

              {/* Telehealth Call Controller */}
              <NeumorphicCard variant="extruded" padding="lg" className="space-y-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-lg text-[#3D4852]">Teleconsultation</h3>
                    <NeumorphicBadge variant="inset" tone="accent" size="sm">
                      Room #849
                    </NeumorphicBadge>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-1">Encrypted WebRTC Audio & Video Session</p>
                </div>

                {/* Video Avatar Mock */}
                <div className="relative h-32 rounded-2xl bg-[#E0E5EC] flex items-center justify-center shadow-[inset_6px_6px_12px_rgb(163,177,198,0.7),inset_-6px_-6px_12px_rgba(255,255,255,0.6)]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-4xl text-[#6C63FF]">
                      videocam
                    </span>
                    <span className="text-xs font-semibold text-[#6B7280]">
                      {videoActive ? 'Camera Connected' : 'Camera Muted'}
                    </span>
                  </div>
                </div>

                {/* Tactile Call Controls */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <NeumorphicButton
                    variant="secondary"
                    size="icon"
                    onClick={() => setAudioMuted(!audioMuted)}
                    className={audioMuted ? 'text-[#E53E3E]' : 'text-[#3D4852]'}
                    aria-label="Mute Audio"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {audioMuted ? 'mic_off' : 'mic'}
                    </span>
                  </NeumorphicButton>

                  <NeumorphicButton
                    variant="secondary"
                    size="icon"
                    onClick={() => setVideoActive(!videoActive)}
                    className={!videoActive ? 'text-[#E53E3E]' : 'text-[#3D4852]'}
                    aria-label="Toggle Video"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {videoActive ? 'videocam' : 'videocam_off'}
                    </span>
                  </NeumorphicButton>

                  <NeumorphicButton
                    variant="danger"
                    size="icon"
                    aria-label="End Call"
                  >
                    <span className="material-symbols-outlined text-xl">call_end</span>
                  </NeumorphicButton>
                </div>
              </NeumorphicCard>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: DESIGN TOKENS & DNA */}
        {/* ========================================================================= */}
        {activeTab === 'tokens' && (
          <div className="space-y-16 animate-in fade-in duration-300">
            <div>
              <h2 className="font-display font-extrabold text-3xl tracking-tight text-[#3D4852]">
                Design Token System
              </h2>
              <p className="text-[#6B7280] mt-1">
                Monochromatic palette, strict WCAG compliance ratios, dual RGBA shadow definitions.
              </p>
            </div>

            {/* Color Palette Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Background */}
              <NeumorphicCard variant="extruded" padding="md" className="space-y-3">
                <div className="h-16 w-full rounded-2xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgb(163,177,198,0.7),inset_-4px_-4px_8px_rgba(255,255,255,0.6)] flex items-center justify-center">
                  <span className="text-xs font-mono font-bold text-[#3D4852]">#E0E5EC</span>
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-[#3D4852]">Base Clay Background</h4>
                  <p className="text-xs text-[#6B7280]">Universal surface. Everything is molded from this.</p>
                </div>
              </NeumorphicCard>

              {/* Primary Foreground */}
              <NeumorphicCard variant="extruded" padding="md" className="space-y-3">
                <div className="h-16 w-full rounded-2xl bg-[#3D4852] flex items-center justify-center text-white">
                  <span className="text-xs font-mono font-bold">#3D4852</span>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-base text-[#3D4852]">Primary Foreground</h4>
                    <NeumorphicBadge variant="inset" tone="teal" size="sm">
                      7.5:1 (AAA)
                    </NeumorphicBadge>
                  </div>
                  <p className="text-xs text-[#6B7280]">Dark blue-grey for optimal headline readability.</p>
                </div>
              </NeumorphicCard>

              {/* Muted Text */}
              <NeumorphicCard variant="extruded" padding="md" className="space-y-3">
                <div className="h-16 w-full rounded-2xl bg-[#6B7280] flex items-center justify-center text-white">
                  <span className="text-xs font-mono font-bold">#6B7280</span>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-base text-[#3D4852]">Muted Secondary</h4>
                    <NeumorphicBadge variant="inset" tone="teal" size="sm">
                      4.6:1 (AA)
                    </NeumorphicBadge>
                  </div>
                  <p className="text-xs text-[#6B7280]">Cool grey for captions and helper labels.</p>
                </div>
              </NeumorphicCard>

              {/* Accent Violet */}
              <NeumorphicCard variant="extruded" padding="md" className="space-y-3">
                <div className="h-16 w-full rounded-2xl bg-[#6C63FF] flex items-center justify-center text-white">
                  <span className="text-xs font-mono font-bold">#6C63FF</span>
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-[#3D4852]">Primary Accent (Violet)</h4>
                  <p className="text-xs text-[#6B7280]">Used sparingly for CTAs, active pills, and focus rings.</p>
                </div>
              </NeumorphicCard>

              {/* Secondary Accent Teal */}
              <NeumorphicCard variant="extruded" padding="md" className="space-y-3">
                <div className="h-16 w-full rounded-2xl bg-[#38B2AC] flex items-center justify-center text-white">
                  <span className="text-xs font-mono font-bold">#38B2AC</span>
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-[#3D4852]">Secondary Accent (Teal)</h4>
                  <p className="text-xs text-[#6B7280]">Positive clinical status, verified badges, active telemetry.</p>
                </div>
              </NeumorphicCard>

              {/* Light & Dark Shadows */}
              <NeumorphicCard variant="extruded" padding="md" className="space-y-3">
                <div className="h-16 w-full rounded-2xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgb(163,177,198,0.7),inset_-4px_-4px_8px_rgba(255,255,255,0.6)] flex items-center justify-center">
                  <span className="text-xs font-mono text-[#6B7280]">Dual RGBA Light/Dark</span>
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-[#3D4852]">Opposing Shadows</h4>
                  <p className="text-xs text-[#6B7280]">Light: rgba(255,255,255,0.5) / Dark: rgb(163,177,198,0.6)</p>
                </div>
              </NeumorphicCard>
            </div>

            {/* Shadow Physics Inspection Table */}
            <NeumorphicCard variant="extruded" padding="lg" className="space-y-6">
              <h3 className="font-display font-bold text-xl text-[#3D4852]">Shadow Formula Specifications</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#A3B1C6]/30 text-[#6B7280]">
                      <th className="pb-3 font-semibold">State</th>
                      <th className="pb-3 font-semibold">CSS box-shadow</th>
                      <th className="pb-3 font-semibold">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#A3B1C6]/20 font-mono text-xs text-[#3D4852]">
                    <tr>
                      <td className="py-3 font-bold text-[#6C63FF]">Extruded (Default)</td>
                      <td className="py-3">9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)</td>
                      <td className="py-3 font-sans text-[#6B7280]">Cards, primary containers, resting buttons</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-[#6C63FF]">Extruded Hover</td>
                      <td className="py-3">12px 12px 20px rgb(163,177,198,0.7), -12px -12px 20px rgba(255,255,255,0.6)</td>
                      <td className="py-3 font-sans text-[#6B7280]">Lifted state on hover (-2px translateY)</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-[#6C63FF]">Extruded Small</td>
                      <td className="py-3">5px 5px 10px rgb(163,177,198,0.6), -5px -5px 10px rgba(255,255,255,0.5)</td>
                      <td className="py-3 font-sans text-[#6B7280]">Inner core buttons, small tags, knobs</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-[#38B2AC]">Inset Standard</td>
                      <td className="py-3">inset 6px 6px 10px rgb(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5)</td>
                      <td className="py-3 font-sans text-[#6B7280]">Standard inputs, shallow wells, active tabs</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-[#38B2AC]">Inset Deep</td>
                      <td className="py-3">inset 10px 10px 20px rgb(163,177,198,0.7), inset -10px -10px 20px rgba(255,255,255,0.6)</td>
                      <td className="py-3 font-sans text-[#6B7280]">Drilled icon wells, focused inputs, deep wells</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-[#38B2AC]">Inset Small</td>
                      <td className="py-3">inset 3px 3px 6px rgb(163,177,198,0.6), inset -3px -3px 6px rgba(255,255,255,0.5)</td>
                      <td className="py-3 font-sans text-[#6B7280]">Pressed buttons, switch tracks, badge chips</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </NeumorphicCard>
          </div>
        )}
      </main>
    </div>
  );
};
