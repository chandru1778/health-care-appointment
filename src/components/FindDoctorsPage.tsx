import { useEffect, useMemo, useState } from 'react';
import {
  DAY_SHIFT_SLOTS,
  DOCTORS,
  SPECIALTIES,
  WEEK_DAYS,
  downloadCalendarInvite,
  downloadDocumentSlip,
} from '../data/medizapData';
import type { Appointment, Doctor, PageRoute } from '../types/medizap';
import { ResilientImage } from './ResilientImage';

function getSchedulerDays() {
  const days = [];
  const now = new Date();
  for (let i = 0; i < 5; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const day = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dateNum = String(d.getDate());
    const label = `${day}, ${d.toLocaleDateString('en-US', { month: 'short' })} ${dateNum}`;
    days.push({
      id: `day-${i}`,
      day,
      dateNum,
      label,
      statusColor: i === 1 ? 'bg-primary-fixed' : 'bg-outline-variant',
      monthYear: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    });
  }
  return days;
}

interface FindDoctorsPageProps {
  doctors?: Doctor[];
  initialQuery?: string;
  initialSpecialty?: string;
  initialHospitalId?: string;
  bookedSlots?: { doctorId: string; dateLabel: string; timeSlot: string }[];
  onBookAppointment: (payload: {
    doctor: Doctor;
    dateLabel: string;
    timeSlot: string;
    mode: 'In-Clinic Visit' | 'Telehealth Video';
    patientName: string;
    patientPhone: string;
    reason: string;
  }) => Appointment;
  onOpenDoctorProfile: (doctor: Doctor) => void;
  onNavigate: (page: PageRoute) => void;
  onShowToast: (msg: string) => void;
  defaultPatientName: string;
  defaultPatientPhone: string;
  defaultPatientEmail: string;
}

export function FindDoctorsPage({
  doctors,
  initialQuery = '',
  initialSpecialty = 'All',
  initialHospitalId = 'all',
  bookedSlots = [],
  onBookAppointment,
  onOpenDoctorProfile,
  onNavigate,
  onShowToast,
  defaultPatientName,
  defaultPatientPhone,
  defaultPatientEmail,
}: FindDoctorsPageProps) {
  const activeDoctorsCatalog = doctors && doctors.length > 0 ? doctors : DOCTORS;
  const schedulerDays = useMemo(() => getSchedulerDays(), []);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);
  const [selectedHospitalId, setSelectedHospitalId] = useState(initialHospitalId);
  const [availabilityMode, setAvailabilityMode] = useState<'all' | 'today' | 'weekend' | 'telehealth'>('all');
  const [minExperience, setMinExperience] = useState<number>(0);
  const [minRating, setMinRating] = useState<number>(4.5);
  const [maxFee, setMaxFee] = useState<number>(120);
  const [sortBy, setSortBy] = useState<'rating' | 'fee' | 'experience'>('rating');
  const [currentPageNum, setCurrentPageNum] = useState(1);

  // Sync external navigation filters
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setSelectedSpecialty(initialSpecialty);
  }, [initialSpecialty]);

  useEffect(() => {
    setSelectedHospitalId(initialHospitalId);
  }, [initialHospitalId]);

  const filteredDoctors = useMemo(() => {
    let list = [...activeDoctorsCatalog];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.subSpecialty.toLowerCase().includes(q) ||
          d.hospitalName.toLowerCase().includes(q) ||
          d.bio.toLowerCase().includes(q)
      );
    }
    if (selectedSpecialty !== 'All') {
      list = list.filter((d) =>
        d.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
      );
    }
    if (selectedHospitalId !== 'all') {
      list = list.filter((d) => d.hospitalId === selectedHospitalId);
    }
    if (availabilityMode === 'today') {
      list = list.filter((d) => d.availableToday);
    } else if (availabilityMode === 'weekend') {
      list = list.filter((d) => d.availableWeekend);
    } else if (availabilityMode === 'telehealth') {
      list = list.filter((d) => d.telehealthReady);
    }
    list = list.filter(
      (d) =>
        d.experienceYears >= minExperience &&
        d.rating >= minRating &&
        d.fee <= maxFee
    );

    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'fee') list.sort((a, b) => a.fee - b.fee);
    if (sortBy === 'experience') list.sort((a, b) => b.experienceYears - a.experienceYears);

    return list;
  }, [
    activeDoctorsCatalog,
    searchQuery,
    selectedSpecialty,
    selectedHospitalId,
    availabilityMode,
    minExperience,
    minRating,
    maxFee,
    sortBy,
  ]);

  const perPage = 4;
  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / perPage));
  const paginatedDoctors = filteredDoctors.slice(
    (currentPageNum - 1) * perPage,
    currentPageNum * perPage
  );

  // Right-hand Scheduler state
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(activeDoctorsCatalog[0]);
  const [selectedDay, setSelectedDay] = useState(schedulerDays[1] || schedulerDays[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('03:00 PM');
  const [consultMode, setConsultMode] = useState<'In-Clinic Visit' | 'Telehealth Video'>(
    'Telehealth Video'
  );
  const [editingPatient, setEditingPatient] = useState(false);
  const [patientName, setPatientName] = useState(defaultPatientName);
  const [patientPhone, setPatientPhone] = useState(defaultPatientPhone);
  const [reason, setReason] = useState('');
  const [lastBookedAppointment, setLastBookedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (filteredDoctors.length > 0 && !filteredDoctors.some((d) => d.id === selectedDoctor.id)) {
      setSelectedDoctor(filteredDoctors[0]);
    }
  }, [filteredDoctors, selectedDoctor.id]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('All');
    setSelectedHospitalId('all');
    setAvailabilityMode('all');
    setMinExperience(0);
    setMinRating(4.5);
    setMaxFee(120);
    setCurrentPageNum(1);
  };

  const handleConfirmBooking = () => {
    const created = onBookAppointment({
      doctor: selectedDoctor,
      dateLabel: selectedDay.label,
      timeSlot: selectedTimeSlot,
      mode: consultMode,
      patientName: patientName.trim() || defaultPatientName,
      patientPhone: patientPhone.trim() || defaultPatientPhone,
      reason: reason.trim() || 'Routine specialist consultation',
    });
    setLastBookedAppointment(created);
    setReason('');
    onShowToast(
      `Appointment ${created.bookingCode} confirmed with ${created.doctorName} for ${created.dateLabel} at ${created.timeSlot}.`
    );
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Clinical Registry Notification Strip */}
      <div className="w-full bg-surface-container-low px-margin md:px-margin-lg py-space-sm flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs text-on-surface-variant text-[11px]">
          <span
            className="material-symbols-outlined text-primary text-[16px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
          <span>
            Verified Clinical Registry: All 1,420+ specialists are board-certified and currently
            accepting in-person or telehealth consults.
          </span>
        </div>
        <div className="flex items-center gap-space-md">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
            Real-time slots updated 3 mins ago
          </span>
          <button
            type="button"
            onClick={() => onNavigate('hospitals')}
            className="text-secondary hover:text-primary transition-colors text-[11px] font-semibold flex items-center gap-0.5 cursor-pointer"
          >
            Need Emergency Care?
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Main Workstation Layout */}
      <div className="w-full px-margin md:px-margin-lg py-space-lg flex flex-col gap-space-lg">
        {/* SEARCH & MULTI-DIMENSIONAL TRIAGE FILTER BAR */}
        <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center">
            {/* Keyword Search */}
            <div className="md:col-span-4 flex items-center bg-surface-container-low rounded-lg px-3 py-2.5">
              <span className="material-symbols-outlined text-outline text-[20px] mr-2">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPageNum(1);
                }}
                placeholder="Search doctor, procedure, or condition..."
                className="w-full bg-transparent text-[13px] text-on-surface placeholder-outline focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-outline hover:text-on-surface transition-colors p-1"
                  title="Clear"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Specialty Selector */}
            <div className="md:col-span-3 relative flex items-center bg-surface-container-low rounded-lg px-3 py-2.5">
              <span
                className="material-symbols-outlined text-primary text-[20px] mr-2"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                cardiology
              </span>
              <select
                value={selectedSpecialty}
                onChange={(e) => {
                  setSelectedSpecialty(e.target.value);
                  setCurrentPageNum(1);
                }}
                className="w-full bg-transparent text-[13px] text-on-surface appearance-none focus:outline-none cursor-pointer pr-6"
              >
                <option value="All">All Specialties</option>
                {SPECIALTIES.map((spec) => (
                  <option key={spec.id} value={spec.name}>
                    {spec.name}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined text-outline text-[18px] pointer-events-none">
                arrow_drop_down
              </span>
            </div>

            {/* Hospital Affiliation */}
            <div className="md:col-span-3 relative flex items-center bg-surface-container-low rounded-lg px-3 py-2.5">
              <span className="material-symbols-outlined text-secondary text-[20px] mr-2">
                local_hospital
              </span>
              <select
                value={selectedHospitalId}
                onChange={(e) => {
                  setSelectedHospitalId(e.target.value);
                  setCurrentPageNum(1);
                }}
                className="w-full bg-transparent text-[13px] text-on-surface appearance-none focus:outline-none cursor-pointer pr-6"
              >
                <option value="all">All Network Hospitals</option>
                <option value="apollo">Apollo Care &amp; Metro Heart</option>
                <option value="city">City Health Multispeciality</option>
                <option value="greenlife">GreenLife Medical Center</option>
              </select>
              <span className="material-symbols-outlined text-outline text-[18px] pointer-events-none">
                arrow_drop_down
              </span>
            </div>

            {/* Quick CTA */}
            <div className="md:col-span-2 flex items-center">
              <button
                type="button"
                onClick={() => setCurrentPageNum(1)}
                className="w-full h-[42px] bg-primary text-on-primary hover:bg-on-primary-container text-[14px] font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                Filter Results
              </button>
            </div>
          </div>

          {/* Fine-Grain Filters Sub-row */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
            <div className="flex flex-wrap items-center gap-space-sm">
              <div className="flex items-center bg-surface-container-low p-1 rounded-lg">
                {[
                  { id: 'all' as const, label: 'All Slots' },
                  { id: 'today' as const, label: 'Available Today' },
                  { id: 'weekend' as const, label: 'This Weekend' },
                  { id: 'telehealth' as const, label: 'Telehealth Ready' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setAvailabilityMode(tab.id);
                      setCurrentPageNum(1);
                    }}
                    className={`px-3 py-1 text-[11px] font-semibold rounded transition-all flex items-center gap-1.5 cursor-pointer ${
                      availabilityMode === tab.id
                        ? 'bg-surface-container-lowest text-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {tab.id === 'today' && (
                      <span className="w-2 h-2 rounded-full bg-primary-container" />
                    )}
                    {tab.label}
                  </button>
                ))}
              </div>

              <select
                value={minExperience}
                onChange={(e) => setMinExperience(Number(e.target.value))}
                className="px-3 py-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg text-[12px] font-medium cursor-pointer focus:outline-none"
              >
                <option value={0}>Experience: Any</option>
                <option value={10}>Experience: 10+ Years</option>
                <option value={15}>Experience: 15+ Years</option>
              </select>

              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="px-3 py-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg text-[12px] font-medium cursor-pointer focus:outline-none"
              >
                <option value={4.5}>Rating: 4.5+</option>
                <option value={4.8}>Rating: 4.8+</option>
                <option value={4.9}>Rating: 4.9+</option>
              </select>

              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg text-[12px] text-on-surface-variant">
                <span>Max Fee: ${maxFee}</span>
                <input
                  type="range"
                  min={50}
                  max={120}
                  step={5}
                  value={maxFee}
                  onChange={(e) => setMaxFee(Number(e.target.value))}
                  className="w-20 accent-primary cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-outline hover:text-error transition-colors text-[12px] font-semibold cursor-pointer"
              >
                Reset all
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-on-surface-variant">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'fee' | 'experience')}
                className="bg-surface-container-low px-2.5 py-1.5 rounded-lg text-[12px] font-semibold text-on-surface cursor-pointer focus:outline-none"
              >
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="fee">Lowest Fee</option>
              </select>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN WORKFLOW: DOCTORS DIRECTORY (LEFT) + BOOKING WORKFLOW (RIGHT) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
          {/* LEFT COLUMN: DOCTORS DIRECTORY */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-baseline gap-2">
                <h1 className="text-[22px] text-on-surface font-bold tracking-tight">
                  {selectedSpecialty === 'All'
                    ? 'Available Verified Specialists'
                    : `Available ${selectedSpecialty} Specialists`}
                </h1>
                <span className="text-[13px] text-on-surface-variant">
                  ({filteredDoctors.length} Specialists Found)
                </span>
              </div>
              <span className="text-[11px] text-primary flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-tertiary" />
                Live Calendar Sync
              </span>
            </div>

            {paginatedDoctors.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center flex flex-col items-center gap-3 shadow-sm">
                <span className="material-symbols-outlined text-[40px] text-outline">
                  person_search
                </span>
                <h3 className="text-[16px] font-bold text-on-surface">No matching doctors</h3>
                <p className="text-[13px] text-on-surface-variant max-w-md">
                  Try widening your fee range, switching availability tabs, or resetting all filters.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary text-[13px] font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              paginatedDoctors.map((doc) => {
                const isSelected = selectedDoctor.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`w-full bg-surface-container-lowest rounded-xl p-space-md flex flex-col gap-space-md transition-all relative overflow-hidden cursor-pointer ${
                      isSelected ? 'shadow-md ring-1 ring-primary/25' : 'shadow-sm hover:shadow-md'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary" />
                    )}

                    <div
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm ${
                        isSelected ? 'pl-2' : ''
                      }`}
                    >
                      <div className="flex items-center gap-space-md">
                        <div className="relative flex-shrink-0">
                          <ResilientImage
                            src={doc.image}
                            alt={doc.imageAlt}
                            className="w-20 h-20 rounded-xl object-cover shadow-sm"
                            fallbackLabel={doc.name}
                          />
                          <span
                            className="absolute -bottom-1 -right-1 w-4 h-4 bg-tertiary rounded-full ring-2 ring-surface-container-lowest"
                            title="Available for consults"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-[18px] text-on-surface font-bold">{doc.name}</h2>
                            <span className="px-2 py-0.5 rounded-full bg-secondary-container/20 text-on-secondary-container text-[11px] font-semibold">
                              {doc.subSpecialty}
                            </span>
                          </div>
                          <p className="text-[13px] text-on-surface-variant">{doc.credentials}</p>
                          <div className="flex items-center gap-3 mt-1 text-[11px] text-on-surface-variant flex-wrap">
                            <span className="flex items-center gap-1 text-tertiary font-bold">
                              <span
                                className="material-symbols-outlined text-[16px]"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                star
                              </span>
                              {doc.rating} ({doc.reviewsCount}+ reviews)
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px] text-outline">
                                workspace_premium
                              </span>
                              {doc.experienceYears}+ Years Exp.
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0">
                        <div className="text-left sm:text-right">
                          <span className="text-[11px] text-on-surface-variant block">
                            Consultation Fee
                          </span>
                          <span className="text-[22px] text-primary font-bold tabular-nums">
                            ${doc.fee}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-[1px] bg-surface-container" />

                    <div
                      className={`grid grid-cols-1 sm:grid-cols-2 gap-space-sm ${
                        isSelected ? 'pl-2' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 text-[12px] text-on-surface-variant">
                        <span className="material-symbols-outlined text-outline text-[18px]">
                          location_on
                        </span>
                        <span>
                          {doc.hospitalName} • <strong>{doc.distanceKm} km away</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-on-surface-variant">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          schedule
                        </span>
                        <span>
                          Next In-Clinic Slot:{' '}
                          <strong className="text-tertiary font-bold">{doc.nextSlot}</strong>
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex flex-wrap items-center justify-between gap-space-sm pt-space-xs ${
                        isSelected ? 'pl-2' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        {doc.capabilities.map((cap) => (
                          <span
                            key={cap}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-container/15 text-primary text-[11px] font-semibold"
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {cap.toLowerCase().includes('tele') || cap.toLowerCase().includes('video')
                                ? 'videocam'
                                : 'verified'}
                            </span>
                            {cap}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-space-xs">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDoctorProfile(doc);
                          }}
                          className="px-3 py-2 text-on-surface hover:text-primary font-semibold text-[12px] rounded-lg transition-colors cursor-pointer"
                        >
                          Profile &amp; Credentials
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDoctor(doc);
                          }}
                          className={`px-4 py-2 font-semibold text-[12px] rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                            isSelected
                              ? 'bg-primary text-on-primary shadow-sm'
                              : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                          }`}
                        >
                          <span>{isSelected ? 'Selected' : 'Select & Schedule'}</span>
                          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Pagination */}
            {filteredDoctors.length > 0 && (
              <div className="w-full py-space-sm flex items-center justify-between bg-surface-container-low px-space-md rounded-xl">
                <span className="text-[11px] text-on-surface-variant">
                  Showing {(currentPageNum - 1) * perPage + 1}-
                  {Math.min(currentPageNum * perPage, filteredDoctors.length)} of{' '}
                  {filteredDoctors.length} Specialists
                </span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPageNum(pageNum)}
                      className={`w-8 h-8 rounded-lg text-[12px] font-semibold flex items-center justify-center transition-colors ${
                        currentPageNum === pageNum
                          ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: INTERACTIVE APPOINTMENT SCHEDULER & REAL-TIME BOOKING PANEL */}
          <div className="lg:col-span-5 flex flex-col gap-space-md sticky top-[90px]">
            <div className="w-full bg-surface-container-lowest rounded-xl shadow-lg p-space-lg flex flex-col gap-space-md">
              {/* Selected Doctor Summary */}
              <div className="flex items-center justify-between pb-space-sm">
                <div className="flex items-center gap-3">
                  <ResilientImage
                    src={selectedDoctor.image}
                    alt={selectedDoctor.name}
                    className="w-12 h-12 rounded-xl object-cover"
                    fallbackLabel={selectedDoctor.name}
                  />
                  <div className="flex flex-col">
                    <span className="text-[11px] text-primary uppercase font-bold tracking-wide">
                      Instant Booking
                    </span>
                    <h2 className="text-[18px] text-on-surface font-bold leading-tight">
                      {selectedDoctor.name}
                    </h2>
                    <span className="text-[12px] text-on-surface-variant">
                      {selectedDoctor.specialty} • {selectedDoctor.hospitalName} ($
                      {selectedDoctor.fee})
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenDoctorProfile(selectedDoctor)}
                  className="material-symbols-outlined text-outline hover:text-on-surface cursor-pointer"
                  title="Doctor credentials"
                >
                  info
                </button>
              </div>

              {/* Section 1: Week Date Selector */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-on-surface">Select Date</span>
                  <span className="text-[11px] text-primary font-semibold">
                    {(selectedDay as any)?.monthYear || 'November 2026'}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {schedulerDays.map((day) => {
                    const active = selectedDay.id === day.id;
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => setSelectedDay(day)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl cursor-pointer transition-colors text-center ${
                          active
                            ? 'bg-primary text-on-primary shadow-sm'
                            : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                        }`}
                      >
                        <span
                          className={`text-[11px] uppercase ${
                            active ? 'text-primary-fixed' : 'text-on-surface-variant'
                          }`}
                        >
                          {day.day}
                        </span>
                        <span className="text-[16px] font-bold mt-0.5 tabular-nums">
                          {day.dateNum}
                        </span>
                        <span className={`w-1.5 h-1.5 rounded-full mt-1 ${day.statusColor}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Time Slots Segmented by Day Shift */}
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-on-surface">
                    Available Slots for {selectedDay.label}
                  </span>
                  <span className="text-[11px] text-on-surface-variant">Clinic &amp; Video</span>
                </div>

                {(
                  [
                    { label: 'Morning', icon: 'wb_twilight', slots: DAY_SHIFT_SLOTS.morning },
                    { label: 'Afternoon', icon: 'light_mode', slots: DAY_SHIFT_SLOTS.afternoon },
                    { label: 'Evening', icon: 'bedtime', slots: DAY_SHIFT_SLOTS.evening },
                  ] as const
                ).map((shift) => (
                  <div key={shift.label} className="flex flex-col gap-1.5">
                    <span className="text-[11px] text-outline uppercase font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">{shift.icon}</span>
                      {shift.label}
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {shift.slots.map((slot) => {
                        const alreadyBooked = bookedSlots.some(
                          (b) =>
                            b.doctorId === selectedDoctor.id &&
                            b.dateLabel === selectedDay.label &&
                            b.timeSlot === slot.time
                        );
                        const isDisabled = slot.disabled || alreadyBooked;
                        const active = selectedTimeSlot === slot.time && !isDisabled;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={isDisabled}
                            title={alreadyBooked ? 'Slot already booked' : undefined}
                            onClick={() => setSelectedTimeSlot(slot.time)}
                            className={`py-2 px-1 text-center rounded-lg text-[12px] tabular-nums transition-all ${
                              isDisabled
                                ? 'bg-surface-container-high/50 text-outline cursor-not-allowed line-through'
                                : active
                                  ? 'bg-primary text-on-primary font-bold shadow-sm ring-2 ring-primary-container cursor-pointer'
                                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface cursor-pointer'
                            }`}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Section 3: Consultation Mode Picker */}
              <div className="flex flex-col gap-2">
                <span className="text-[14px] font-semibold text-on-surface">Consultation Type</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConsultMode('In-Clinic Visit')}
                    className={`p-2.5 rounded-lg text-left flex items-center gap-2 transition-all cursor-pointer ${
                      consultMode === 'In-Clinic Visit'
                        ? 'bg-primary-container/20 ring-1 ring-primary-container'
                        : 'bg-surface-container-low hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      domain
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`text-[12px] font-semibold ${
                          consultMode === 'In-Clinic Visit' ? 'text-primary' : 'text-on-surface'
                        }`}
                      >
                        In-Clinic Visit
                      </span>
                      <span className="text-[11px] text-on-surface-variant truncate">
                        {selectedDoctor.hospitalName}
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultMode('Telehealth Video')}
                    className={`p-2.5 rounded-lg text-left flex items-center gap-2 transition-all cursor-pointer ${
                      consultMode === 'Telehealth Video'
                        ? 'bg-primary-container/20 ring-1 ring-primary-container'
                        : 'bg-surface-container-low hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      videocam
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`text-[12px] font-semibold ${
                          consultMode === 'Telehealth Video' ? 'text-primary' : 'text-on-surface'
                        }`}
                      >
                        Telehealth Video
                      </span>
                      <span className="text-[11px] text-on-surface-variant truncate">
                        Secure HD Call
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Section 4: Patient Info & Clinical Note */}
              <div className="flex flex-col gap-2">
                <span className="text-[14px] font-semibold text-on-surface">Patient Details</span>
                {!editingPatient ? (
                  <div className="bg-surface-container-low p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary font-bold text-[12px] flex items-center justify-center">
                        {patientName
                          .split(' ')
                          .map((w) => w[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-semibold text-on-surface">
                          {patientName} (Self)
                        </span>
                        <span className="text-[11px] text-on-surface-variant">
                          {patientPhone} • {defaultPatientEmail}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingPatient(true)}
                      className="text-primary hover:text-on-primary-container font-semibold text-[12px] cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 bg-surface-container-low p-3 rounded-lg">
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Patient Name"
                      className="w-full bg-surface-container-lowest rounded px-2.5 py-1.5 text-[13px] text-on-surface focus:outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="tel"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="Phone Number"
                        className="flex-1 bg-surface-container-lowest rounded px-2.5 py-1.5 text-[13px] text-on-surface focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingPatient(false)}
                        className="px-3 py-1.5 rounded bg-primary text-on-primary text-[12px] font-semibold"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for visit / symptoms (e.g., Routine cardiac follow-up, BP check)"
                  className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-[13px] text-on-surface placeholder-outline focus:outline-none focus:bg-surface-container"
                />
              </div>

              {/* Price Summary & CTA */}
              <div className="flex flex-col gap-space-sm pt-space-xs">
                <div className="flex items-center justify-between text-[13px] text-on-surface-variant">
                  <span>Doctor Consultation Fee</span>
                  <span className="tabular-nums">${selectedDoctor.fee}.00</span>
                </div>
                <div className="flex items-center justify-between text-[13px] text-on-surface-variant">
                  <span>Platform Triage &amp; Booking Fee</span>
                  <span className="text-tertiary font-bold">FREE ($0.00)</span>
                </div>
                <div className="w-full h-[1px] bg-surface-container" />
                <div className="flex items-center justify-between text-[14px] font-semibold text-on-surface">
                  <span>Total Payable</span>
                  <span className="text-primary font-bold text-[18px] tabular-nums">
                    ${selectedDoctor.fee}.00
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  className="w-full py-3 bg-primary text-on-primary hover:bg-on-primary-container font-semibold text-[14px] rounded-lg shadow-md transition-all flex items-center justify-center gap-2 mt-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                  Confirm &amp; Book Appointment (${selectedDoctor.fee})
                </button>
                <p className="text-[11px] text-outline text-center">
                  Free cancellation up to 2 hours before scheduled slot • Instant SMS &amp; Calendar
                  Invite
                </p>
              </div>
            </div>

            {/* LIVE CONFIRMATION PREVIEW CARD */}
            <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-tertiary text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <span className="text-[12px] font-semibold text-tertiary">
                    {lastBookedAppointment
                      ? 'Appointment Confirmed & Synced'
                      : 'Booking Ready For Quick Checkout'}
                  </span>
                </div>
                <span className="text-[11px] text-outline">
                  Ref {lastBookedAppointment ? lastBookedAppointment.bookingCode : '#MZ-88492'}
                </span>
              </div>

              <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between gap-space-sm">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] text-on-surface-variant">Scheduled Slot</span>
                  <span className="text-[13px] text-on-surface font-bold">
                    {lastBookedAppointment
                      ? `${lastBookedAppointment.dateLabel} • ${lastBookedAppointment.timeSlot}`
                      : `${selectedDay.label} • ${selectedTimeSlot}`}
                  </span>
                  <span className="text-[11px] text-primary">
                    {lastBookedAppointment
                      ? `${lastBookedAppointment.hospitalName} • ${lastBookedAppointment.mode}`
                      : `${selectedDoctor.hospitalName} • ${consultMode}`}
                  </span>
                </div>
                <div className="w-14 h-14 bg-surface-container-lowest p-1 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                  <svg className="w-full h-full text-on-surface" fill="currentColor" viewBox="0 0 40 40">
                    <path d="M4 4h12v12H4zm2 2v8h8V6zm18-2h12v12H24zm2 2v8h8V6zM4 24h12v12H4zm2 2v8h8v-8zm18 0h4v4h-4zm8 0h4v4h-4zm-8 8h4v4h-4zm8 0h4v4h-4zm-4-4h4v4h-4zM8 8h4v4H8zm20 0h4v4h-4zM8 28h4v4H8z" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between gap-space-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    downloadCalendarInvite({
                      title: `Healthcare: ${selectedDoctor.name} (${selectedDoctor.specialty})`,
                      location: selectedDoctor.hospitalName,
                      description: `Consultation Mode: ${consultMode}`,
                      bookingCode: lastBookedAppointment?.bookingCode || '#HC-88492',
                      dateLabel: selectedDay.label,
                      timeSlot: selectedTimeSlot,
                    });
                    onShowToast('Calendar invite (.ics) downloaded.');
                  }}
                  className="flex-1 py-1.5 px-2 bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">event</span>
                  Add to Google Cal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const code = lastBookedAppointment?.bookingCode || '#HC-88492';
                    downloadDocumentSlip(
                      `healthcare-slip-${code.replace('#', '')}.txt`,
                      `HEALTHCARE APPOINTMENT PASS\nRef: ${code}\nDoctor: ${selectedDoctor.name} (${selectedDoctor.specialty})\nHospital: ${selectedDoctor.hospitalName}\nSlot: ${selectedDay.label} at ${selectedTimeSlot}\nMode: ${consultMode}\nPatient: ${patientName}\nFee: $${selectedDoctor.fee}.00`
                    );
                    onShowToast(`Appointment slip ${code} downloaded.`);
                  }}
                  className="flex-1 py-1.5 px-2 bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Download Slip
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* VALUE-ADD CLINICAL STATS */}
        <div className="w-full mt-space-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-sm">
          {[
            {
              icon: 'verified_user',
              bg: 'bg-primary-container/20 text-primary',
              title: '100% Board Certified',
              sub: 'Rigorous background verification',
            },
            {
              icon: 'bolt',
              bg: 'bg-secondary-container/20 text-secondary',
              title: '< 15 Min Wait Time',
              sub: 'Guaranteed queue reservation',
            },
            {
              icon: 'shield_with_heart',
              bg: 'bg-tertiary-container/20 text-tertiary',
              title: 'Zero Booking Markup',
              sub: 'Pay standard clinic consultation rate',
            },
            {
              icon: 'support_agent',
              bg: 'bg-surface-container-high text-on-surface-variant',
              title: '24/7 Patient Care',
              sub: 'Dedicated clinical concierge team',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center gap-space-sm"
            >
              <div
                className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}
              >
                <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] text-on-surface font-bold">{item.title}</span>
                <span className="text-[11px] text-on-surface-variant">{item.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
