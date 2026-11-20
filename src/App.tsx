/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AiAssistantWidget } from './components/AiAssistantWidget';
import { FindDoctorsPage } from './components/FindDoctorsPage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { HospitalsPage } from './components/HospitalsPage';
import {
  AppointmentInfoModal,
  AuthModal,
  BookingModal,
  DoctorProfileModal,
  HospitalDetailsModal,
  NotificationChannelsModal,
  RescheduleModal,
  TeleconsultModal,
} from './components/Modals';
import { MyAppointmentsPage } from './components/MyAppointmentsPage';
import { NeumorphicShowcase } from './components/neumorphic/NeumorphicShowcase';
import {
  DOCTORS,
  HOSPITALS,
  INITIAL_APPOINTMENTS,
  INITIAL_FAMILY_MEMBERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_RECORDS,
  LOCATIONS,
} from './data/medizapData';
import { isSupabaseConfigured, supabase, supabaseApi } from './lib/supabase';
import type {
  Appointment,
  Doctor,
  FamilyMember,
  Hospital,
  MedicalRecord,
  NotificationPreference,
  PageRoute,
} from './types/medizap';

const STORAGE_KEYS = {
  appointments: 'healthcare_appointments_v1',
  family: 'healthcare_family_v1',
  notifications: 'healthcare_notifications_v1',
  profile: 'healthcare_profile_v1',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedLocation, setSelectedLocation] = useState<string>(LOCATIONS[0]);
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Cross-page doctor directory filters
  const [doctorSearchQuery, setDoctorSearchQuery] = useState<string>('');
  const [doctorSpecialtyFilter, setDoctorSpecialtyFilter] = useState<string>('All');
  const [doctorHospitalFilter, setDoctorHospitalFilter] = useState<string>('all');

  // Supabase live / cached catalog
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(DOCTORS);
  const [, setHospitalsList] = useState<Hospital[]>(HOSPITALS);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(isSupabaseConfigured);

  // Persisted clinical portal state
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    loadFromStorage<Appointment[]>(STORAGE_KEYS.appointments, INITIAL_APPOINTMENTS)
  );
  const [records, setRecords] = useState<MedicalRecord[]>(INITIAL_RECORDS);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() =>
    loadFromStorage<FamilyMember[]>(STORAGE_KEYS.family, INITIAL_FAMILY_MEMBERS)
  );
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreference[]>(() =>
    loadFromStorage<NotificationPreference[]>(STORAGE_KEYS.notifications, INITIAL_NOTIFICATIONS)
  );

  const initialProfile = loadFromStorage<{
    name: string;
    email: string;
    phone: string;
    isSignedIn: boolean;
  }>(STORAGE_KEYS.profile, {
    name: 'Alex Morgan',
    email: 'alex.m@healthmail.com',
    phone: '+1 (555) 438-9921',
    isSignedIn: true,
  });

  const [userName, setUserName] = useState<string>(initialProfile.name);
  const [userEmail, setUserEmail] = useState<string>(initialProfile.email);
  const [userPhone, setUserPhone] = useState<string>(initialProfile.phone);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(initialProfile.isSignedIn);

  // Sync to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(appointments));
    } catch {
      // Ignore storage quota errors
    }
  }, [appointments]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.family, JSON.stringify(familyMembers));
    } catch {
      // Ignore storage quota errors
    }
  }, [familyMembers]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notificationPrefs));
    } catch {
      // Ignore storage quota errors
    }
  }, [notificationPrefs]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.profile,
        JSON.stringify({ name: userName, email: userEmail, phone: userPhone, isSignedIn })
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [userName, userEmail, userPhone, isSignedIn]);

  // Load user data from Supabase
  const loadUserData = async (uid: string) => {
    try {
      const [userApts, userFam, userNotifs, userRecs] = await Promise.all([
        supabaseApi.fetchAppointments(uid),
        supabaseApi.fetchFamilyMembers(uid),
        supabaseApi.fetchNotificationPreferences(uid),
        supabaseApi.fetchMedicalRecords(uid),
      ]);
      if (userApts && userApts.length > 0) setAppointments(userApts);
      if (userFam && userFam.length > 0) setFamilyMembers(userFam);
      if (userNotifs && userNotifs.length > 0) setNotificationPrefs(userNotifs);
      if (userRecs && userRecs.length > 0) setRecords(userRecs);
      setIsDbConnected(true);
    } catch {
      // Keep local state on fetch failures
    }
  };

  // Setup Supabase live catalog and Auth listener
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // 1. Fetch live Doctors and Hospitals from Supabase
    supabaseApi.fetchDoctors().then((docs) => {
      if (docs && docs.length > 0) {
        setDoctorsList(docs);
        setIsDbConnected(true);
      }
    });

    supabaseApi.fetchHospitals().then((hosps) => {
      if (hosps && hosps.length > 0) {
        setHospitalsList(hosps);
        setIsDbConnected(true);
      }
    });

    // 2. Check active Supabase Auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        setIsSignedIn(true);
        if (session.user.email) setUserEmail(session.user.email);
        supabaseApi.fetchProfile(session.user.id).then((prof) => {
          if (prof?.name) setUserName(prof.name);
          if (prof?.phone) setUserPhone(prof.phone);
        });
        void loadUserData(session.user.id);
      } else {
        // Load initial appointments
        supabaseApi.fetchAppointments().then((apts) => {
          if (apts && apts.length > 0) {
            setAppointments(apts);
            setIsDbConnected(true);
          }
        });
      }
    });

    // 3. Listen for auth changes (login, signup, signout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setIsSignedIn(true);
        if (session.user.email) setUserEmail(session.user.email);
        const prof = await supabaseApi.fetchProfile(session.user.id);
        if (prof?.name) setUserName(prof.name);
        if (prof?.phone) setUserPhone(prof.phone);
        void loadUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUserId(null);
        setIsSignedIn(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Modal & widget states
  const [bookingTarget, setBookingTarget] = useState<{
    name: string;
    subtitle: string;
    feeText: string;
    doctor?: Doctor;
    hospital?: Hospital;
  } | null>(null);
  const [profileDoctor, setProfileDoctor] = useState<Doctor | null>(null);
  const [detailsHospital, setDetailsHospital] = useState<Hospital | null>(null);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
  const [teleconsultState, setTeleconsultState] = useState<{
    isOpen: boolean;
    appointment?: Appointment | null;
  }>({ isOpen: false, appointment: null });
  const [infoAppointmentModal, setInfoAppointmentModal] = useState<{
    appointment: Appointment | null;
    mode: 'details' | 'prep';
  }>({ appointment: null, mode: 'details' });
  const [notifChannelsOpen, setNotifChannelsOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | null>(null);

  // AI Assistant state
  const [aiDrawerOpen, setAiDrawerOpen] = useState<boolean>(false);
  const [aiPendingQuery, setAiPendingQuery] = useState<string>('');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGlobalSearchSubmit = () => {
    setDoctorSearchQuery(globalSearch.trim());
    setDoctorSpecialtyFilter('All');
    setDoctorHospitalFilter('all');
    navigateTo('find-doctors');
  };

  const handleOpenAiAssistant = (initialQuery?: string) => {
    if (initialQuery && initialQuery.trim()) {
      setAiPendingQuery(initialQuery.trim());
    }
    setAiDrawerOpen(true);
  };

  const createAppointment = (payload: {
    doctor: Doctor;
    dateLabel: string;
    timeSlot: string;
    mode: 'In-Clinic Visit' | 'Telehealth Video';
    patientName: string;
    patientPhone: string;
    reason: string;
  }): Appointment => {
    const codeNumber = Math.floor(9300 + Math.random() * 699);
    const todayIso = new Date().toISOString().split('T')[0];
    const created: Appointment = {
      id: `apt-${Date.now()}`,
      bookingCode: `#HC-${codeNumber}`,
      doctorId: payload.doctor.id,
      doctorName: payload.doctor.name,
      doctorTitle: payload.doctor.credentials,
      doctorSpecialty: payload.doctor.specialty,
      doctorImage: payload.doctor.image,
      hospitalName: payload.doctor.hospitalName,
      hospitalWing:
        payload.mode === 'Telehealth Video' ? 'Virtual HD Consult Suite' : 'Outpatient Wing A-2',
      dateLabel: payload.dateLabel,
      isoDate: todayIso,
      timeSlot: payload.timeSlot,
      durationMinutes: 30,
      mode: payload.mode,
      status: 'Confirmed',
      patientName: payload.patientName,
      patientPhone: payload.patientPhone,
      reason: payload.reason,
      fee: payload.doctor.fee,
      prepNote:
        payload.mode === 'Telehealth Video'
          ? 'Join the Healthcare video room 5 minutes prior with camera and microphone enabled.'
          : 'Arrive 10 minutes before your slot with a valid photo ID and prior lab records.',
    };

    setAppointments((prev) => [created, ...prev]);

    // Save to Supabase
    if (isSupabaseConfigured) {
      void supabaseApi.insertAppointment(created, userId);
    }

    // Backup to local server
    void fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created),
    }).catch(() => {});

    return created;
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status: 'Cancelled' } : a))
    );

    // Update in Supabase
    if (isSupabaseConfigured) {
      void supabaseApi.updateAppointment(appointmentId, { status: 'Cancelled' });
    }

    void fetch(`/api/appointments/${appointmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Cancelled' }),
    }).catch(() => {});

    showToast('Appointment cancelled with zero cancellation fees.');
  };

  const handleConfirmReschedule = (
    appointmentId: string,
    newDateLabel: string,
    newTimeSlot: string
  ) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId
          ? { ...a, dateLabel: newDateLabel, timeSlot: newTimeSlot, status: 'Confirmed' }
          : a
      )
    );

    // Update in Supabase
    if (isSupabaseConfigured) {
      void supabaseApi.updateAppointment(appointmentId, {
        date_label: newDateLabel,
        time_slot: newTimeSlot,
        status: 'Confirmed',
      });
    }

    void fetch(`/api/appointments/${appointmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dateLabel: newDateLabel,
        timeSlot: newTimeSlot,
        status: 'Confirmed',
      }),
    }).catch(() => {});

    setRescheduleAppointment(null);
    showToast(`Visit rescheduled to ${newDateLabel} at ${newTimeSlot}.`);
  };

  const handleAddFamilyMember = (member: Omit<FamilyMember, 'id' | 'memberId'>) => {
    const created: FamilyMember = {
      ...member,
      id: `fam-${Date.now()}`,
      memberId: `#HC-${Math.floor(88225 + Math.random() * 700)}`,
    };

    setFamilyMembers((prev) => [...prev, created]);

    // Save to Supabase
    if (isSupabaseConfigured) {
      void supabaseApi.insertFamilyMember(created, userId);
    }

    void fetch('/api/family', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created),
    }).catch(() => {});

    showToast(`${created.name} added to your Family Care Profiles.`);
  };

  const handleToggleNotificationPref = (id: string, channel: 'sms' | 'email' | 'push') => {
    const current = notificationPrefs.find((p) => p.id === id);
    const nextVal = current ? !current[channel] : true;

    setNotificationPrefs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [channel]: !p[channel] } : p))
    );

    if (isSupabaseConfigured && userId) {
      void supabaseApi.updateNotificationPreference(id, channel, nextVal, userId);
    }

    void fetch(`/api/notifications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel }),
    }).catch(() => {});
  };

  const handleUpdateUserProfile = (name: string, email: string, phone: string) => {
    const nextName = name.trim() || 'Alex Morgan';
    const nextEmail = email.trim() || 'alex.m@healthmail.com';
    const nextPhone = phone.trim() || '+1 (555) 438-9921';
    setUserName(nextName);
    setUserEmail(nextEmail);
    setUserPhone(nextPhone);

    if (isSupabaseConfigured && userId) {
      void supabaseApi.updateProfile(userId, { name: nextName, phone: nextPhone });
    }

    void fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nextName, email: nextEmail, phone: nextPhone }),
    }).catch(() => {});

    showToast('Patient profile settings saved.');
  };

  const handleAuthSuccess = (name: string, email: string, uid?: string) => {
    setUserName(name);
    setUserEmail(email);
    setIsSignedIn(true);
    if (uid) {
      setUserId(uid);
      void loadUserData(uid);
    }
    setAuthModalMode(null);
    showToast(`Welcome, ${name}! Logged in successfully.`);
  };

  const handleSignOut = () => {
    if (isSupabaseConfigured) {
      void supabase.auth.signOut();
    }
    setUserId(null);
    setIsSignedIn(false);
    showToast('Signed out of Healthcare Patient Portal.');
  };

  const handleBookFollowUp = (doctorId: string) => {
    const doc = doctorsList.find((d) => d.id === doctorId) || doctorsList[0];
    setBookingTarget({
      name: doc.name,
      subtitle: `${doc.specialty} (${doc.hospitalName})`,
      feeText: `$${doc.fee}`,
      doctor: doc,
    });
  };

  const upcomingCount = appointments.filter(
    (a) => a.status === 'Confirmed' || a.status === 'Pending Slot'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      {currentPage === 'neumorphic-showcase' ? (
        <NeumorphicShowcase onBackToApp={() => navigateTo('home')} />
      ) : (
        <>
          <Header
        currentPage={currentPage}
        onNavigate={navigateTo}
        selectedLocation={selectedLocation}
        onSelectLocation={(loc) => {
          setSelectedLocation(loc);
          showToast(`Care region updated to ${loc}.`);
        }}
        globalSearch={globalSearch}
        onGlobalSearchChange={setGlobalSearch}
        onGlobalSearchSubmit={handleGlobalSearchSubmit}
        onOpenAiAssistant={handleOpenAiAssistant}
        onOpenAuthModal={(mode) => setAuthModalMode(mode)}
        userName={userName}
        isSignedIn={isSignedIn}
        onSignOut={handleSignOut}
        upcomingCount={upcomingCount}
        isSupabaseConnected={isDbConnected}
      />

      <main className="flex-1 pt-[70px]">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onSearchDoctors={(query, hospitalId) => {
              setDoctorSearchQuery(query);
              setDoctorHospitalFilter(hospitalId);
              setDoctorSpecialtyFilter('All');
              navigateTo('find-doctors');
            }}
            onSelectSpecialty={(specialtyName) => {
              setDoctorSpecialtyFilter(specialtyName);
              setDoctorSearchQuery('');
              setDoctorHospitalFilter('all');
              navigateTo('find-doctors');
            }}
            onOpenAiAssistant={handleOpenAiAssistant}
            onOpenBookingModal={(target) => setBookingTarget(target)}
            onOpenDoctorProfile={(doc) => setProfileDoctor(doc)}
            onOpenHospitalDetails={(hospital) => setDetailsHospital(hospital)}
          />
        )}

        {currentPage === 'find-doctors' && (
          <FindDoctorsPage
            doctors={doctorsList}
            initialQuery={doctorSearchQuery}
            initialSpecialty={doctorSpecialtyFilter}
            initialHospitalId={doctorHospitalFilter}
            bookedSlots={appointments
              .filter((a) => a.status !== 'Cancelled')
              .map((a) => ({
                doctorId: a.doctorId,
                dateLabel: a.dateLabel,
                timeSlot: a.timeSlot,
              }))}
            onBookAppointment={createAppointment}
            onOpenDoctorProfile={(doc) => setProfileDoctor(doc)}
            onNavigate={navigateTo}
            onShowToast={showToast}
            defaultPatientName={userName}
            defaultPatientPhone={userPhone}
            defaultPatientEmail={userEmail}
          />
        )}

        {currentPage === 'hospitals' && (
          <HospitalsPage
            onOpenBookingModal={(target) => setBookingTarget(target)}
            onOpenHospitalDetails={(hospital) => setDetailsHospital(hospital)}
            onViewDoctorsAtHospital={(hospitalId) => {
              setDoctorHospitalFilter(hospitalId);
              setDoctorSpecialtyFilter('All');
              setDoctorSearchQuery('');
              navigateTo('find-doctors');
            }}
          />
        )}

        {currentPage === 'my-appointments' && (
          <MyAppointmentsPage
            appointments={appointments}
            records={records}
            familyMembers={familyMembers}
            notificationPrefs={notificationPrefs}
            userName={userName}
            userEmail={userEmail}
            userPhone={userPhone}
            onUpdateUserProfile={handleUpdateUserProfile}
            onAddFamilyMember={handleAddFamilyMember}
            onToggleNotificationPref={handleToggleNotificationPref}
            onNavigate={navigateTo}
            onCancelAppointment={handleCancelAppointment}
            onOpenRescheduleModal={(apt) => setRescheduleAppointment(apt)}
            onOpenTeleconsultModal={(apt) =>
              setTeleconsultState({ isOpen: true, appointment: apt || null })
            }
            onOpenPrepModal={(apt) =>
              setInfoAppointmentModal({ appointment: apt, mode: 'prep' })
            }
            onOpenAppointmentDetails={(apt) =>
              setInfoAppointmentModal({ appointment: apt, mode: 'details' })
            }
            onOpenNotificationChannelsModal={() => setNotifChannelsOpen(true)}
            onBookFollowUp={handleBookFollowUp}
            onSignOut={handleSignOut}
            onShowToast={showToast}
          />
        )}
      </main>

      <Footer
        onNavigate={navigateTo}
        onOpenAiAssistant={handleOpenAiAssistant}
        onShowToast={showToast}
      />
    </>
  )}

      {/* Persistent AI Clinical Triage Assistant */}
      <AiAssistantWidget
        isOpen={aiDrawerOpen}
        onToggle={() => setAiDrawerOpen((prev) => !prev)}
        pendingQuery={aiPendingQuery}
        onClearPendingQuery={() => setAiPendingQuery('')}
        onBookDoctor={(doc) => {
          setAiDrawerOpen(false);
          setBookingTarget({
            name: doc.name,
            subtitle: `${doc.specialty} (${doc.hospitalName})`,
            feeText: `$${doc.fee}`,
            doctor: doc,
          });
        }}
      />

      {/* Interactive Modals */}
      <BookingModal
        key={bookingTarget ? bookingTarget.name : 'booking-closed'}
        target={bookingTarget}
        defaultPatientName={userName}
        defaultPatientPhone={userPhone}
        onClose={() => setBookingTarget(null)}
        onConfirm={(payload) => {
          const created = createAppointment(payload);
          setBookingTarget(null);
          showToast(
            `Confirmed ${created.bookingCode} with ${created.doctorName} (${created.dateLabel} at ${created.timeSlot}).`
          );
        }}
      />

      <DoctorProfileModal
        doctor={profileDoctor}
        onClose={() => setProfileDoctor(null)}
        onBook={(doc) => {
          setProfileDoctor(null);
          setBookingTarget({
            name: doc.name,
            subtitle: `${doc.specialty} (${doc.hospitalName})`,
            feeText: `$${doc.fee}`,
            doctor: doc,
          });
        }}
      />

      <HospitalDetailsModal
        hospital={detailsHospital}
        onClose={() => setDetailsHospital(null)}
        onBookSlot={(hospital) => {
          setDetailsHospital(null);
          setBookingTarget({
            name: hospital.name,
            subtitle: 'Hospital Care Facility',
            feeText: '$0 Dispatch',
            hospital,
          });
        }}
      />

      <RescheduleModal
        key={rescheduleAppointment ? rescheduleAppointment.id : 'resched-closed'}
        appointment={rescheduleAppointment}
        onClose={() => setRescheduleAppointment(null)}
        onConfirmReschedule={handleConfirmReschedule}
      />

      <TeleconsultModal
        isOpen={teleconsultState.isOpen}
        appointment={teleconsultState.appointment}
        onClose={() => setTeleconsultState({ isOpen: false, appointment: null })}
      />

      <AppointmentInfoModal
        appointment={infoAppointmentModal.appointment}
        mode={infoAppointmentModal.mode}
        onClose={() => setInfoAppointmentModal({ appointment: null, mode: 'details' })}
      />

      <NotificationChannelsModal
        isOpen={notifChannelsOpen}
        prefs={notificationPrefs}
        onToggle={handleToggleNotificationPref}
        onClose={() => {
          setNotifChannelsOpen(false);
          showToast('Notification channels updated.');
        }}
      />

      <AuthModal
        key={authModalMode || 'auth-closed'}
        mode={authModalMode}
        onClose={() => setAuthModalMode(null)}
        onAuthenticate={handleAuthSuccess}
      />

      {/* Non-blocking Toast Banner */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 left-6 z-50 max-w-md bg-on-surface text-surface-container-lowest px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in"
        >
          <span className="material-symbols-outlined text-primary-fixed text-[20px]">
            check_circle
          </span>
          <span className="text-[13px] font-medium leading-snug">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-surface-variant hover:text-surface-container-lowest ml-1 cursor-pointer"
            aria-label="Dismiss notification"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
