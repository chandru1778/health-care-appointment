import { useMemo, useRef, useState } from 'react';
import {
  DOCTORS,
  FAQS,
  HERO_HEART_IMAGE_URL,
  HOSPITALS,
  SPECIALTIES,
} from '../data/medizapData';
import type { Doctor, Hospital, PageRoute } from '../types/medizap';
import { ResilientImage } from './ResilientImage';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
  onSearchDoctors: (query: string, hospitalId: string) => void;
  onSelectSpecialty: (specialtyName: string) => void;
  onOpenAiAssistant?: (initialQuery?: string) => void;
  onOpenBookingModal: (target: {
    name: string;
    subtitle: string;
    feeText: string;
    doctor?: Doctor;
    hospital?: Hospital;
  }) => void;
  onOpenDoctorProfile: (doctor: Doctor) => void;
  onOpenHospitalDetails: (hospital: Hospital) => void;
}

export function HomePage({
  onNavigate,
  onSearchDoctors,
  onSelectSpecialty,
  onOpenAiAssistant,
  onOpenBookingModal,
  onOpenDoctorProfile,
  onOpenHospitalDetails,
}: HomePageProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [heroQuery, setHeroQuery] = useState('');
  const [heroHospital, setHeroHospital] = useState('all');
  const [heroDate, setHeroDate] = useState('2026-11-19');

  // Home Top Doctors Filter state
  const [specialtyFilter, setSpecialtyFilter] = useState('All');
  const [hospitalFilter, setHospitalFilter] = useState('Any');
  const [experienceFilter, setExperienceFilter] = useState('5');
  const [feeFilter, setFeeFilter] = useState('100');
  const [sortBy, setSortBy] = useState('rating');

  // FAQ state
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const filteredTopDoctors = useMemo(() => {
    let list = [...DOCTORS];
    if (specialtyFilter !== 'All') {
      list = list.filter((d) => d.specialty === specialtyFilter);
    }
    if (hospitalFilter !== 'Any') {
      list = list.filter((d) =>
        d.hospitalName.toLowerCase().includes(hospitalFilter.toLowerCase())
      );
    }
    list = list.filter((d) => d.experienceYears >= Number(experienceFilter));
    list = list.filter((d) => d.fee <= Number(feeFilter));

    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'earliest') {
      list.sort((a, b) => (a.availableToday === b.availableToday ? 0 : a.availableToday ? -1 : 1));
    } else if (sortBy === 'experience') {
      list.sort((a, b) => b.experienceYears - a.experienceYears);
    } else if (sortBy === 'fee') {
      list.sort((a, b) => a.fee - b.fee);
    }

    return list.slice(0, 6);
  }, [specialtyFilter, hospitalFilter, experienceFilter, feeFilter, sortBy]);

  const scrollCarousel = (dir: number) => {
    carouselRef.current?.scrollBy({ left: dir * 240, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-primary-fixed/20 via-surface to-background px-margin md:px-margin-lg pt-space-lg pb-space-xl">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-80 h-80 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center relative z-10">
          {/* Left Column: Copy & Interactive Search Panel */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest shadow-sm w-fit">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-ping" />
              <span className="text-[12px] font-semibold text-tertiary">
                Verified Clinical Network
              </span>
              <span className="text-outline-variant">•</span>
              <span className="text-[11px] font-medium text-on-surface-variant">
                Over 1,400+ Active Doctors
              </span>
            </div>

            <div className="flex flex-col gap-space-xs">
              <h1 className="text-[30px] md:text-[38px] leading-[38px] md:leading-[48px] tracking-[-0.02em] text-on-surface font-bold">
                Your Health, <span className="text-primary">Our Priority.</span>
              </h1>
              <p className="text-[16px] leading-[24px] text-on-surface-variant max-w-xl">
                Find trusted doctors, explore hospitals and book your appointments effortlessly with
                instantaneous triage.
              </p>
            </div>

            {/* Smart Multi-Field Search Hub */}
            <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-md flex flex-col gap-space-sm mt-space-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-on-surface-variant flex items-center gap-1 font-semibold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      stethoscope
                    </span>
                    Specialty or Doctor
                  </label>
                  <div className="relative flex items-center bg-surface-container-low rounded-lg px-3 py-2.5 focus-within:bg-surface-container-lowest focus-within:shadow-sm transition-all">
                    <input
                      type="text"
                      value={heroQuery}
                      onChange={(e) => setHeroQuery(e.target.value)}
                      placeholder="e.g. Cardiologist, Dr. Arjun"
                      className="w-full bg-transparent text-[13px] text-on-surface placeholder:text-outline focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-on-surface-variant flex items-center gap-1 font-semibold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      local_hospital
                    </span>
                    Hospital Facility
                  </label>
                  <div className="relative flex items-center bg-surface-container-low rounded-lg px-3 py-2.5">
                    <select
                      value={heroHospital}
                      onChange={(e) => setHeroHospital(e.target.value)}
                      className="w-full bg-transparent text-[13px] text-on-surface appearance-none focus:outline-none cursor-pointer pr-5"
                    >
                      <option value="all">All Accredited Centers</option>
                      <option value="apollo">Apollo Care Hospital (2.4 km)</option>
                      <option value="city">City Health Multispeciality (3.8 km)</option>
                      <option value="greenlife">GreenLife Medical Center (4.1 km)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 text-[18px] text-outline pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-on-surface-variant flex items-center gap-1 font-semibold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">
                      calendar_today
                    </span>
                    Consultation Date
                  </label>
                  <div className="relative flex items-center bg-surface-container-low rounded-lg px-3 py-2.5">
                    <input
                      type="date"
                      value={heroDate}
                      onChange={(e) => setHeroDate(e.target.value)}
                      className="w-full bg-transparent text-[13px] text-on-surface focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSearchDoctors(heroQuery, heroHospital)}
                className="w-full mt-1 py-3 px-space-md bg-primary-container hover:bg-primary text-on-primary rounded-lg text-[14px] font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">search_check</span>
                <span>Find Available Slots</span>
              </button>
            </div>

            {/* AI Assistant Prompt Banner */}
            <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onOpenAiAssistant?.()}
                  className="flex items-center gap-2 text-left hover:opacity-90 cursor-pointer"
                >
                  <span className="w-7 h-7 rounded-full bg-primary-container/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  </span>
                  <span className="text-[14px] font-bold text-on-surface hover:text-primary transition-colors">
                    Not sure where to start? Ask AI Assistant ✨
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAiAssistant?.()}
                  className="text-[11px] text-primary font-semibold hidden sm:inline-block hover:underline cursor-pointer"
                >
                  Instant natural language dispatch
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { emoji: '🫀', label: 'I need a cardiologist tomorrow morning', q: 'Cardiology' },
                  { emoji: '🧴', label: 'Find a dermatologist near my location', q: 'Dermatology' },
                  { emoji: '🩺', label: 'Book a general physician this weekend', q: 'General Physician' },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => setHeroQuery(chip.q)}
                    className="px-3 py-1.5 rounded-full bg-surface-container-lowest hover:bg-primary-fixed/30 text-on-surface-variant hover:text-primary text-[13px] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{chip.emoji}</span> {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Visual Hero Persona & Clinical Float Tags */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-xl bg-surface-container">
              <ResilientImage
                src={HERO_HEART_IMAGE_URL}
                alt="3D Anatomical Human Heart Medical Technology"
                className="w-full h-full object-cover object-top"
                fallbackIcon="cardiology"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-background/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-surface-container-lowest">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-fixed text-[20px]">
                    verified
                  </span>
                  <p className="text-[18px] font-bold leading-tight">Board Certified Network</p>
                </div>
                <p className="text-[11px] text-surface-variant opacity-90 mt-0.5">
                  Average wait time reduced to under 12 minutes
                </p>
              </div>
            </div>

            <div className="hidden sm:flex absolute -top-4 -left-4 bg-surface-container-lowest/95 backdrop-blur-md p-3 rounded-xl shadow-lg items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-tertiary-container/20 text-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">timer</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  Fast-Track Slots
                </span>
                <span className="text-[14px] font-bold text-on-surface">Immediate Care</span>
              </div>
            </div>

            <div className="hidden sm:flex absolute -bottom-6 -right-4 bg-surface-container-lowest/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed/50 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">shield_with_heart</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-on-surface">100% HIPAA Safe</span>
                <span className="text-[11px] text-on-surface-variant">Encrypted records access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEDICAL SPECIALTY CAROUSEL SECTION */}
      <section className="w-full bg-surface-container-lowest py-space-xl px-margin md:px-margin-lg shadow-[0_1px_4px_rgba(28,28,28,0.03)]">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-primary uppercase tracking-wider font-bold">
                Comprehensive Care
              </span>
              <h2 className="text-[22px] text-on-surface font-bold">Explore Specialties</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCarousel(-1)}
                aria-label="Previous specialties"
                className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel(1)}
                aria-label="Next specialties"
                className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-space-md overflow-x-auto pb-4 pt-2 scroll-smooth select-none no-scrollbar"
          >
            {SPECIALTIES.map((spec) => (
              <button
                key={spec.id}
                type="button"
                onClick={() => onSelectSpecialty(spec.name)}
                className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer w-28"
              >
                <div
                  className={`w-20 h-20 rounded-full ${spec.bgClass} flex items-center justify-center text-3xl shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all`}
                >
                  {spec.emoji}
                </div>
                <span className="text-[14px] font-semibold text-on-surface group-hover:text-primary transition-colors text-center">
                  {spec.label}
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  {spec.doctorCount} Doctors
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED HOSPITALS SECTION */}
      <section className="w-full py-space-xl px-margin md:px-margin-lg bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm">
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-secondary uppercase tracking-wider font-bold">
                Institutional Partners
              </span>
              <h2 className="text-[30px] text-on-surface font-bold">Explore Top Hospitals</h2>
              <p className="text-[14px] text-on-surface-variant">
                Discover trusted healthcare facilities around you with instant booking integration.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('hospitals')}
              className="text-[14px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all 48 facilities</span>
              <span className="material-symbols-outlined text-[18px]">east</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {HOSPITALS.map((hospital) => (
              <div
                key={hospital.id}
                className="bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
              >
                <div className="relative w-full aspect-[4/3] bg-surface-container overflow-hidden">
                  <ResilientImage
                    src={hospital.image}
                    alt={hospital.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    fallbackIcon="local_hospital"
                  />
                  <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-tertiary text-[16px]">
                      stars
                    </span>
                    <span className="text-[12px] text-on-surface font-bold">{hospital.rating}</span>
                    <span className="text-[11px] text-on-surface-variant">
                      ({hospital.reviewsCount}+ reviews)
                    </span>
                  </div>
                  <div
                    className={`absolute top-3 right-3 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 ${
                      hospital.badgeVariant === 'tertiary'
                        ? 'bg-tertiary-container/90 text-on-tertiary'
                        : 'bg-primary-container/90 text-on-primary'
                    }`}
                  >
                    {hospital.badgeVariant === 'tertiary' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest animate-pulse" />
                    )}
                    {hospital.badgeText}
                  </div>
                </div>

                <div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
                  <div className="flex flex-col gap-2">
                    <div>
                      <h3 className="text-[18px] text-on-surface font-bold">{hospital.name}</h3>
                      <div className="flex items-center gap-1 text-on-surface-variant text-[13px] mt-0.5">
                        <span className="material-symbols-outlined text-primary text-[16px]">
                          location_on
                        </span>
                        <span>
                          {hospital.area} • {hospital.distanceKm} km away
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {hospital.departments.slice(0, 2).map((dept) => (
                        <span
                          key={dept}
                          className="px-2 py-0.5 rounded-md bg-secondary-fixed/30 text-secondary text-[11px] font-semibold"
                        >
                          {dept}
                        </span>
                      ))}
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[11px] font-semibold">
                        +{hospital.extraDepartmentsCount} More
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[13px] pt-2 bg-surface-container-low px-3 py-2 rounded-lg">
                      <span className="text-on-surface-variant">Available Staff:</span>
                      <span className="font-semibold text-on-surface">
                        {hospital.doctorsOnDuty} Doctors On Duty
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => onOpenHospitalDetails(hospital)}
                      className="flex-1 py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-[14px] font-semibold transition-colors text-center cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenBookingModal({
                          name: hospital.name,
                          subtitle: 'Hospital Care Facility',
                          feeText: '$0 Dispatch',
                          hospital,
                        })
                      }
                      className="flex-1 py-2 px-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-[14px] font-semibold transition-colors text-center shadow-sm cursor-pointer"
                    >
                      Book Slot
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP DOCTORS SECTION WITH FILTER BAR */}
      <section className="w-full py-space-xl px-margin md:px-margin-lg bg-surface-container-low">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] text-primary uppercase tracking-wider font-bold">
              Verified Practitioners
            </span>
            <h2 className="text-[30px] text-on-surface font-bold">Meet Our Top Doctors</h2>
            <p className="text-[14px] text-on-surface-variant">
              Book direct in-person or video consultations with distinguished clinical leaders.
            </p>
          </div>

          {/* Horizontal Multi-Criteria Filter Bar */}
          <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-wrap items-center justify-between gap-space-sm">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative">
                <select
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  className="bg-surface-container-low px-3 py-2 pr-7 rounded-lg text-[13px] text-on-surface appearance-none focus:outline-none cursor-pointer"
                >
                  <option value="All">Specialty: All</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-2.5 text-[16px] text-outline pointer-events-none">
                  expand_more
                </span>
              </div>

              <div className="relative">
                <select
                  value={hospitalFilter}
                  onChange={(e) => setHospitalFilter(e.target.value)}
                  className="bg-surface-container-low px-3 py-2 pr-7 rounded-lg text-[13px] text-on-surface appearance-none focus:outline-none cursor-pointer"
                >
                  <option value="Any">Hospital: Any</option>
                  <option value="Apollo Care">Apollo Care</option>
                  <option value="City Health">City Health</option>
                  <option value="GreenLife">GreenLife</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-2.5 text-[16px] text-outline pointer-events-none">
                  expand_more
                </span>
              </div>

              <div className="relative">
                <select
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  className="bg-surface-container-low px-3 py-2 pr-7 rounded-lg text-[13px] text-on-surface appearance-none focus:outline-none cursor-pointer"
                >
                  <option value="5">Experience: 5+ yrs</option>
                  <option value="10">10+ yrs</option>
                  <option value="15">15+ yrs</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-2.5 text-[16px] text-outline pointer-events-none">
                  expand_more
                </span>
              </div>

              <div className="relative">
                <select
                  value={feeFilter}
                  onChange={(e) => setFeeFilter(e.target.value)}
                  className="bg-surface-container-low px-3 py-2 pr-7 rounded-lg text-[13px] text-on-surface appearance-none focus:outline-none cursor-pointer"
                >
                  <option value="100">Fee: Under $100</option>
                  <option value="75">Under $75</option>
                  <option value="60">Under $60</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-2.5 text-[16px] text-outline pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-on-surface-variant">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-surface-container-low px-3 py-1.5 pr-7 rounded-lg text-[13px] font-semibold text-on-surface appearance-none focus:outline-none cursor-pointer"
                >
                  <option value="rating">Highest Rating (4.8+)</option>
                  <option value="earliest">Earliest Available</option>
                  <option value="experience">Most Experienced</option>
                  <option value="fee">Lowest Fee</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-2 text-[16px] text-outline pointer-events-none">
                  sort
                </span>
              </div>
            </div>
          </div>

          {filteredTopDoctors.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-[36px] text-outline">search_off</span>
              <p className="text-[15px] font-semibold text-on-surface">
                No doctors match those exact criteria.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSpecialtyFilter('All');
                  setHospitalFilter('Any');
                  setExperienceFilter('5');
                  setFeeFilter('100');
                }}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary text-[13px] font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {filteredTopDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-sm group"
                >
                  <div className="flex flex-col gap-space-sm">
                    <div className="flex items-start justify-between gap-space-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-container flex-shrink-0">
                          <ResilientImage
                            src={doc.image}
                            alt={doc.imageAlt}
                            className="w-full h-full object-cover"
                            fallbackLabel={doc.name}
                          />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-[18px] font-bold text-on-surface">{doc.name}</h3>
                          <span className="text-[13px] text-secondary font-semibold">
                            {doc.specialty}
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            {doc.experienceYears} yrs practical experience
                          </span>
                        </div>
                      </div>
                      <div className="bg-tertiary-container/20 text-tertiary px-2 py-1 rounded-md flex items-center gap-1 flex-shrink-0">
                        <span className="material-symbols-outlined text-[14px]">star</span>
                        <span className="text-[12px] font-bold">{doc.rating}</span>
                      </div>
                    </div>

                    <div className="bg-surface-container-low p-3 rounded-lg flex items-center justify-between text-[13px]">
                      <div className="flex items-center gap-1.5 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px] text-primary">
                          apartment
                        </span>
                        <span className="truncate max-w-[165px]">{doc.hospitalName}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[14px] font-bold text-on-surface tabular-nums">
                          ${doc.fee}
                        </span>
                        <span className="text-[11px] text-on-surface-variant">
                          Consultation Fee
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] px-1">
                      <span className="text-on-surface-variant">Next Slot:</span>
                      <span
                        className={`font-semibold flex items-center gap-1 ${
                          doc.nextSlotUrgency === 'today' ? 'text-tertiary' : 'text-secondary'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            doc.nextSlotUrgency === 'today' ? 'bg-tertiary' : 'bg-secondary'
                          }`}
                        />
                        {doc.nextSlot}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => onOpenDoctorProfile(doc)}
                      className="flex-1 py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-[14px] font-semibold transition-colors text-center cursor-pointer"
                    >
                      View Profile
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenBookingModal({
                          name: doc.name,
                          subtitle: `${doc.specialty} (${doc.hospitalName})`,
                          feeText: `$${doc.fee}`,
                          doctor: doc,
                        })
                      }
                      className="flex-1 py-2 px-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-[14px] font-semibold transition-colors text-center shadow-sm cursor-pointer"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="w-full py-space-xl px-margin md:px-margin-lg bg-surface">
        <div className="max-w-4xl mx-auto flex flex-col gap-space-lg">
          <div className="text-center flex flex-col items-center gap-2">
            <span className="text-[12px] text-primary uppercase tracking-wider font-bold">
              Clear Guidance
            </span>
            <h2 className="text-[30px] text-on-surface font-bold">Frequently Asked Questions</h2>
            <p className="text-[14px] text-on-surface-variant max-w-xl">
              Everything you need to know about navigating appointments, insurance policies, and
              virtual triage.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <button
                  key={faq.id}
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className={`w-full text-left rounded-xl p-space-md shadow-sm transition-all cursor-pointer ${
                    isOpen ? 'bg-surface-container-low' : 'bg-surface-container-lowest'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-[15px] md:text-[18px] font-bold text-on-surface">
                      {faq.question}
                    </h3>
                    <span
                      className={`material-symbols-outlined text-outline transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </div>
                  {isOpen && (
                    <div className="pt-3 text-[13px] text-on-surface-variant leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
