import { useMemo, useState } from 'react';
import {
  ALEX_MORGAN_AVATAR_URL,
  downloadCalendarInvite,
  downloadDocumentSlip,
} from '../data/medizapData';
import type {
  Appointment,
  DashboardSection,
  FamilyMember,
  MedicalRecord,
  NotificationPreference,
  PageRoute,
} from '../types/medizap';
import { ResilientImage } from './ResilientImage';

interface MyAppointmentsPageProps {
  appointments: Appointment[];
  records: MedicalRecord[];
  familyMembers: FamilyMember[];
  notificationPrefs: NotificationPreference[];
  userName: string;
  userEmail: string;
  userPhone: string;
  onUpdateUserProfile: (name: string, email: string, phone: string) => void;
  onAddFamilyMember: (member: Omit<FamilyMember, 'id' | 'memberId'>) => void;
  onToggleNotificationPref: (id: string, channel: 'sms' | 'email' | 'push') => void;
  onNavigate: (page: PageRoute) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onOpenRescheduleModal: (appointment: Appointment) => void;
  onOpenTeleconsultModal: (appointment?: Appointment) => void;
  onOpenPrepModal: (appointment: Appointment) => void;
  onOpenAppointmentDetails: (appointment: Appointment) => void;
  onOpenNotificationChannelsModal: () => void;
  onBookFollowUp: (doctorId: string) => void;
  onSignOut: () => void;
  onShowToast: (msg: string) => void;
}

export function MyAppointmentsPage({
  appointments,
  records,
  familyMembers,
  notificationPrefs,
  userName,
  userEmail,
  userPhone,
  onUpdateUserProfile,
  onAddFamilyMember,
  onToggleNotificationPref,
  onNavigate,
  onCancelAppointment,
  onOpenRescheduleModal,
  onOpenTeleconsultModal,
  onOpenPrepModal,
  onOpenAppointmentDetails,
  onOpenNotificationChannelsModal,
  onBookFollowUp,
  onSignOut,
  onShowToast,
}: MyAppointmentsPageProps) {
  const [activeSection, setActiveSection] = useState<DashboardSection>('my-appointments');
  const [tableSearch, setTableSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Confirmed' | 'Pending Slot' | 'Cancelled'>('ALL');
  const [showAllRecords, setShowAllRecords] = useState(false);

  // Family Add form
  const [newFamName, setNewFamName] = useState('');
  const [newFamRelation, setNewFamRelation] = useState('Child');
  const [newFamAge, setNewFamAge] = useState('12');

  // Settings form
  const [editName, setEditName] = useState(userName);
  const [editEmail, setEditEmail] = useState(userEmail);
  const [editPhone, setEditPhone] = useState(userPhone);

  const upcomingCount = appointments.filter(
    (a) => a.status === 'Confirmed' || a.status === 'Pending Slot'
  ).length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length + 1;
  const completedCount = records.length + 9;
  const totalCount = upcomingCount + completedCount + cancelledCount;

  const primaryAppointment = useMemo(
    () =>
      appointments.find((a) => a.status === 'Confirmed') ||
      appointments.find((a) => a.status === 'Pending Slot') ||
      null,
    [appointments]
  );

  const filteredTableAppointments = useMemo(() => {
    return appointments.filter((a) => {
      if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase();
        return (
          a.bookingCode.toLowerCase().includes(q) ||
          a.doctorName.toLowerCase().includes(q) ||
          a.hospitalName.toLowerCase().includes(q) ||
          a.doctorSpecialty.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [appointments, statusFilter, tableSearch]);

  const cycleStatusFilter = () => {
    const order: ('ALL' | 'Confirmed' | 'Pending Slot' | 'Cancelled')[] = [
      'ALL',
      'Confirmed',
      'Pending Slot',
      'Cancelled',
    ];
    const nextIdx = (order.indexOf(statusFilter) + 1) % order.length;
    setStatusFilter(order[nextIdx]);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full px-margin md:px-margin-lg py-space-lg">
        <div className="grid grid-cols-12 gap-gutter-lg items-start">
          {/* 1. DASHBOARD SIDEBAR NAVIGATION */}
          <aside className="col-span-12 lg:col-span-3 flex flex-col gap-space-md lg:sticky lg:top-[90px]">
            {/* Patient Identity Badge */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center gap-space-sm">
              <div className="relative flex-shrink-0">
                <ResilientImage
                  src={ALEX_MORGAN_AVATAR_URL}
                  alt={userName}
                  className="w-12 h-12 rounded-full object-cover"
                  fallbackLabel={userName}
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-tertiary rounded-full ring-2 ring-surface-container-lowest" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[18px] text-on-surface truncate font-semibold">
                    {userName}
                  </span>
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    verified
                  </span>
                </div>
                <span className="text-[11px] text-on-surface-variant uppercase tracking-wider">
                  Patient ID: #HC-88219
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex flex-col gap-1">
              <span className="text-[11px] text-outline px-3 pt-2 pb-1 uppercase tracking-wider font-semibold">
                Care Portal
              </span>

              <button
                type="button"
                onClick={() => setActiveSection('dashboard')}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                  activeSection === 'dashboard'
                    ? 'bg-primary-container text-on-primary'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">dashboard</span>
                  <span className="text-[14px] font-semibold">Dashboard</span>
                </div>
                {activeSection === 'dashboard' && (
                  <span className="w-2 h-2 rounded-full bg-surface-container-lowest" />
                )}
              </button>

              <button
                type="button"
                onClick={() => onNavigate('find-doctors')}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all cursor-pointer"
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">person_search</span>
                  <span className="text-[14px] font-semibold">Find Doctors</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('hospitals')}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all cursor-pointer"
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">local_hospital</span>
                  <span className="text-[14px] font-semibold">Find Hospitals</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('my-appointments')}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                  activeSection === 'my-appointments'
                    ? 'bg-primary-container text-on-primary font-semibold'
                    : 'text-primary font-semibold bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                  <span className="text-[14px]">My Appointments</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    activeSection === 'my-appointments'
                      ? 'bg-surface-container-lowest/20 text-on-primary'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {upcomingCount} Active
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('history')}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                  activeSection === 'history'
                    ? 'bg-primary-container text-on-primary'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">history</span>
                  <span className="text-[14px] font-semibold">Appointment History</span>
                </div>
              </button>

              <span className="text-[11px] text-outline px-3 pt-3 pb-1 uppercase tracking-wider font-semibold">
                Account &amp; Health
              </span>

              <button
                type="button"
                onClick={() => setActiveSection('family')}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                  activeSection === 'family'
                    ? 'bg-primary-container text-on-primary'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">diversity_1</span>
                  <span className="text-[14px] font-semibold">Family Profiles</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full bg-secondary-fixed text-secondary text-[11px] font-semibold">
                  {familyMembers.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('notifications')}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                  activeSection === 'notifications'
                    ? 'bg-primary-container text-on-primary'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">
                    notifications_active
                  </span>
                  <span className="text-[14px] font-semibold">Notifications</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-tertiary" />
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('settings')}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                  activeSection === 'settings'
                    ? 'bg-primary-container text-on-primary'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                  <span className="text-[14px] font-semibold">Settings</span>
                </div>
              </button>

              <div className="pt-space-sm mt-space-sm bg-surface-container-low/50 -mx-space-sm px-space-sm pb-1 rounded-b-xl flex flex-col gap-1">
                <button
                  type="button"
                  onClick={onSignOut}
                  className="flex items-center gap-space-sm px-3 py-2 rounded-lg text-error hover:bg-error-container/30 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                  <span className="text-[14px] font-semibold">Sign Out</span>
                </button>
              </div>
            </nav>

            {/* Quick Emergency Tele-triage Card */}
            <div className="bg-surface-container-high/60 rounded-xl p-space-md shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-tertiary text-[20px]">
                  medical_services
                </span>
                <span className="text-[12px] font-semibold text-on-surface uppercase">
                  Instant Triage
                </span>
              </div>
              <p className="text-[13px] text-on-surface-variant mb-space-sm">
                Need immediate clinical advice? Connect with an emergency medical responder in &lt;
                90 seconds.
              </p>
              <button
                type="button"
                onClick={() => onOpenTeleconsultModal()}
                className="w-full bg-secondary text-on-secondary px-3 py-2 rounded-lg text-[14px] font-semibold flex items-center justify-center gap-1.5 hover:bg-secondary/90 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">videocam</span>
                <span>Launch Video Triage</span>
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT PANEL */}
          <section className="col-span-12 lg:col-span-9 flex flex-col gap-space-lg">
            {/* 2. WELCOME HEADER & METRIC SUMMARY CARDS */}
            <div className="flex flex-col gap-space-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-[24px] md:text-[30px] text-on-surface tracking-tight font-bold">
                      Welcome Back, {userName}!
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                      Gold Care Pass
                    </span>
                  </div>
                  <p className="text-[16px] text-on-surface-variant mt-1">
                    Manage your scheduled visits, past consultations, and health reminders.
                  </p>
                </div>

                <div className="flex items-center gap-space-sm">
                  <button
                    type="button"
                    onClick={() => onShowToast('Calendar & hospital dispatch statuses synchronized.')}
                    className="bg-surface-container-low hover:bg-surface-container text-on-surface px-4 py-2.5 rounded-lg text-[14px] font-semibold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">sync</span>
                    <span>Refresh Calendar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('find-doctors')}
                    className="bg-primary-container text-on-primary hover:bg-primary px-4 py-2.5 rounded-lg text-[14px] font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    <span>Book New Visit</span>
                  </button>
                </div>
              </div>

              {/* 4 Metric KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter-sm">
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-on-surface-variant">Total Appointments</span>
                    <div className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">folder_shared</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mt-space-sm">
                    <span className="text-[36px] leading-tight text-on-surface font-bold tabular-nums">
                      {totalCount}
                    </span>
                    <span className="text-[11px] text-tertiary flex items-center">
                      <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +3
                      this year
                    </span>
                  </div>
                  <span className="text-[11px] text-outline mt-1">All-time lifetime records</span>
                </div>

                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-on-surface-variant">Upcoming Visits</span>
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">event_upcoming</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5 mt-space-sm">
                    <span className="text-[36px] leading-tight text-primary font-bold tabular-nums">
                      {upcomingCount}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping" />
                      Active Sync
                    </span>
                  </div>
                  <span className="text-[11px] text-outline mt-1">
                    {primaryAppointment
                      ? `Next: ${primaryAppointment.dateLabel} at ${primaryAppointment.timeSlot}`
                      : 'No upcoming visits'}
                  </span>
                </div>

                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-on-surface-variant">Completed</span>
                    <div className="w-9 h-9 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[20px]">task_alt</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mt-space-sm">
                    <span className="text-[36px] leading-tight text-on-surface font-bold tabular-nums">
                      {completedCount}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">Consultations</span>
                  </div>
                  <span className="text-[11px] text-outline mt-1">100% summaries archived</span>
                </div>

                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-on-surface-variant">Cancelled / Changed</span>
                    <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-outline">
                      <span className="material-symbols-outlined text-[20px]">edit_calendar</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mt-space-sm">
                    <span className="text-[36px] leading-tight text-on-surface font-bold tabular-nums">
                      {cancelledCount}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">Recorded</span>
                  </div>
                  <span className="text-[11px] text-outline mt-1">
                    Zero cancellation fees applied
                  </span>
                </div>
              </div>
            </div>

            {/* SUB-VIEW SWITCHING FOR SIDEBAR ITEMS */}
            {activeSection === 'family' ? (
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-[20px] font-bold text-on-surface">Family Care Profiles</h2>
                    <p className="text-[13px] text-on-surface-variant">
                      Manage dependents linked to your Healthcare Gold Care Pass.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-sm">
                  {familyMembers.map((fam) => (
                    <div
                      key={fam.id}
                      className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[16px] font-bold text-on-surface">{fam.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-secondary text-[11px] font-semibold">
                          {fam.relation}
                        </span>
                      </div>
                      <div className="text-[12px] text-on-surface-variant">
                        Age {fam.age} • Blood Group {fam.bloodGroup}
                      </div>
                      <div className="text-[11px] text-outline">
                        ID: {fam.memberId} • Primary: {fam.primaryPhysician}
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newFamName.trim()) return;
                    onAddFamilyMember({
                      name: newFamName.trim(),
                      relation: newFamRelation,
                      age: Number(newFamAge) || 10,
                      bloodGroup: 'O+',
                      primaryPhysician: 'Dr. Arjun Kumar',
                    });
                    setNewFamName('');
                  }}
                  className="bg-surface-container-low/60 rounded-xl p-space-md flex flex-wrap items-end gap-space-sm"
                >
                  <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
                    <label className="text-[11px] font-semibold text-on-surface-variant uppercase">
                      Add Family Member
                    </label>
                    <input
                      type="text"
                      value={newFamName}
                      onChange={(e) => setNewFamName(e.target.value)}
                      placeholder="Full Name"
                      className="bg-surface-container-lowest rounded-lg px-3 py-2 text-[13px] text-on-surface focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-32">
                    <label className="text-[11px] font-semibold text-on-surface-variant uppercase">
                      Relation
                    </label>
                    <select
                      value={newFamRelation}
                      onChange={(e) => setNewFamRelation(e.target.value)}
                      className="bg-surface-container-lowest rounded-lg px-3 py-2 text-[13px] text-on-surface focus:outline-none"
                    >
                      <option>Child</option>
                      <option>Spouse</option>
                      <option>Parent</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 w-24">
                    <label className="text-[11px] font-semibold text-on-surface-variant uppercase">
                      Age
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={newFamAge}
                      onChange={(e) => setNewFamAge(e.target.value)}
                      className="bg-surface-container-lowest rounded-lg px-3 py-2 text-[13px] text-on-surface focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-primary text-on-primary text-[13px] font-semibold hover:bg-on-primary-container transition-colors cursor-pointer"
                  >
                    Add Profile
                  </button>
                </form>
              </div>
            ) : activeSection === 'notifications' ? (
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
                <div>
                  <h2 className="text-[20px] font-bold text-on-surface">
                    Clinical Notification Channels
                  </h2>
                  <p className="text-[13px] text-on-surface-variant">
                    Control how Healthcare dispatches SMS, email, and portal alerts.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {notificationPrefs.map((pref) => (
                    <div
                      key={pref.id}
                      className="bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-[14px] font-bold text-on-surface">{pref.title}</div>
                        <div className="text-[12px] text-on-surface-variant">
                          {pref.description}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {(['sms', 'email', 'push'] as const).map((ch) => (
                          <button
                            key={ch}
                            type="button"
                            onClick={() => onToggleNotificationPref(pref.id, ch)}
                            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold uppercase transition-colors cursor-pointer ${
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
              </div>
            ) : activeSection === 'settings' ? (
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
                <div>
                  <h2 className="text-[20px] font-bold text-on-surface">Patient Account Settings</h2>
                  <p className="text-[13px] text-on-surface-variant">
                    Keep your contact information updated for rapid dispatch and lab alerts.
                  </p>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onUpdateUserProfile(editName, editEmail, editPhone);
                  }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-space-sm"
                >
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-on-surface-variant uppercase">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-surface-container-low rounded-lg px-3 py-2.5 text-[13px] text-on-surface focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-on-surface-variant uppercase">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="bg-surface-container-low rounded-lg px-3 py-2.5 text-[13px] text-on-surface focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-on-surface-variant uppercase">
                      Mobile Phone
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="bg-surface-container-low rounded-lg px-3 py-2.5 text-[13px] text-on-surface focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-3 flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-primary text-on-primary text-[14px] font-semibold hover:bg-on-primary-container transition-colors cursor-pointer"
                    >
                      Save Profile Settings
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                {/* 3. UPCOMING APPOINTMENT HIGHLIGHT CARD (Asymmetric Hero Card) */}
                {activeSection !== 'history' && primaryAppointment && (
                  <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg relative overflow-hidden">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md">
                        <div className="relative flex-shrink-0">
                          <ResilientImage
                            src={primaryAppointment.doctorImage}
                            alt={primaryAppointment.doctorName}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shadow-sm"
                            fallbackLabel={primaryAppointment.doctorName}
                          />
                          <span className="absolute -top-2 -left-2 px-2 py-0.5 bg-primary-container text-on-primary text-[11px] font-semibold rounded-full">
                            Primary
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary text-[11px] font-semibold inline-flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                              {primaryAppointment.dateLabel} at {primaryAppointment.timeSlot}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-secondary text-[11px] font-semibold">
                              {primaryAppointment.doctorSpecialty} Checkup
                            </span>
                            <span className="text-[11px] text-outline">
                              Ref {primaryAppointment.bookingCode}
                            </span>
                          </div>
                          <h2 className="text-[22px] text-on-surface mt-1 font-bold">
                            {primaryAppointment.doctorName}, MD
                          </h2>
                          <p className="text-[14px] text-on-surface-variant">
                            {primaryAppointment.doctorTitle}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-on-surface-variant">
                            <span className="material-symbols-outlined text-[18px] text-primary">
                              apartment
                            </span>
                            <span className="text-[13px] font-medium">
                              {primaryAppointment.hospitalName} • {primaryAppointment.hospitalWing}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Action Command Strip */}
                      <div className="flex flex-col sm:flex-row xl:flex-col gap-2.5 flex-shrink-0 min-w-[240px]">
                        <button
                          type="button"
                          onClick={() => onOpenTeleconsultModal(primaryAppointment)}
                          className="bg-primary text-on-primary hover:bg-on-primary-container px-4 py-2.5 rounded-lg text-[14px] font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px]">videocam</span>
                          <span>Join Teleconsultation</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            downloadCalendarInvite({
                              title: `Healthcare: ${primaryAppointment.doctorName}`,
                              location: `${primaryAppointment.hospitalName} (${primaryAppointment.hospitalWing})`,
                              description: primaryAppointment.reason || 'Consultation',
                              bookingCode: primaryAppointment.bookingCode,
                              dateLabel: primaryAppointment.dateLabel,
                              timeSlot: primaryAppointment.timeSlot,
                            });
                            onShowToast('Google Calendar (.ics) invite downloaded.');
                          }}
                          className="bg-surface-container-low hover:bg-surface-container text-on-surface px-4 py-2.5 rounded-lg text-[14px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px] text-secondary">
                            calendar_add_on
                          </span>
                          <span>Add to Google Calendar</span>
                        </button>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => onOpenRescheduleModal(primaryAppointment)}
                            className="bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface px-3 py-2 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              edit_calendar
                            </span>
                            <span>Reschedule</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onCancelAppointment(primaryAppointment.id)}
                            className="bg-error-container/30 hover:bg-error-container/60 text-error px-3 py-2 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">cancel</span>
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Micro-Timeline strip */}
                    <div className="mt-space-md pt-space-md bg-surface-container-low/40 rounded-lg p-space-sm flex flex-wrap items-center justify-between gap-space-sm">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-[20px]">
                          info
                        </span>
                        <span className="text-[13px] text-on-surface-variant">
                          {primaryAppointment.prepNote ||
                            'Please fast 4 hours prior for blood lipid baseline tests. Bring past ECG graphs.'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onOpenPrepModal(primaryAppointment)}
                        className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Preparation Guidelines</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. APPOINTMENT MANAGEMENT DATA TABLE */}
                {activeSection !== 'history' && (
                  <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                      <div>
                        <h3 className="text-[18px] text-on-surface font-bold">
                          Upcoming &amp; Active Schedules
                        </h3>
                        <p className="text-[13px] text-on-surface-variant">
                          Detailed appointment registry with synchronized hospital dispatch statuses.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-surface-container-low rounded-lg px-3 py-1.5">
                          <span className="material-symbols-outlined text-outline text-[18px] mr-2">
                            search
                          </span>
                          <input
                            type="text"
                            value={tableSearch}
                            onChange={(e) => setTableSearch(e.target.value)}
                            placeholder="Filter booking ID or doctor..."
                            className="bg-transparent text-[13px] text-on-surface placeholder-outline focus:outline-none w-48"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={cycleStatusFilter}
                          title={`Status Filter: ${statusFilter}`}
                          className="px-2.5 py-1.5 bg-surface-container-low hover:bg-surface-container rounded-lg text-on-surface-variant flex items-center gap-1 text-[12px] font-semibold cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">filter_list</span>
                          <span>{statusFilter === 'ALL' ? 'All' : statusFilter}</span>
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto -mx-space-lg px-space-lg">
                      <table className="w-full text-left min-w-[760px]">
                        <thead>
                          <tr className="bg-surface-container-low/60 text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider">
                            <th className="py-3 px-4 rounded-l-lg">Booking ID</th>
                            <th className="py-3 px-4">Doctor &amp; Specialty</th>
                            <th className="py-3 px-4">Hospital / Clinic</th>
                            <th className="py-3 px-4">Date &amp; Time</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right rounded-r-lg">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="text-on-surface text-[13px]">
                          {filteredTableAppointments.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-on-surface-variant">
                                No appointments match the current filter.
                              </td>
                            </tr>
                          ) : (
                            filteredTableAppointments.map((apt) => (
                              <tr
                                key={apt.id}
                                className="hover:bg-surface-container-low/40 transition-colors"
                              >
                                <td className="py-3.5 px-4 text-[12px] text-primary font-bold tabular-nums">
                                  {apt.bookingCode}
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-3">
                                    <ResilientImage
                                      src={apt.doctorImage}
                                      alt={apt.doctorName}
                                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                      fallbackLabel={apt.doctorName}
                                    />
                                    <div>
                                      <div className="text-[14px] font-semibold text-on-surface">
                                        {apt.doctorName}
                                      </div>
                                      <span className="text-[11px] text-on-surface-variant">
                                        {apt.doctorSpecialty}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="text-[13px] text-on-surface">
                                    {apt.hospitalName}
                                  </div>
                                  <span className="text-[11px] text-outline">{apt.hospitalWing}</span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="text-[13px] font-semibold text-on-surface">
                                    {apt.dateLabel}
                                  </div>
                                  <span className="text-[11px] text-on-surface-variant tabular-nums">
                                    {apt.timeSlot} • {apt.durationMinutes} mins
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                      apt.status === 'Confirmed'
                                        ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                                        : apt.status === 'Pending Slot'
                                          ? 'bg-surface-container-highest text-on-surface'
                                          : 'bg-error-container/50 text-error'
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        apt.status === 'Confirmed'
                                          ? 'bg-tertiary'
                                          : apt.status === 'Pending Slot'
                                            ? 'bg-outline'
                                            : 'bg-error'
                                      }`}
                                    />
                                    {apt.status}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <div className="inline-flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => onOpenAppointmentDetails(apt)}
                                      className="p-1.5 hover:bg-surface-container-high rounded text-on-surface-variant hover:text-on-surface cursor-pointer"
                                      title="View Details"
                                    >
                                      <span className="material-symbols-outlined text-[18px]">
                                        visibility
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        downloadDocumentSlip(
                                          `healthcare-slip-${apt.bookingCode.replace('#', '')}.txt`,
                                          `HEALTHCARE APPOINTMENT PASS\nRef: ${apt.bookingCode}\nDoctor: ${apt.doctorName} (${apt.doctorSpecialty})\nHospital: ${apt.hospitalName} — ${apt.hospitalWing}\nSchedule: ${apt.dateLabel} at ${apt.timeSlot}\nMode: ${apt.mode}\nStatus: ${apt.status}`
                                        );
                                        onShowToast(`Slip ${apt.bookingCode} downloaded.`);
                                      }}
                                      className="p-1.5 hover:bg-surface-container-high rounded text-on-surface-variant hover:text-on-surface cursor-pointer"
                                      title="Download Slip"
                                    >
                                      <span className="material-symbols-outlined text-[18px]">
                                        receipt_long
                                      </span>
                                    </button>
                                    {apt.status !== 'Cancelled' && (
                                      <button
                                        type="button"
                                        onClick={() => onCancelAppointment(apt.id)}
                                        className="p-1.5 hover:bg-error-container/40 rounded text-error cursor-pointer"
                                        title="Cancel Appointment"
                                      >
                                        <span className="material-symbols-outlined text-[18px]">
                                          close
                                        </span>
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 5. PAST APPOINTMENT HISTORY & PRESCRIPTION NOTES */}
                <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[24px]">
                          clinical_notes
                        </span>
                      </div>
                      <div>
                        <h3 className="text-[18px] text-on-surface font-bold">
                          Past Consultations &amp; Medical Records
                        </h3>
                        <p className="text-[13px] text-on-surface-variant">
                          Access digital prescriptions, lab orders, and post-visit clinical notes.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-outline">
                        Viewing {activeSection === 'history' || showAllRecords ? records.length : Math.min(2, records.length)} of{' '}
                        {completedCount} records
                      </span>
                      {activeSection !== 'history' && (
                        <button
                          type="button"
                          onClick={() => setShowAllRecords((prev) => !prev)}
                          className="text-[14px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{showAllRecords ? 'Collapse' : 'View All History'}</span>
                          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    {(activeSection === 'history' || showAllRecords ? records : records.slice(0, 2)).map((rec) => (
                      <div
                        key={rec.id}
                        className="bg-surface-container-low/50 rounded-xl p-space-md flex flex-col justify-between gap-space-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between gap-space-sm">
                          <div className="flex items-center gap-3">
                            <ResilientImage
                              src={rec.doctorImage}
                              alt={rec.doctorName}
                              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                              fallbackLabel={rec.doctorName}
                            />
                            <div>
                              <h4 className="text-[14px] font-bold text-on-surface">
                                {rec.doctorName}
                              </h4>
                              <p className="text-[11px] text-on-surface-variant">{rec.service}</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-secondary text-[11px] font-semibold">
                            Completed
                          </span>
                        </div>

                        <div className="bg-surface-container-lowest rounded-lg p-space-sm flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[11px] text-outline">
                            <span>Visit Date: {rec.visitDate}</span>
                            <span>Rx ID: {rec.rxId}</span>
                          </div>
                          <p className="text-[13px] text-on-surface font-medium">
                            {rec.diagnosis}
                          </p>
                          <p className="text-[11px] text-on-surface-variant">{rec.prescription}</p>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              downloadDocumentSlip(
                                `healthcare-summary-${rec.rxId.replace('#', '')}.txt`,
                                `HEALTHCARE CONSULTATION SUMMARY\nRx ID: ${rec.rxId}\nDoctor: ${rec.doctorName}\nService: ${rec.service}\nHospital: ${rec.hospitalName}\nVisit Date: ${rec.visitDate}\n${rec.diagnosis}\n${rec.prescription}`
                              );
                              onShowToast(`Clinical summary ${rec.rxId} downloaded.`);
                            }}
                            className="inline-flex items-center gap-1.5 text-primary hover:text-on-primary-container text-[11px] font-semibold cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">download</span>
                            <span>Download Summary PDF</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onBookFollowUp(rec.doctorId)}
                            className="bg-surface-container-lowest hover:bg-surface-container text-on-surface px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              event_repeat
                            </span>
                            <span>Book Follow-up</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 6. CLINICAL CARE REMINDER FOOTNOTE BANNER */}
            <div className="bg-surface-container-high/40 rounded-xl p-space-md flex flex-col md:flex-row items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[28px]">
                  notifications_paused
                </span>
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-on-surface">
                    Automated Health Reminders Active
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    Healthcare sends SMS and email confirmations 24h and 2h before each appointment
                    time.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenNotificationChannelsModal}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface text-[11px] font-semibold hover:bg-surface-container transition-all cursor-pointer"
                >
                  Manage Notification Channels
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
