import { useMemo, useState } from 'react';
import { HOSPITALS } from '../data/medizapData';
import type { Hospital } from '../types/medizap';
import { ResilientImage } from './ResilientImage';

interface HospitalsPageProps {
  onOpenBookingModal: (target: {
    name: string;
    subtitle: string;
    feeText: string;
    hospital: Hospital;
  }) => void;
  onOpenHospitalDetails: (hospital: Hospital) => void;
  onViewDoctorsAtHospital: (hospitalId: string) => void;
}

export function HospitalsPage({
  onOpenBookingModal,
  onOpenHospitalDetails,
  onViewDoctorsAtHospital,
}: HospitalsPageProps) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  const filteredHospitals = useMemo(() => {
    return HOSPITALS.filter((h) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          h.name.toLowerCase().includes(q) ||
          h.area.toLowerCase().includes(q) ||
          h.departments.some((d) => d.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (deptFilter !== 'All') {
        if (!h.departments.some((d) => d.toLowerCase().includes(deptFilter.toLowerCase()))) {
          return false;
        }
      }
      if (emergencyOnly && !h.badgeText.toLowerCase().includes('emergency')) {
        return false;
      }
      return true;
    });
  }, [search, deptFilter, emergencyOnly]);

  return (
    <div className="w-full px-margin md:px-margin-lg py-space-lg flex flex-col gap-space-lg">
      {/* Header Banner */}
      <div className="max-w-7xl w-full mx-auto bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <span className="text-[12px] text-secondary uppercase tracking-wider font-bold">
            Accredited Clinical Network
          </span>
          <h1 className="text-[30px] text-on-surface font-bold tracking-tight">
            Hospitals &amp; Emergency Centers
          </h1>
          <p className="text-[14px] text-on-surface-variant max-w-2xl">
            Live ER wait times, ICU bed availability, and on-duty specialists across verified
            partner medical centers.
          </p>
        </div>
        <div className="flex items-center gap-space-sm flex-shrink-0">
          <div className="bg-tertiary-container/15 text-tertiary px-3.5 py-2 rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-ping" />
            <span className="text-[13px] font-bold">Live ER Queue Synced</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl w-full mx-auto bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex flex-wrap items-center gap-space-sm flex-1">
          <div className="flex items-center bg-surface-container-low rounded-lg px-3 py-2 flex-1 min-w-[220px] max-w-md">
            <span className="material-symbols-outlined text-outline text-[20px] mr-2">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hospital name, area, or department..."
              className="w-full bg-transparent text-[13px] text-on-surface placeholder-outline focus:outline-none"
            />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-surface-container-low px-3 py-2 rounded-lg text-[13px] text-on-surface cursor-pointer focus:outline-none"
          >
            <option value="All">Department: All</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
          </select>

          <button
            type="button"
            onClick={() => setEmergencyOnly((prev) => !prev)}
            className={`px-3 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              emergencyOnly
                ? 'bg-tertiary-container/25 text-tertiary ring-1 ring-tertiary/30'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">emergency</span>
            <span>24/7 Emergency Only</span>
          </button>
        </div>

        <span className="text-[12px] text-on-surface-variant font-medium">
          Showing {filteredHospitals.length} verified facilities
        </span>
      </div>

      {/* Hospitals Grid */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {filteredHospitals.map((hospital) => (
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
                <span className="material-symbols-outlined text-tertiary text-[16px]">stars</span>
                <span className="text-[12px] text-on-surface font-bold">{hospital.rating}</span>
                <span className="text-[11px] text-on-surface-variant">
                  ({hospital.reviewsCount}+ reviews)
                </span>
              </div>
              <div
                className={`absolute top-3 right-3 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 ${
                  hospital.badgeVariant === 'tertiary'
                    ? 'bg-tertiary-container/90 text-on-tertiary'
                    : 'bg-primary-container/90 text-on-primary'
                }`}
              >
                {hospital.badgeText}
              </div>
            </div>

            <div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
              <div className="flex flex-col gap-2.5">
                <div>
                  <h2 className="text-[18px] text-on-surface font-bold">{hospital.name}</h2>
                  <div className="flex items-center gap-1 text-on-surface-variant text-[13px] mt-0.5">
                    <span className="material-symbols-outlined text-primary text-[16px]">
                      location_on
                    </span>
                    <span>
                      {hospital.area} • {hospital.distanceKm} km away
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {hospital.departments.slice(0, 3).map((dept) => (
                    <span
                      key={dept}
                      className="px-2 py-0.5 rounded-md bg-secondary-fixed/30 text-secondary text-[11px] font-semibold"
                    >
                      {dept}
                    </span>
                  ))}
                  {hospital.departments.length > 3 && (
                    <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[11px] font-semibold">
                      +{hospital.departments.length - 3} More
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="bg-surface-container-low p-2 rounded-lg text-center">
                    <span className="text-[10px] text-outline uppercase block">Staff</span>
                    <span className="text-[13px] font-bold text-on-surface tabular-nums">
                      {hospital.doctorsOnDuty} On Duty
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-2 rounded-lg text-center">
                    <span className="text-[10px] text-outline uppercase block">ER Wait</span>
                    <span className="text-[13px] font-bold text-tertiary tabular-nums">
                      ~{hospital.erWaitMinutes} mins
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-2 rounded-lg text-center">
                    <span className="text-[10px] text-outline uppercase block">ICU Beds</span>
                    <span className="text-[13px] font-bold text-primary tabular-nums">
                      {hospital.icuBedsAvailable} Open
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenHospitalDetails(hospital)}
                    className="flex-1 py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-[13px] font-semibold transition-colors cursor-pointer"
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
                    className="flex-1 py-2 px-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-[13px] font-semibold transition-colors shadow-sm cursor-pointer"
                  >
                    Book Slot
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => onViewDoctorsAtHospital(hospital.id)}
                  className="w-full py-1.5 text-[12px] font-semibold text-secondary hover:text-primary transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Browse Doctors at {hospital.name}</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
