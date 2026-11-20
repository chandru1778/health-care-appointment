import { createClient } from '@supabase/supabase-js';
import type {
  Appointment,
  Doctor,
  FamilyMember,
  Hospital,
  MedicalRecord,
  NotificationPreference,
} from '../types/medizap';

// Read environment variables (supports Vite import.meta.env & Node process.env)
const envUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  '';

const envAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  '';

export const isSupabaseConfigured = Boolean(
  envUrl &&
    envAnonKey &&
    !envUrl.includes('your-project') &&
    envAnonKey !== 'your-anon-key-here' &&
    envAnonKey !== 'MY_SUPABASE_ANON_KEY'
);

// Fallback dummy credentials if user hasn't configured .env yet to prevent application crash
const safeUrl = isSupabaseConfigured ? envUrl : 'https://placeholder-project.supabase.co';
const safeAnonKey = isSupabaseConfigured ? envAnonKey : 'placeholder-anon-key';

export const supabase = createClient(safeUrl, safeAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// ============================================================================
// DATA CONVERSION HELPERS (Postgres snake_case <-> TypeScript camelCase)
// ============================================================================

export function mapDoctorFromRow(row: any): Doctor {
  return {
    id: row.id,
    name: row.name,
    specialty: row.specialty,
    subSpecialty: row.sub_specialty || row.specialty,
    credentials: row.credentials || '',
    experienceYears: Number(row.experience_years || 0),
    rating: Number(row.rating || 5.0),
    reviewsCount: Number(row.reviews_count || 0),
    hospitalId: row.hospital_id || '',
    hospitalName: row.hospital_name || '',
    distanceKm: Number(row.distance_km || 0),
    fee: Number(row.fee || 0),
    nextSlot: row.next_slot || 'Today, 03:00 PM',
    nextSlotUrgency: row.next_slot_urgency || 'today',
    availableToday: Boolean(row.available_today),
    availableWeekend: Boolean(row.available_weekend),
    telehealthReady: Boolean(row.telehealth_ready),
    capabilities: Array.isArray(row.capabilities) ? row.capabilities : [],
    image: row.image || '',
    imageAlt: row.image_alt || row.name,
    bio: row.bio || '',
    languages: Array.isArray(row.languages) ? row.languages : ['English'],
    education: row.education || '',
  };
}

export function mapHospitalFromRow(row: any): Hospital {
  return {
    id: row.id,
    name: row.name,
    area: row.area,
    distanceKm: Number(row.distance_km || 0),
    rating: Number(row.rating || 5.0),
    reviewsCount: Number(row.reviews_count || 0),
    badgeText: row.badge_text || '',
    badgeVariant: row.badge_variant || 'tertiary',
    departments: Array.isArray(row.departments) ? row.departments : [],
    extraDepartmentsCount: Number(row.extra_departments_count || 0),
    doctorsOnDuty: Number(row.doctors_on_duty || 0),
    erWaitMinutes: Number(row.er_wait_minutes || 0),
    icuBedsAvailable: Number(row.icu_beds_available || 0),
    image: row.image || '',
    imageAlt: row.image_alt || row.name,
    address: row.address || '',
    phone: row.phone || '',
    accreditations: Array.isArray(row.accreditations) ? row.accreditations : [],
  };
}

export function mapAppointmentFromRow(row: any): Appointment {
  return {
    id: row.id,
    bookingCode: row.booking_code,
    doctorId: row.doctor_id,
    doctorName: row.doctor_name,
    doctorTitle: row.doctor_title || '',
    doctorSpecialty: row.doctor_specialty,
    doctorImage: row.doctor_image || '',
    hospitalName: row.hospital_name,
    hospitalWing: row.hospital_wing || 'Outpatient Wing',
    dateLabel: row.date_label,
    isoDate: row.iso_date || new Date().toISOString().split('T')[0],
    timeSlot: row.time_slot,
    durationMinutes: Number(row.duration_minutes || 30),
    mode: row.mode || 'In-Clinic Visit',
    status: row.status || 'Confirmed',
    patientName: row.patient_name,
    patientPhone: row.patient_phone,
    reason: row.reason || '',
    fee: Number(row.fee || 0),
    prepNote: row.prep_note || '',
  };
}

export function mapAppointmentToRow(apt: Appointment, userId?: string | null) {
  return {
    id: apt.id,
    booking_code: apt.bookingCode,
    user_id: userId || null,
    doctor_id: apt.doctorId,
    doctor_name: apt.doctorName,
    doctor_title: apt.doctorTitle,
    doctor_specialty: apt.doctorSpecialty,
    doctor_image: apt.doctorImage,
    hospital_name: apt.hospitalName,
    hospital_wing: apt.hospitalWing,
    date_label: apt.dateLabel,
    iso_date: apt.isoDate || new Date().toISOString().split('T')[0],
    time_slot: apt.timeSlot,
    duration_minutes: apt.durationMinutes,
    mode: apt.mode,
    status: apt.status,
    patient_name: apt.patientName,
    patient_phone: apt.patientPhone,
    reason: apt.reason || '',
    fee: apt.fee,
    prep_note: apt.prepNote || '',
  };
}

export function mapFamilyMemberFromRow(row: any): FamilyMember {
  return {
    id: row.id,
    name: row.name,
    relation: row.relation,
    age: Number(row.age || 0),
    bloodGroup: row.blood_group || 'O+',
    memberId: row.member_id,
    primaryPhysician: row.primary_physician || 'Primary Care Team',
  };
}

export function mapFamilyMemberToRow(m: FamilyMember, userId?: string | null) {
  return {
    id: m.id,
    user_id: userId || null,
    name: m.name,
    relation: m.relation,
    age: m.age,
    blood_group: m.bloodGroup,
    member_id: m.memberId,
    primary_physician: m.primaryPhysician,
  };
}

export function mapMedicalRecordFromRow(row: any): MedicalRecord {
  return {
    id: row.id,
    doctorId: row.doctor_id || '',
    doctorName: row.doctor_name,
    doctorImage: row.doctor_image || '',
    service: row.service,
    visitDate: row.visit_date,
    rxId: row.rx_id,
    diagnosis: row.diagnosis,
    prescription: row.prescription,
    hospitalName: row.hospital_name,
  };
}

// ============================================================================
// SUPABASE CLIENT API METHODS
// ============================================================================

export const supabaseApi = {
  // 1. Doctors
  async fetchDoctors(): Promise<Doctor[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('rating', { ascending: false });
      if (error || !data || data.length === 0) return null;
      return data.map(mapDoctorFromRow);
    } catch {
      return null;
    }
  },

  // 2. Hospitals
  async fetchHospitals(): Promise<Hospital[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .order('distance_km', { ascending: true });
      if (error || !data || data.length === 0) return null;
      return data.map(mapHospitalFromRow);
    } catch {
      return null;
    }
  },

  // 3. Appointments
  async fetchAppointments(userId?: string | null): Promise<Appointment[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      let query = supabase.from('appointments').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }
      const { data, error } = await query;
      if (error || !data) return null;
      return data.map(mapAppointmentFromRow);
    } catch {
      return null;
    }
  },

  async insertAppointment(apt: Appointment, userId?: string | null): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const payload = mapAppointmentToRow(apt, userId);
      const { error } = await supabase.from('appointments').upsert(payload);
      return !error;
    } catch {
      return false;
    }
  },

  async updateAppointment(
    id: string,
    updates: Partial<{
      status: string;
      date_label: string;
      time_slot: string;
      iso_date: string;
    }>
  ): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('appointments').update(updates).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // 4. Family Members
  async fetchFamilyMembers(userId?: string | null): Promise<FamilyMember[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      let query = supabase.from('family_members').select('*');
      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }
      const { data, error } = await query;
      if (error || !data || data.length === 0) return null;
      return data.map(mapFamilyMemberFromRow);
    } catch {
      return null;
    }
  },

  async insertFamilyMember(member: FamilyMember, userId?: string | null): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const payload = mapFamilyMemberToRow(member, userId);
      const { error } = await supabase.from('family_members').upsert(payload);
      return !error;
    } catch {
      return false;
    }
  },

  // 5. Medical Records
  async fetchMedicalRecords(userId?: string | null): Promise<MedicalRecord[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      let query = supabase.from('medical_records').select('*');
      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }
      const { data, error } = await query;
      if (error || !data || data.length === 0) return null;
      return data.map(mapMedicalRecordFromRow);
    } catch {
      return null;
    }
  },

  // 6. Notification Preferences
  async fetchNotificationPreferences(
    userId?: string | null
  ): Promise<NotificationPreference[] | null> {
    if (!isSupabaseConfigured || !userId) return null;
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId);
      if (error || !data || data.length === 0) return null;
      return data.map((d: any) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        sms: d.sms,
        email: d.email,
        push: d.push,
      }));
    } catch {
      return null;
    }
  },

  async updateNotificationPreference(
    id: string,
    channel: 'sms' | 'email' | 'push',
    value: boolean,
    userId?: string | null
  ): Promise<boolean> {
    if (!isSupabaseConfigured || !userId) return false;
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .update({ [channel]: value })
        .match({ id, user_id: userId });
      return !error;
    } catch {
      return false;
    }
  },

  // 7. Profiles
  async fetchProfile(userId: string): Promise<{ name: string; email: string; phone: string } | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, email, phone')
        .eq('id', userId)
        .single();
      if (error || !data) return null;
      return {
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
      };
    } catch {
      return null;
    }
  },

  async updateProfile(
    userId: string,
    profile: { name?: string; email?: string; phone?: string }
  ): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: userId, ...profile, updated_at: new Date().toISOString() });
      return !error;
    } catch {
      return false;
    }
  },
};
