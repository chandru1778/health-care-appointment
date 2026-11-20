export type PageRoute =
  | 'home'
  | 'find-doctors'
  | 'hospitals'
  | 'my-appointments'
  | 'neumorphic-showcase';

export type DashboardSection =
  | 'dashboard'
  | 'my-appointments'
  | 'history'
  | 'family'
  | 'notifications'
  | 'settings';

export interface SpecialtyItem {
  id: string;
  name: string;
  label: string;
  emoji: string;
  doctorCount: number;
  bgClass: string;
}

export interface Hospital {
  id: string;
  name: string;
  area: string;
  distanceKm: number;
  rating: number;
  reviewsCount: number;
  badgeText: string;
  badgeVariant: 'tertiary' | 'primary';
  departments: string[];
  extraDepartmentsCount: number;
  doctorsOnDuty: number;
  erWaitMinutes: number;
  icuBedsAvailable: number;
  image: string;
  imageAlt: string;
  address: string;
  phone: string;
  accreditations: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  subSpecialty: string;
  credentials: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  hospitalId: string;
  hospitalName: string;
  distanceKm: number;
  fee: number;
  nextSlot: string;
  nextSlotUrgency: 'today' | 'tomorrow';
  availableToday: boolean;
  availableWeekend: boolean;
  telehealthReady: boolean;
  capabilities: string[];
  image: string;
  imageAlt: string;
  bio: string;
  languages: string[];
  education: string;
}

export type AppointmentStatus = 'Confirmed' | 'Pending Slot' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  bookingCode: string;
  doctorId: string;
  doctorName: string;
  doctorTitle: string;
  doctorSpecialty: string;
  doctorImage: string;
  hospitalName: string;
  hospitalWing: string;
  dateLabel: string;
  isoDate: string;
  timeSlot: string;
  durationMinutes: number;
  mode: 'In-Clinic Visit' | 'Telehealth Video';
  status: AppointmentStatus;
  patientName: string;
  patientPhone: string;
  reason?: string;
  fee: number;
  prepNote?: string;
}

export interface MedicalRecord {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorImage: string;
  service: string;
  visitDate: string;
  rxId: string;
  diagnosis: string;
  prescription: string;
  hospitalName: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  bloodGroup: string;
  memberId: string;
  primaryPhysician: string;
}

export interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  sms: boolean;
  email: boolean;
  push: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
