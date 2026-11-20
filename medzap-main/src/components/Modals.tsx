import { useEffect, useState } from 'react';
import { DOCTORS, downloadDocumentSlip } from '../data/medizapData';
import type { Appointment, Doctor, Hospital, NotificationPreference } from '../types/medizap';
import { ResilientImage } from './ResilientImage';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

function getDynamicBookingDays() {
  const days = [];
  const now = new Date();
  for (let i = 0; i < 5; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = d.getDate();
    days.push({
      id: `day-${i}`,
      label: i === 0 ? `Today, ${month} ${dayNum}` : i === 1 ? `Tomorrow, ${month} ${dayNum}` : `${dayName}, ${month} ${dayNum}`,
      isoDate: d.toISOString().split('T')[0],
      dayName,
      dateNum: String(dayNum),
    });
  }
  return days;
}

/* 1. Booking Preview Modal */
interface BookingModalProps {
  target: {
    name: string;
    subtitle: string;
    feeText: string;
    doctor?: Doctor;
    hospital?: Hospital;
  } | null;
  defaultPatientName: string;
  defaultPatientPhone: string;
  onClose: () => void;
  onConfirm: (payload: {
    doctor: Doctor;
    dateLabel: string;
    timeSlot: string;
    mode: 'In-Clinic Visit' | 'Telehealth Video';
    patientName: string;
    patientPhone: string;
    reason: string;
  }) => void;
}

export function BookingModal({
  target,
  defaultPatientName,
  defaultPatientPhone,
  onClose,
  onConfirm,
}: BookingModalProps) {
  const days = getDynamicBookingDays();
  const [selectedDay, setSelectedDay] = useState(days[1] || days[0]);
  const [selectedSlot, setSelectedSlot] = useState('04:30 PM');
  const [patientName, setPatientName] = useState(defaultPatientName);
  const [patientPhone, setPatientPhone] = useState(defaultPatientPhone);
  const [mode, setMode] = useState<'In-Clinic Visit' | 'Telehealth Video'>('In-Clinic Visit');

  if (!target) return null;

  const resolvedDoctor =
    target.doctor ||
    DOCTORS.find((d) =>
      target.hospital ? d.hospitalId === target.hospital.id : d.name === target.name
    ) ||
    DOCTORS[0];

  return (
    <div className="fixed inset-0 z-50 bg-on-background/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl p-space-lg flex flex-col gap-space-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">
              calendar_add_on
            </span>
            <h3 className="text-[18px] font-bold text-on-surface">Schedule Consultation</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="bg-surface-container-low p-3.5 rounded-xl flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-on-surface">{target.name}</span>
            <span className="text-[12px] text-secondary">{target.subtitle}</span>
          </div>
          <div className="text-right">
            <span className="text-[15px] font-bold text-primary">{target.feeText}</span>
            <span className="text-[11px] text-on-surface-variant block">Est. Consultation</span>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex flex-col gap-2">
          <span className="text-[12px] text-on-surface uppercase tracking-wider font-semibold">
            Select Appointment Date
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {days.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer flex flex-col items-center ${
                  selectedDay.id === day.id
                    ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                }`}
              >
                <span className="text-[10px] uppercase">{day.dayName}</span>
                <span className="text-[14px]">{day.dateNum}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Slot Selector */}
        <div className="flex flex-col gap-2">
          <span className="text-[12px] text-on-surface uppercase tracking-wider font-semibold">
            Select Available Slot ({selectedDay.label})
          </span>
          <div className="grid grid-cols-3 gap-2">
            {['09:30 AM', '11:00 AM', '02:00 PM', '03:30 PM', '04:30 PM', '06:00 PM'].map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`py-2 px-3 rounded-lg text-[13px] text-center transition-all cursor-pointer ${
                  selectedSlot === slot
                    ? 'bg-primary text-on-primary font-semibold shadow-sm'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(['In-Clinic Visit', 'Telehealth Video'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`py-2 px-3 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === m
                  ? 'bg-primary/10 text-primary ring-1 ring-primary'
                  : 'bg-surface-container-low text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {m === 'Telehealth Video' ? 'videocam' : 'domain'}
              </span>
              <span>{m}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[12px] text-on-surface uppercase tracking-wider font-semibold">
            Patient Information
          </span>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Full Legal Name"
            className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-[13px] text-on-surface focus:outline-none focus:bg-surface-container-lowest"
          />
          <input
            type="tel"
            value={patientPhone}
            onChange={(e) => setPatientPhone(e.target.value)}
            placeholder="Mobile Phone (for SMS confirmation)"
            className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-[13px] text-on-surface focus:outline-none focus:bg-surface-container-lowest"
          />
        </div>

        <button
          type="button"
          onClick={() =>
            onConfirm({
              doctor: resolvedDoctor,
              dateLabel: selectedDay.label,
              timeSlot: selectedSlot,
              mode,
              patientName: patientName.trim() || defaultPatientName,
              patientPhone: patientPhone.trim() || defaultPatientPhone,
              reason: `Scheduled via Quick Booking (${target.name})`,
            })
          }
          className="w-full py-3 bg-primary-container hover:bg-primary text-on-primary rounded-lg text-[14px] font-bold transition-all shadow-md cursor-pointer"
        >
          Confirm Booking
        </button>
        <span className="text-[11px] text-on-surface-variant text-center">
          No payment collected now • Free cancellation anytime
        </span>
      </div>
    </div>
  );
}

/* 2. Doctor Profile & Credentials Modal */
export function DoctorProfileModal({
  doctor,
  onClose,
  onBook,
}: {
  doctor: Doctor | null;
  onClose: () => void;
  onBook: (doc: Doctor) => void;
}) {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 bg-on-background/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest w-full max-w-xl rounded-2xl shadow-2xl p-space-lg flex flex-col gap-space-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <ResilientImage
              src={doctor.image}
              alt={doctor.imageAlt}
              className="w-20 h-20 rounded-xl object-cover shadow-sm"
              fallbackLabel={doctor.name}
            />
            <div>
              <span className="text-[11px] font-bold uppercase text-primary tracking-wider">
                Verified Specialist
              </span>
              <h3 className="text-[20px] font-bold text-on-surface">{doctor.name}</h3>
              <p className="text-[13px] text-secondary font-semibold">{doctor.credentials}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="text-[13px] text-on-surface-variant leading-relaxed">{doctor.bio}</p>

        <div className="grid grid-cols-2 gap-3 bg-surface-container-low p-3.5 rounded-xl text-[13px]">
          <div>
            <span className="text-[11px] text-outline block uppercase">Primary Facility</span>
            <span className="font-semibold text-on-surface">{doctor.hospitalName}</span>
          </div>
          <div>
            <span className="text-[11px] text-outline block uppercase">Medical Education</span>
            <span className="font-semibold text-on-surface">{doctor.education}</span>
          </div>
          <div>
            <span className="text-[11px] text-outline block uppercase">Languages</span>
            <span className="font-semibold text-on-surface">{doctor.languages.join(', ')}</span>
          </div>
          <div>
            <span className="text-[11px] text-outline block uppercase">Consultation Fee</span>
            <span className="font-bold text-primary tabular-nums">${doctor.fee}.00</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-[13px] font-semibold text-on-surface cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onBook(doctor)}
            className="px-5 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-[13px] font-semibold shadow-sm cursor-pointer"
          >
            Book Consultation (${doctor.fee})
          </button>
        </div>
      </div>
    </div>
  );
}

/* 3. Hospital Details Modal */
export function HospitalDetailsModal({
  hospital,
  onClose,
  onBookSlot,
}: {
  hospital: Hospital | null;
  onClose: () => void;
  onBookSlot: (h: Hospital) => void;
}) {
  if (!hospital) return null;

  return (
    <div className="fixed inset-0 z-50 bg-on-background/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="relative h-48 w-full bg-surface-container">
          <ResilientImage
            src={hospital.image}
            alt={hospital.imageAlt}
            className="w-full h-full object-cover"
            fallbackIcon="local_hospital"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/90 text-on-surface flex items-center justify-center shadow cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <div className="p-space-lg flex flex-col gap-space-md">
          <div>
            <h3 className="text-[20px] font-bold text-on-surface">{hospital.name}</h3>
            <p className="text-[13px] text-on-surface-variant">
              {hospital.address} • {hospital.phone}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {hospital.departments.map((d) => (
              <span
                key={d}
                className="px-2.5 py-1 rounded-md bg-secondary-fixed/40 text-secondary text-[11px] font-semibold"
              >
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center bg-surface-container-low p-3 rounded-xl">
            <div>
              <span className="text-[10px] text-outline uppercase block">ER Wait</span>
              <span className="text-[14px] font-bold text-tertiary">
                {hospital.erWaitMinutes} mins
              </span>
            </div>
            <div>
              <span className="text-[10px] text-outline uppercase block">Staff On Duty</span>
              <span className="text-[14px] font-bold text-on-surface">
                {hospital.doctorsOnDuty} Doctors
              </span>
            </div>
            <div>
              <span className="text-[10px] text-outline uppercase block">ICU Availability</span>
              <span className="text-[14px] font-bold text-primary">
                {hospital.icuBedsAvailable} Beds
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface-container-low text-[13px] font-semibold cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onBookSlot(hospital)}
              className="px-5 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-[13px] font-semibold cursor-pointer"
            >
              Book Hospital Slot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 4. Reschedule Appointment Modal */
export function RescheduleModal({
  appointment,
  onClose,
  onConfirmReschedule,
}: {
  appointment: Appointment | null;
  onClose: () => void;
  onConfirmReschedule: (appointmentId: string, newDateLabel: string, newTimeSlot: string) => void;
}) {
  const [dateLabel, setDateLabel] = useState('Oct 26, 2026');
  const [timeSlot, setTimeSlot] = useState('11:30 AM');

  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-50 bg-on-background/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl p-space-lg flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-on-surface">Reschedule Visit</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="bg-surface-container-low p-3 rounded-xl text-[13px]">
          <div className="font-bold text-on-surface">
            {appointment.doctorName} ({appointment.bookingCode})
          </div>
          <div className="text-on-surface-variant">
            Current: {appointment.dateLabel} • {appointment.timeSlot}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-semibold text-on-surface uppercase">Select Date</label>
          <div className="grid grid-cols-3 gap-2">
            {['Oct 26, 2026', 'Oct 27, 2026', 'Oct 29, 2026'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDateLabel(d)}
                className={`py-2 px-2 rounded-lg text-[12px] font-semibold cursor-pointer ${
                  dateLabel === d
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-low text-on-surface'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-semibold text-on-surface uppercase">Select Time</label>
          <div className="grid grid-cols-3 gap-2">
            {['09:30 AM', '11:30 AM', '04:00 PM'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeSlot(t)}
                className={`py-2 px-2 rounded-lg text-[12px] font-semibold cursor-pointer ${
                  timeSlot === t
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-low text-on-surface'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onConfirmReschedule(appointment.id, dateLabel, timeSlot)}
          className="w-full py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-[14px] font-bold cursor-pointer"
        >
          Confirm New Slot
        </button>
      </div>
    </div>
  );
}

/* 5. Teleconsultation / Video Triage Modal */
export function TeleconsultModal({
  isOpen,
  appointment,
  onClose,
}: {
  isOpen: boolean;
  appointment?: Appointment | null;
  onClose: () => void;
}) {
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [noteInput, setNoteInput] = useState('');
  const [sentNotes, setSentNotes] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setElapsedSeconds(0);
      setSentNotes([]);
      return;
    }
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const mins = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
  const secs = String(elapsedSeconds % 60).padStart(2, '0');
  const connected = elapsedSeconds >= 2;

  return (
    <div className="fixed inset-0 z-50 bg-on-background/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="bg-primary text-on-primary p-space-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px]">videocam</span>
            <div>
              <div className="text-[15px] font-bold">
                {appointment
                  ? `Teleconsultation: ${appointment.doctorName}`
                  : 'Emergency Video Triage Room'}
              </div>
              <div className="text-[11px] opacity-90 flex items-center gap-2">
                <span>HIPAA Encrypted HD Clinical Stream</span>
                <span>•</span>
                <span className="tabular-nums font-semibold">
                  {connected ? `Live ${mins}:${secs}` : 'Connecting...'}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-on-primary/20 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-space-lg flex flex-col gap-space-md items-center text-center bg-surface-container-low">
          <div className="relative w-24 h-24 rounded-full bg-primary/15 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[42px]">
              {camOff ? 'videocam_off' : 'medical_services'}
            </span>
            <span
              className={`absolute bottom-1 right-1 w-4 h-4 rounded-full ring-2 ring-surface-container-low ${
                connected ? 'bg-tertiary animate-pulse' : 'bg-secondary'
              }`}
            />
          </div>
          <div>
            <h4 className="text-[16px] font-bold text-on-surface">
              {connected
                ? appointment
                  ? `Connected to ${appointment.doctorName} Suite`
                  : 'Triage Clinician Joined'
                : appointment
                  ? 'Waiting Room Ready'
                  : 'Connecting to On-Duty Triage Clinician'}
            </h4>
            <p className="text-[13px] text-on-surface-variant mt-1 max-w-sm">
              {appointment
                ? `Session (${appointment.bookingCode}) active. Audio and HD encrypted video diagnostics passed.`
                : 'On-duty emergency triage nurse is reviewing your profile. Share your key symptoms below.'}
            </p>
          </div>

          {sentNotes.length > 0 && (
            <div className="w-full bg-surface-container-lowest rounded-xl p-2.5 text-left flex flex-col gap-1 max-h-24 overflow-y-auto">
              {sentNotes.map((n, i) => (
                <div key={i} className="text-[12px] text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-tertiary text-[14px]">check</span>
                  <span>{n}</span>
                </div>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!noteInput.trim()) return;
              setSentNotes((prev) => [...prev, noteInput.trim()]);
              setNoteInput('');
            }}
            className="w-full flex items-center gap-2"
          >
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Send vitals or symptom note to clinician..."
              className="flex-1 bg-surface-container-lowest rounded-lg px-3 py-2 text-[13px] text-on-surface focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-lg bg-primary-container text-on-primary text-[12px] font-semibold cursor-pointer"
            >
              Send
            </button>
          </form>

          <div className="flex items-center gap-3 pt-1 flex-wrap justify-center">
            <button
              type="button"
              onClick={() => setMicMuted((prev) => !prev)}
              className={`px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer ${
                micMuted
                  ? 'bg-error-container text-error'
                  : 'bg-surface-container-lowest text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {micMuted ? 'mic_off' : 'mic'}
              </span>
              <span>{micMuted ? 'Unmute Mic' : 'Mic Ready'}</span>
            </button>
            <button
              type="button"
              onClick={() => setCamOff((prev) => !prev)}
              className={`px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer ${
                camOff
                  ? 'bg-error-container text-error'
                  : 'bg-surface-container-lowest text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {camOff ? 'videocam_off' : 'videocam'}
              </span>
              <span>{camOff ? 'Camera Off' : 'Camera Ready'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-error text-on-error text-[13px] font-semibold cursor-pointer"
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 6. Appointment Details / Prep Modal */
export function AppointmentInfoModal({
  appointment,
  mode,
  onClose,
}: {
  appointment: Appointment | null;
  mode: 'details' | 'prep';
  onClose: () => void;
}) {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-50 bg-on-background/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl p-space-lg flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-on-surface">
            {mode === 'prep' ? 'Preparation Guidelines' : `Appointment ${appointment.bookingCode}`}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col gap-1.5 text-[13px]">
          <div className="font-bold text-on-surface">{appointment.doctorName}</div>
          <div className="text-secondary font-semibold">{appointment.doctorSpecialty}</div>
          <div className="text-on-surface-variant">
            {appointment.hospitalName} • {appointment.hospitalWing}
          </div>
          <div className="text-on-surface font-medium pt-1">
            {appointment.dateLabel} at {appointment.timeSlot} ({appointment.mode})
          </div>
        </div>

        <div className="text-[13px] text-on-surface-variant leading-relaxed">
          <div className="font-semibold text-on-surface mb-1">Clinical Checklist:</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              {appointment.prepNote ||
                'Fast 4 hours prior for blood baseline panels if ordered.'}
            </li>
            <li>Carry digital or printed copies of recent lab reports and current medications.</li>
            <li>Arrive or join video triage 10 minutes before your scheduled slot.</li>
          </ul>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() =>
              downloadDocumentSlip(
                `medizap-pass-${appointment.bookingCode.replace('#', '')}.txt`,
                `MEDIZAP PASS ${appointment.bookingCode}\nDoctor: ${appointment.doctorName}\nHospital: ${appointment.hospitalName}\nSlot: ${appointment.dateLabel} ${appointment.timeSlot}\nPrep: ${appointment.prepNote || 'Standard intake'}`
              )
            }
            className="px-4 py-2 rounded-lg bg-surface-container-low text-[13px] font-semibold cursor-pointer"
          >
            Download Pass
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary text-on-primary text-[13px] font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

/* 7. Notification Channels Modal */
export function NotificationChannelsModal({
  isOpen,
  prefs,
  onToggle,
  onClose,
}: {
  isOpen: boolean;
  prefs: NotificationPreference[];
  onToggle: (id: string, channel: 'sms' | 'email' | 'push') => void;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-on-background/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl p-space-lg flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-on-surface">Manage Notification Channels</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {prefs.map((pref) => (
            <div
              key={pref.id}
              className="bg-surface-container-low p-3 rounded-xl flex items-center justify-between gap-3"
            >
              <div>
                <div className="text-[13px] font-bold text-on-surface">{pref.title}</div>
                <div className="text-[11px] text-on-surface-variant">{pref.description}</div>
              </div>
              <div className="flex items-center gap-1.5">
                {(['sms', 'email', 'push'] as const).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => onToggle(pref.id, ch)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold uppercase cursor-pointer ${
                      pref[ch]
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-lowest text-outline'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-lg bg-primary text-on-primary text-[14px] font-semibold cursor-pointer"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}

/* 8. Auth Modal (Login / Sign Up with Supabase Auth & Demo Fallback) */
export function AuthModal({
  mode: initialMode,
  onClose,
  onAuthenticate,
}: {
  mode: 'login' | 'signup' | null;
  onClose: () => void;
  onAuthenticate: (name: string, email: string, userId?: string) => void;
}) {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode || 'login');
  const [name, setName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.m@healthmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!initialMode) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    if (isSupabaseConfigured) {
      try {
        if (authMode === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password,
            options: {
              data: {
                name: name.trim() || 'Alex Morgan',
              },
            },
          });
          if (error) {
            setErrorMessage(error.message);
            setLoading(false);
            return;
          }
          const user = data.user;
          onAuthenticate(
            name.trim() || user?.user_metadata?.name || 'Alex Morgan',
            email.trim(),
            user?.id
          );
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password,
          });
          if (error) {
            setErrorMessage(error.message);
            setLoading(false);
            return;
          }
          const user = data.user;
          const resolvedName =
            user?.user_metadata?.name ||
            (user?.email ? user.email.split('@')[0] : 'Alex Morgan');
          onAuthenticate(resolvedName, email.trim(), user?.id);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Authentication error.');
      } finally {
        setLoading(false);
      }
    } else {
      // Local fallback / demo mode
      setTimeout(() => {
        setLoading(false);
        onAuthenticate(name.trim() || 'Alex Morgan', email.trim() || 'alex.m@healthmail.com');
      }, 300);
    }
  };

  const handleQuickDemo = () => {
    onAuthenticate('Alex Morgan', 'alex.m@healthmail.com');
  };

  return (
    <div className="fixed inset-0 z-50 bg-on-background/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl p-space-lg flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[20px] font-bold text-on-surface">
              {authMode === 'login' ? 'Sign In to MediZap' : 'Create MediZap Account'}
            </h3>
            <p className="text-[12px] text-on-surface-variant">
              {isSupabaseConfigured
                ? 'Connected to Supabase Cloud Authentication'
                : 'Local Mode (Configure .env for Supabase)'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Database status pill */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-surface-container-low text-[11px]">
          <span className="flex items-center gap-1.5 font-medium text-on-surface-variant">
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured ? 'bg-primary animate-pulse' : 'bg-tertiary'
              }`}
            />
            {isSupabaseConfigured ? 'Supabase Auth Ready' : 'Demo / Offline Auth'}
          </span>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="text-primary hover:underline font-semibold cursor-pointer"
          >
            Quick Demo Login ⚡
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-error-container text-on-error-container text-[12px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {authMode === 'signup' && (
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase text-on-surface-variant">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. / Mr. / Ms. Full Name"
                required
                className="bg-surface-container-low rounded-lg px-3 py-2.5 text-[13px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase text-on-surface-variant">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex.m@healthmail.com"
              required
              className="bg-surface-container-low rounded-lg px-3 py-2.5 text-[13px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase text-on-surface-variant">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure password"
              required
              minLength={6}
              className="bg-surface-container-low rounded-lg px-3 py-2.5 text-[13px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-1 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-[14px] font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />}
            <span>
              {authMode === 'login'
                ? loading
                  ? 'Signing In...'
                  : 'Sign In'
                : loading
                ? 'Creating Account...'
                : 'Create Account'}
            </span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-surface-container">
          {authMode === 'login' ? (
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage(null);
              }}
              className="text-[12px] text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              Don't have an account? <span className="font-bold underline">Create one now</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage(null);
              }}
              className="text-[12px] text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              Already registered? <span className="font-bold underline">Sign in to your portal</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
