-- ==============================================================================
-- MediZap Production Supabase PostgreSQL Schema
-- Healthcare Made Simple: Doctors, Hospitals, Appointments & Patient Portal
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLE DEFINITIONS
-- ==============================================================================

-- 2.1 Patient & User Profiles (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  role TEXT DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 Medical Specialties
CREATE TABLE IF NOT EXISTS public.specialties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  emoji TEXT NOT NULL,
  doctor_count INTEGER DEFAULT 0,
  bg_class TEXT DEFAULT 'bg-blue-100',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 Hospitals & Emergency Centers
CREATE TABLE IF NOT EXISTS public.hospitals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  area TEXT NOT NULL,
  distance_km NUMERIC(4,1) DEFAULT 0.0,
  rating NUMERIC(3,2) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  badge_text TEXT DEFAULT '',
  badge_variant TEXT DEFAULT 'tertiary' CHECK (badge_variant IN ('primary', 'tertiary')),
  departments TEXT[] DEFAULT '{}',
  extra_departments_count INTEGER DEFAULT 0,
  doctors_on_duty INTEGER DEFAULT 0,
  er_wait_minutes INTEGER DEFAULT 0,
  icu_beds_available INTEGER DEFAULT 0,
  image TEXT NOT NULL,
  image_alt TEXT DEFAULT '',
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  accreditations TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.4 Verified Specialist Doctors
CREATE TABLE IF NOT EXISTS public.doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  sub_specialty TEXT DEFAULT '',
  credentials TEXT DEFAULT '',
  experience_years INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  hospital_id TEXT REFERENCES public.hospitals(id) ON DELETE SET NULL,
  hospital_name TEXT NOT NULL,
  distance_km NUMERIC(4,1) DEFAULT 0.0,
  fee NUMERIC(8,2) DEFAULT 0.00,
  next_slot TEXT DEFAULT '',
  next_slot_urgency TEXT DEFAULT 'today' CHECK (next_slot_urgency IN ('today', 'tomorrow')),
  available_today BOOLEAN DEFAULT TRUE,
  available_weekend BOOLEAN DEFAULT FALSE,
  telehealth_ready BOOLEAN DEFAULT TRUE,
  capabilities TEXT[] DEFAULT '{}',
  image TEXT NOT NULL,
  image_alt TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  languages TEXT[] DEFAULT '{}',
  education TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.5 Clinical Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  booking_code TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  doctor_id TEXT REFERENCES public.doctors(id) ON DELETE SET NULL,
  doctor_name TEXT NOT NULL,
  doctor_title TEXT DEFAULT '',
  doctor_specialty TEXT NOT NULL,
  doctor_image TEXT DEFAULT '',
  hospital_name TEXT NOT NULL,
  hospital_wing TEXT DEFAULT 'Outpatient Wing A-2',
  date_label TEXT NOT NULL,
  iso_date DATE DEFAULT CURRENT_DATE,
  time_slot TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  mode TEXT DEFAULT 'In-Clinic Visit' CHECK (mode IN ('In-Clinic Visit', 'Telehealth Video')),
  status TEXT DEFAULT 'Confirmed' CHECK (status IN ('Confirmed', 'Pending Slot', 'Completed', 'Cancelled')),
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_email TEXT DEFAULT '',
  reason TEXT DEFAULT '',
  fee NUMERIC(8,2) DEFAULT 0.00,
  prep_note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.6 Medical Records & Prescriptions
CREATE TABLE IF NOT EXISTS public.medical_records (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id TEXT REFERENCES public.doctors(id) ON DELETE SET NULL,
  doctor_name TEXT NOT NULL,
  doctor_image TEXT DEFAULT '',
  service TEXT NOT NULL,
  visit_date TEXT NOT NULL,
  rx_id TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  prescription TEXT NOT NULL,
  hospital_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.7 Family Member Profiles
CREATE TABLE IF NOT EXISTS public.family_members (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relation TEXT NOT NULL,
  age INTEGER DEFAULT 0,
  blood_group TEXT DEFAULT 'O+',
  member_id TEXT NOT NULL,
  primary_physician TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.8 Notification Preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  sms BOOLEAN DEFAULT TRUE,
  email BOOLEAN DEFAULT TRUE,
  push BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, id)
);

-- ==============================================================================
-- 3. INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON public.doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_hospital_id ON public.doctors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_doctors_rating ON public.doctors(rating DESC);
CREATE INDEX IF NOT EXISTS idx_doctors_fee ON public.doctors(fee ASC);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_booking_code ON public.appointments(booking_code);
CREATE INDEX IF NOT EXISTS idx_medical_records_user_id ON public.medical_records(user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON public.family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user ON public.notification_preferences(user_id);

-- ==============================================================================
-- 4. DATABASE TRIGGERS & AUTOMATION
-- ==============================================================================

-- Auto-update updated_at timestamp function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on public.profiles
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger on public.appointments
DROP TRIGGER IF EXISTS set_appointments_updated_at ON public.appointments;
CREATE TRIGGER set_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Automatic profile creation upon user signup with Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO NOTHING;

  -- Default notification preferences for new patient
  INSERT INTO public.notification_preferences (id, user_id, title, description, sms, email, push)
  VALUES
    ('notif-reminders', NEW.id, 'Appointment Reminders (24h & 2h before)', 'Automated dispatch confirmations prior to clinic or video consultations.', true, true, true),
    ('notif-rx', NEW.id, 'Digital Prescriptions & Lab Results', 'Instant alerts when your doctor uploads clinical summaries or lab reports.', false, true, true),
    ('notif-slots', NEW.id, 'Waitlist & Earlier Slot Openings', 'Get notified if an earlier slot becomes available with your selected specialist.', true, false, true)
  ON CONFLICT (user_id, id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger when a new user registers in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- 5.1 Specialties (Public Read)
DROP POLICY IF EXISTS "Public can view specialties" ON public.specialties;
CREATE POLICY "Public can view specialties"
  ON public.specialties FOR SELECT
  USING (true);

-- 5.2 Hospitals (Public Read)
DROP POLICY IF EXISTS "Public can view hospitals" ON public.hospitals;
CREATE POLICY "Public can view hospitals"
  ON public.hospitals FOR SELECT
  USING (true);

-- 5.3 Doctors (Public Read)
DROP POLICY IF EXISTS "Public can view doctors" ON public.doctors;
CREATE POLICY "Public can view doctors"
  ON public.doctors FOR SELECT
  USING (true);

-- 5.4 User Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 5.5 Appointments
-- Authenticated users view their own; anon can view by session/guest
DROP POLICY IF EXISTS "Users can view own or guest appointments" ON public.appointments;
CREATE POLICY "Users can view own or guest appointments"
  ON public.appointments FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL OR auth.role() = 'anon');

-- Anyone (registered user or guest patient) can book an appointment
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;
CREATE POLICY "Anyone can create appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (true);

-- Users can reschedule or cancel their appointments
DROP POLICY IF EXISTS "Users can update own appointments" ON public.appointments;
CREATE POLICY "Users can update own appointments"
  ON public.appointments FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL OR auth.role() = 'anon');

-- 5.6 Medical Records
DROP POLICY IF EXISTS "Users can view own medical records" ON public.medical_records;
CREATE POLICY "Users can view own medical records"
  ON public.medical_records FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Users can insert medical records" ON public.medical_records;
CREATE POLICY "Users can insert medical records"
  ON public.medical_records FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL OR auth.role() = 'anon');

-- 5.7 Family Members
DROP POLICY IF EXISTS "Users can manage own family members" ON public.family_members;
CREATE POLICY "Users can manage own family members"
  ON public.family_members FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL OR auth.role() = 'anon');

-- 5.8 Notification Preferences
DROP POLICY IF EXISTS "Users can manage notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can manage notification preferences"
  ON public.notification_preferences FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL OR auth.role() = 'anon');

-- ==============================================================================
-- 6. SEED DATA (DOCTORS, HOSPITALS, SPECIALTIES & CATALOG)
-- ==============================================================================

-- 6.1 Specialties Seed
INSERT INTO public.specialties (id, name, label, emoji, doctor_count, bg_class)
VALUES
  ('cardiology', 'Cardiology', 'Cardiology', '🫀', 142, 'bg-blue-100'),
  ('neurology', 'Neurology', 'Neurology', '🧠', 88, 'bg-purple-100'),
  ('orthopedics', 'Orthopedics', 'Orthopedics', '🦴', 114, 'bg-orange-100'),
  ('general', 'General Physician', 'General Phys.', '🩺', 320, 'bg-green-100'),
  ('dentistry', 'Dentistry', 'Dentistry', '🦷', 96, 'bg-cyan-100'),
  ('ophthalmology', 'Ophthalmology', 'Ophthalmology', '👁️', 75, 'bg-yellow-100'),
  ('dermatology', 'Dermatology', 'Dermatology', '🧴', 105, 'bg-pink-100'),
  ('pediatrics', 'Pediatrics', 'Pediatrics', '👶', 160, 'bg-rose-100'),
  ('pulmonology', 'Pulmonology', 'Pulmonology', '🫁', 64, 'bg-teal-100'),
  ('oncology', 'Oncology', 'Oncology', '🧬', 52, 'bg-indigo-100')
ON CONFLICT (id) DO NOTHING;

-- 6.2 Hospitals Seed
INSERT INTO public.hospitals (
  id, name, area, distance_km, rating, reviews_count, badge_text, badge_variant,
  departments, extra_departments_count, doctors_on_duty, er_wait_minutes,
  icu_beds_available, image, image_alt, address, phone, accreditations
)
VALUES
  (
    'apollo',
    'Apollo Care Hospital',
    'Downtown Metro',
    2.4,
    4.8,
    420,
    'Emergency 24/7',
    'tertiary',
    ARRAY['Cardiology', 'Neurology', 'Cardiac Cath Lab', 'Telehealth ICU', 'Diagnostic Imaging', 'Trauma ER', 'Pulmonology', 'Endocrinology'],
    6,
    32,
    9,
    14,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCtuIere7LX-TWCoVI8bZdWuJXMNX_3gYT6ALTZLnye5r5fZES7lXdFhuT-NdGIdTpxy7e-ZnGhaOiaPWj5zTFljeyOopl4yhX9nTDwxEUDC9A3jcSHlwilZif0mZJcdtXqgjloDGA708dswNWoNsUkqriCmjQEhqCengGbMSjsJc_CH48E56kOziTgnFjCKZfpzKvO38FW84_jmTYaAL8_91rAqinuLjfndAXRD9s',
    'Modern architectural glass facade of Apollo Care hospital',
    '420 Lexington Medical Plaza, Downtown Metro',
    '+1 (555) 230-8800',
    ARRAY['JCI Accredited', 'Level 1 Cardiac Center', '24/7 Trauma Care']
  ),
  (
    'city',
    'City Health Multispeciality',
    'North Avenue',
    3.8,
    4.7,
    310,
    'NABH Accredited',
    'primary',
    ARRAY['Dermatology', 'Pediatrics', 'General Physician', 'Allergy & Immunology', 'Maternity', 'Pathology Lab'],
    4,
    28,
    14,
    9,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDkZC4JW2NkG_tJdll460f_Rk1nw9Y5D7o0AiWv2bM5qZQ4T4-554ylvKDfax-dBVpCvrE7MWJ7HCgiKIme0GVN93F1TJ1AM8umi02aV3eIeoLRDF8dkzKMdeRqUXVN0Yt5VTD8DjYRixHKS1P9erfmxom2EHSBPiO3XTZRHc7RtPRaHGgyue6VoTRzgBwIvTAWBtdxmRQiYGmwSCNgsfSJDeFZexydy1nDesg--VY',
    'Exterior entrance of City Health Multispeciality center',
    '890 North Avenue Clinical Corridor',
    '+1 (555) 391-4420',
    ARRAY['NABH Certified', 'Pediatric Safe Zone', 'Digital EMR Integrated']
  ),
  (
    'greenlife',
    'GreenLife Medical Center',
    'Green Valley',
    4.1,
    4.6,
    180,
    'Top Rated Ortho',
    'tertiary',
    ARRAY['Orthopedics', 'Radiology', 'Sports Rehabilitation', 'Joint Replacement', 'Physiotherapy', 'Neurology', 'Spine Care'],
    5,
    19,
    11,
    7,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ6m3L0QYkH4eK3o78LwM7uP0_dK_2sF9x0_dK_2sF9x0_dK_2sF9x0_dK_2sF9x0_dK_2sF9x0_dK_2sF9x0_dK_2sF9x0_dK_2sF9x',
    'GreenLife Medical Center garden pavilion and clinical entrance',
    '104 Green Valley Boulevard',
    '+1 (555) 881-3004',
    ARRAY['ISO 9001 Certified', 'Sports Injury Excellence', 'Full-Body MRI']
  ),
  (
    'saintluke',
    'Saint Luke Medical Plaza',
    'Saint Luke Westside',
    5.8,
    4.8,
    390,
    'Emergency & ICU',
    'primary',
    ARRAY['Neurology', 'Oncology', 'Emergency 24/7', 'Intensive Care Unit', 'Cardiology', 'Hematology'],
    8,
    35,
    7,
    18,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDkZC4JW2NkG_tJdll460f_Rk1nw9Y5D7o0AiWv2bM5qZQ4T4-554ylvKDfax-dBVpCvrE7MWJ7HCgiKIme0GVN93F1TJ1AM8umi02aV3eIeoLRDF8dkzKMdeRqUXVN0Yt5VTD8DjYRixHKS1P9erfmxom2EHSBPiO3XTZRHc7RtPRaHGgyue6VoTRzgBwIvTAWBtdxmRQiYGmwSCNgsfSJDeFZexydy1nDesg--VY',
    'Modern glass entrance of Saint Luke Medical Plaza',
    '330 Westside Avenue Parkway',
    '+1 (555) 774-2910',
    ARRAY['Level 1 Trauma Hub', 'Neuroscience Center of Excellence']
  )
ON CONFLICT (id) DO NOTHING;

-- 6.3 Verified Specialists Seed
INSERT INTO public.doctors (
  id, name, specialty, sub_specialty, credentials, experience_years, rating,
  reviews_count, hospital_id, hospital_name, distance_km, fee, next_slot,
  next_slot_urgency, available_today, available_weekend, telehealth_ready,
  capabilities, image, image_alt, bio, languages, education
)
VALUES
  (
    'dr-michael-oconnell',
    'Dr. Michael E. O''Connell',
    'Cardiology',
    'Cardiology',
    'MD, DM Cardiology, FACC • Fellow of Cardiology',
    16,
    4.9,
    340,
    'apollo',
    'Apollo Care Heart Institute',
    2.5,
    60.00,
    'Today, 03:00 PM',
    'today',
    true,
    true,
    true,
    ARRAY['Telehealth Available', 'In-house ECG'],
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAWyIlaQhoQSWsVo3FDblzdd5cfXm35Fabgi8bKyJ3uQsfxXwGt-9BriHHee4njBKoXlFg_NPL68UR_1yVLheRFUKNb7HmvwzMpm8fbU4qk4Uu_ZRNOQ5WO4uzIZD3i-CpEJ5zruop2A3c5NXydbobhv-AiDQuuJ2K2wLG65dJg5M0qk1M-ihIpl5NY1-T3p76-5mrLgUr_1PZtx3_hFmXOFvVoPXIGBXqKJa6PxuM',
    'Portrait of Dr. Michael E. O''Connell',
    'Senior clinical cardiologist specializing in preventive lipid management, non-invasive echocardiography, and arrhythmia triage.',
    ARRAY['English', 'Spanish'],
    'Johns Hopkins School of Medicine'
  ),
  (
    'dr-arjun-kumar',
    'Dr. Arjun Kumar',
    'Cardiology',
    'Interventional Cardiology',
    'MD, DM, FSCAI • Angioplasty Specialist',
    20,
    4.9,
    420,
    'apollo',
    'Apollo Care Hospital',
    2.4,
    60.00,
    'Today, 04:30 PM',
    'today',
    true,
    false,
    true,
    ARRAY['Cath Lab Certified', 'Telehealth Available'],
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAgV4W71AdzEZBnUCyXKzCiZpat-Qpz7EdsdhsMDNCwaKa_s2rl2j-xWKFqd5gWzkkBUw73RpK5kOE9SOyqb_eocKFJDCs3zYerlZ7QzI1xOt9OdEFi1r46ouaedBnq4Q-hX3uLm1EhdPNEIEmG43J1lXTIYCMHRSCqa7VcpR44bGdPm6LOXn8gKlV3HaWRwq5hSgsRK2uL6joTR4JD7s8raolsYf4f4QyYFgX4h6E',
    'Portrait of Dr. Arjun Kumar, cardiologist',
    'Chief Cardiologist & Interventional Cardiology Fellow leading the Heart Wellness Pavilion at Apollo Care Hospital.',
    ARRAY['English', 'Hindi'],
    'All India Institute of Medical Sciences & Cleveland Clinic'
  ),
  (
    'dr-priya-sharma',
    'Dr. Priya Sharma',
    'Dermatology',
    'Clinical & Cosmetic Dermatology',
    'MD, FAAD • Skin & Allergy Specialist',
    8,
    4.8,
    280,
    'city',
    'City Health Multispeciality',
    3.8,
    50.00,
    'Tomorrow, 10:00 AM',
    'tomorrow',
    false,
    true,
    true,
    ARRAY['Telehealth Available', 'Patch Testing'],
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB2oLoBaTAaRGDSwoKOoCRzpMX1-kK62jUQi1XgJecSJir7g1aGHx-YbI_8DxRXvjDm6NLBVTbBE-E0aCGf6GLFAgx9ixZBZmTJBA5fHVCxb6wv5IYT5dz3gcNwknw0VjFWRe-gYONGjqm7Yk3bk_8HfgOkbluSgtMM0f3BgIRHlwN9hbyNE5UUeq4PiGtYDOQghnP3BNh2bBLzT6weNlRa-3J0-8JJqxWspGV-nJc',
    'Portrait of Dr. Priya Sharma, dermatologist',
    'Board-certified dermatologist focused on eczema, autoimmune skin conditions, acne protocols, and dermoscopic screenings.',
    ARRAY['English', 'Hindi'],
    'Stanford University School of Medicine'
  ),
  (
    'dr-rahul-menon',
    'Dr. Rahul Menon',
    'Orthopedics',
    'Orthopedic Specialist',
    'MS Ortho, FACS • Joint & Sports Trauma',
    15,
    4.9,
    315,
    'greenlife',
    'GreenLife Medical Center',
    4.1,
    75.00,
    'Today, 02:00 PM',
    'today',
    true,
    true,
    false,
    ARRAY['Digital X-Ray Suite', 'Sports Rehab'],
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCDW3-jvQPrFyd4tUVz40QXo7yU589Q5ld9XlDqzgfDlwQrFEKS1DK1jT4nVpJha849gV6FfJq5PRQRvNcn-kMw2KoyJyfQyGmFMtEq_gj0dWzFk-Pe-yq-Y9EzLxKfgb-dit4vv8Pb7iPF9AyrYdMSG06NubQUqtQsP8HlNfRX1ZXTYgbtJr5vi_8oaxGVfKO3_xTdszS1Rco4nlPV-PMR3pXYmjJfV98wq-Et8eY',
    'Portrait of Dr. Rahul Menon, orthopedic specialist',
    'Senior orthopedic surgeon specializing in minimally invasive knee arthroscopy, rotator cuff repair, and sports trauma recovery.',
    ARRAY['English', 'Malayalam'],
    'Harvard Medical School Orthopedic Residency'
  ),
  (
    'dr-elena-rostova',
    'Dr. Elena Rostova',
    'Neurology',
    'Neurology & Pediatric Care',
    'MD, PhD, FACC • Clinical Neurology Triage',
    14,
    4.8,
    215,
    'saintluke',
    'Saint Luke Neurological Center',
    5.8,
    65.00,
    'Today, 05:15 PM',
    'today',
    true,
    true,
    true,
    ARRAY['Video & Clinic', 'EEG Lab'],
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD958vvVO78TOup0XgT7nxRKB-29IgveKuWnVtfuPoPiANrSj_E1xP7RMJr_V3JmKArjp6bE1F_Qtruke13SlJ4JQnSrI4X5SzD6idD6kYQzg4vOclaDEZqXIfr5GP_LhgOnxxMTYmDCB-oTDmcngguvHsbz75jg6tyIWtIcE7bjyoUTDWqNHP42fypBO7tlzio6dcfbR-2t0NLR1QZIjo0-PB4neCAIYazc0Hh0CQ',
    'Portrait of Dr. Elena Rostova, neurologist',
    'Specialist in migraine pathways, outpatient neurological triage, and pediatric autonomic disorders.',
    ARRAY['English', 'Russian'],
    'Columbia University Vagelos College'
  ),
  (
    'dr-sarah-jenkins',
    'Dr. Sarah Jenkins',
    'Dermatology',
    'Dermatology & Allergy',
    'MD, DABD • Clinical Allergist',
    11,
    4.8,
    264,
    'city',
    'Metro Health Medical Center',
    3.2,
    55.00,
    'Tomorrow, 02:15 PM',
    'tomorrow',
    false,
    true,
    true,
    ARRAY['Telehealth Available', 'Allergy Panel'],
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDeSi8AAjXVdxQoSSPd_6EpndqIU-gqvDKeA2SI05x9vjvkWxC38ZvbuFb8wyU7fnkKpQdi-YpRQYVYNrVBmx-pCWeEfZTFkb6vQOL2bBdd5Ti9fwMDXq2ZgsyfBSxo6tY92Ge-I48xTrXuvNAhgm0qIEQP8DaG97a7Kj_EYVB_ZWWCyloeDDgWOXWcafxVPa4wzkDNRg01qeWA8x9UmjJ8uzR_JKJ2ipPryYL0JUI',
    'Portrait of Dr. Sarah Jenkins',
    'Specializes in seasonal atopic dermatitis, urticaria, and chronic environmental allergy desensitization.',
    ARRAY['English'],
    'Yale School of Medicine'
  ),
  (
    'dr-marcus-vance',
    'Dr. Marcus Vance',
    'Orthopedics',
    'Orthopedics & Sports Injury',
    'MD, FAAOS • Sports Medicine Director',
    18,
    4.7,
    195,
    'greenlife',
    'GreenLife Medical Center',
    4.1,
    70.00,
    'Tomorrow, 11:00 AM',
    'tomorrow',
    false,
    false,
    true,
    ARRAY['Physiotherapy Plan', 'Video Follow-up'],
    'https://lh3.googleusercontent.com/aida-public/AB6AXuChnbHoTrLJlFwPLpjT7Xvry43M_PsGsU9fSFkkxe4Qdq-bepTiqH5s-RS3m4lYwt67tZMhsPmpsynh9lFlYgRWoRBVo2B8gW6Ot8p5LEyjAJzI3mH3R9bUzYRi-3JpmJbiovly4PgLWDU566DA3RkL9Sf3bNwNzE65-KdYE0QsGd58O1ARoX3gENDOvOmlx9Sj0IoMzUjDnhRKG0eSeIXNLWkbHoYT_Zi79eYq0SQ',
    'Portrait of Dr. Marcus Vance',
    'Focuses on tendon rehabilitation, patellar biomechanics, and non-surgical musculoskeletal recovery.',
    ARRAY['English', 'French'],
    'UCSF School of Medicine'
  ),
  (
    'dr-ananya-desai',
    'Dr. Ananya Desai',
    'General Physician',
    'Internal Medicine & Primary Care',
    'MD, FACP • Family & Preventive Medicine',
    12,
    4.9,
    390,
    'city',
    'City Health Multispeciality',
    3.8,
    45.00,
    'Today, 04:00 PM',
    'today',
    true,
    true,
    true,
    ARRAY['Telehealth Available', 'Same-Day Labs'],
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAjjB2krLeoGaHH4jYquHJZOyx7tTBgvg0pKFGsdgWt6rP92JvTD6BVADpDnScQGVsahHupcOjw0btCMO9JAHS_b68i7bn9fzlTQKVr12m2-vjnqnX4N8pf9rMHcRMh_UzAAD7_OGJfAWt41oOnrUew3NZ1kp2sXlx9fbidUWeIvBM0Dug--JIrR_LVWajpJ0RnlIj5v-IrWgJjLP4D48NnxGbT7JtKxv4JmDQmvjw',
    'Portrait of Dr. Ananya Desai, General Physician',
    'Comprehensive primary care physician focusing on metabolic screenings, hypertension care, and acute respiratory triage.',
    ARRAY['English', 'Hindi', 'Gujarati'],
    'NYU Grossman School of Medicine'
  ),
  (
    'dr-claire-bennett',
    'Dr. Claire Bennett',
    'Pediatrics',
    'Pediatrics & Adolescent Care',
    'MD, FAAP • Board Certified Pediatrician',
    13,
    4.9,
    312,
    'city',
    'City Health Multispeciality',
    3.8,
    55.00,
    'Today, 05:30 PM',
    'today',
    true,
    true,
    true,
    ARRAY['Telehealth Available', 'Pediatric Safe Zone'],
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD1ItRRjHsAw9Pklse24Derx7NEahh7ozkxbo1zNqGlJPfAOBv34mbDhaYHBzB2a7cabf0GXPvCBRFAmTfne169jY4Q32HCZ-P1bqtdlhJHePHojt8luTRzOK2iEtkUUIkLsW0Clzj6pwcCMlnD4gwhFD18BauzzxOH_YLZWnmFzgOZMoCtOAIckjACWVGIVmZ8_9SCo0N4uQFqLywm3BQf6AvYhxvcDI4grThv7Wk',
    'Portrait of Dr. Claire Bennett, Pediatrician',
    'Dedicated pediatrician specializing in childhood immunizations, developmental milestones, and same-day pediatric fever consults.',
    ARRAY['English'],
    'Boston Children’s Hospital / Harvard Medical School'
  ),
  (
    'dr-daniel-park',
    'Dr. Daniel Park',
    'Dentistry',
    'Restorative & Cosmetic Dentistry',
    'DDS, FAGD • Digital Implantology',
    10,
    4.8,
    228,
    'apollo',
    'Apollo Care Hospital',
    2.4,
    50.00,
    'Tomorrow, 09:30 AM',
    'tomorrow',
    false,
    true,
    true,
    ARRAY['3D CBCT Scan', 'Pain-Free Care'],
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBdwF49ANVk4jKO2C-hpow0tJaVX2RJ280jgo0EbMMeM_KmG9HuLO4aSf7Wxts1AxWg14bXiW0ue5loZSdHh_H-L7zAWyT1y4gITnP_bjm_B84azt-CbUAju1kW-4Ce4zJ868f6RLsmfQQncc2OnTaKtpj5Dw0LXfNkhngOWhKISWAQGTpeltT6gpSwl-sDfCpxc6tC2sWvH5t3nh1QuJxXa2mr5jfx3zKKLVtkZlI',
    'Portrait of Dr. Daniel Park, Dentist',
    'Specialist in minimally invasive restorative dentistry, emergency toothache relief, and digital smile alignment.',
    ARRAY['English', 'Korean'],
    'University of Pennsylvania School of Dental Medicine'
  ),
  (
    'dr-meera-iyer',
    'Dr. Meera Iyer',
    'Ophthalmology',
    'Retina & LASIK Specialist',
    'MD, FRCS • Ophthalmic Microsurgeon',
    14,
    4.9,
    274,
    'apollo',
    'Apollo Care Hospital',
    2.4,
    65.00,
    'Today, 06:00 PM',
    'today',
    true,
    false,
    true,
    ARRAY['OCT Retinal Scan', 'Telehealth Available'],
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB2oLoBaTAaRGDSwoKOoCRzpMX1-kK62jUQi1XgJecSJir7g1aGHx-YbI_8DxRXvjDm6NLBVTbBE-E0aCGf6GLFAgx9ixZBZmTJBA5fHVCxb6wv5IYT5dz3gcNwknw0VjFWRe-gYONGjqm7Yk3bk_8HfgOkbluSgtMM0f3BgIRHlwN9hbyNE5UUeq4PiGtYDOQghnP3BNh2bBLzT6weNlRa-3J0-8JJqxWspGV-nJc',
    'Portrait of Dr. Meera Iyer, Ophthalmologist',
    'Ophthalmologist focused on glaucoma screening, diabetic eye evaluations, and refractive laser vision consultations.',
    ARRAY['English', 'Tamil'],
    'Wilmer Eye Institute, Johns Hopkins'
  ),
  (
    'dr-lucas-fernandez',
    'Dr. Lucas Fernandez',
    'Pulmonology',
    'Respiratory & Sleep Medicine',
    'MD, FCCP • Pulmonary Critical Care',
    15,
    4.8,
    189,
    'apollo',
    'Apollo Care Hospital',
    2.4,
    70.00,
    'Tomorrow, 11:30 AM',
    'tomorrow',
    false,
    true,
    true,
    ARRAY['Spirometry Lab', 'Telehealth Available'],
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBXjWZpFrWpxXqPvz6MY42YqIg7bItp5STwcgdbnZeAdOp8GhMwwcGScI2t9zI6zRa-n1vptWxajLrnu-yo09S5WmTITm0kaDBtZxNofJuSBljY7ogtkHxOh1-eUPA5l9wyldoZetaepFlWiDDWw_4FNxaE7Slr2CO25FCw5sUUL28eCqf-SRNuZSTYoKjfrIFpwMFik9PRBWF8uhxCwKkw-R62c6PM1gei-e7S2tI',
    'Portrait of Dr. Lucas Fernandez, Pulmonologist',
    'Leads asthma, COPD, chronic cough, and sleep apnea diagnostics with integrated home sleep monitoring.',
    ARRAY['English', 'Spanish'],
    'Mayo Clinic Alix School of Medicine'
  ),
  (
    'dr-hannah-lin',
    'Dr. Hannah Lin',
    'Oncology',
    'Medical Oncology & Precision Care',
    'MD, PhD • Hematology & Oncology',
    17,
    4.9,
    245,
    'greenlife',
    'GreenLife Medical Center',
    4.1,
    90.00,
    'Tomorrow, 02:00 PM',
    'tomorrow',
    false,
    false,
    true,
    ARRAY['Tumor Board Review', 'Video & Clinic'],
    'https://lh3.googleusercontent.com/aida-public/AB6AXuARes7672y8pghQTH_xi2lI-xGvOfpXXHQ6k9h6RXylu1KDi18ZmTq0seXmdtu1YyQtr7e-sEI-o8FBI-y7l6aouMQ2_O17GiyT_3V06ldzZm-VTQTsob6-88owfICe7oPybPNY_XS8rkVJFBcHmRL7gcM_jxg8-BKrvV8nluRwa9thuULjwZYi2HmFERudjBxjDksFRYQlZIWzxm5Uo3BnBTRPL8RP2P6cYbFclb0',
    'Portrait of Dr. Hannah Lin, Oncologist',
    'Precision oncology specialist providing second-opinion genomic reviews, biomarker counseling, and coordinated care pathways.',
    ARRAY['English', 'Mandarin'],
    'Memorial Sloan Kettering / Weill Cornell'
  )
ON CONFLICT (id) DO NOTHING;

-- 6.4 Sample Initial Appointments
INSERT INTO public.appointments (
  id, booking_code, user_id, doctor_id, doctor_name, doctor_title,
  doctor_specialty, doctor_image, hospital_name, hospital_wing,
  date_label, iso_date, time_slot, duration_minutes, mode, status,
  patient_name, patient_phone, patient_email, reason, fee, prep_note
)
VALUES
  (
    'apt-9204',
    '#MZ-9204',
    NULL,
    'dr-arjun-kumar',
    'Dr. Arjun Kumar',
    'Chief Cardiologist • Interventional Cardiology Fellow',
    'Cardiology',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAgV4W71AdzEZBnUCyXKzCiZpat-Qpz7EdsdhsMDNCwaKa_s2rl2j-xWKFqd5gWzkkBUw73RpK5kOE9SOyqb_eocKFJDCs3zYerlZ7QzI1xOt9OdEFi1r46ouaedBnq4Q-hX3uLm1EhdPNEIEmG43J1lXTIYCMHRSCqa7VcpR44bGdPm6LOXn8gKlV3HaWRwq5hSgsRK2uL6joTR4JD7s8raolsYf4f4QyYFgX4h6E',
    'Apollo Care Hospital',
    'Heart Wellness Pavilion, Wing B-3',
    'Tomorrow, Oct 24',
    CURRENT_DATE + INTERVAL '1 day',
    '09:30 AM',
    45,
    'Telehealth Video',
    'Confirmed',
    'Alex Morgan',
    '+1 (555) 438-9921',
    'alex.m@healthmail.com',
    'Annual cardiac wellness & blood lipid review',
    60.00,
    'Please fast 4 hours prior for blood lipid baseline tests. Bring past ECG graphs.'
  ),
  (
    'apt-8831',
    '#MZ-8831',
    NULL,
    'dr-sarah-jenkins',
    'Dr. Sarah Jenkins',
    'Clinical Dermatologist & Allergist',
    'Dermatology & Allergy',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDeSi8AAjXVdxQoSSPd_6EpndqIU-gqvDKeA2SI05x9vjvkWxC38ZvbuFb8wyU7fnkKpQdi-YpRQYVYNrVBmx-pCWeEfZTFkb6vQOL2bBdd5Ti9fwMDXq2ZgsyfBSxo6tY92Ge-I48xTrXuvNAhgm0qIEQP8DaG97a7Kj_EYVB_ZWWCyloeDDgWOXWcafxVPa4wzkDNRg01qeWA8x9UmjJ8uzR_JKJ2ipPryYL0JUI',
    'Metro Health Medical Center',
    'Derma Suite #408',
    'Oct 28, 2026',
    CURRENT_DATE + INTERVAL '5 days',
    '02:15 PM',
    30,
    'In-Clinic Visit',
    'Confirmed',
    'Alex Morgan',
    '+1 (555) 438-9921',
    'alex.m@healthmail.com',
    '6-week dermatology follow-up & patch check',
    55.00,
    'Avoid applying topical creams 12 hours prior to skin exam.'
  ),
  (
    'apt-8740',
    '#MZ-8740',
    NULL,
    'dr-elena-rostova',
    'Dr. Elena Rostova',
    'Senior Clinical Neurologist',
    'Neurology Triage',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDjPx6lqvMcjhXmwD26viusjVVBwYLLYPSIjN4UqKyfErs0om2r7PCzOy-oknvQ62GqBfHKEjXa7OaAVC8sji621VXnpF4SiGpkL9OZb4M4yC6FxuWCHuvNTAuayxASgiUk-qFZUjbYZW5lOrq6bWwSrO_HELLN2NPaU96LuKAiv1_1mpma5Uh53haAZHMybUJi8W5n1ApQE5WMwB-o6bDfjeoiny8bSa7NBioGUQw',
    'Saint Luke Neurological Center',
    'Outpatient Tower Room 12',
    'Nov 04, 2026',
    CURRENT_DATE + INTERVAL '12 days',
    '11:00 AM',
    60,
    'In-Clinic Visit',
    'Pending Slot',
    'Alex Morgan',
    '+1 (555) 438-9921',
    'alex.m@healthmail.com',
    'Migraine frequency evaluation',
    65.00,
    'Bring headache log from the last 14 days.'
  )
ON CONFLICT (id) DO NOTHING;

-- 6.5 Sample Initial Medical Records
INSERT INTO public.medical_records (
  id, user_id, doctor_id, doctor_name, doctor_image, service, visit_date,
  rx_id, diagnosis, prescription, hospital_name
)
VALUES
  (
    'rec-44910',
    NULL,
    'dr-sarah-jenkins',
    'Dr. Sarah Jenkins',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAjjB2krLeoGaHH4jYquHJZOyx7tTBgvg0pKFGsdgWt6rP92JvTD6BVADpDnScQGVsahHupcOjw0btCMO9JAHS_b68i7bn9fzlTQKVr12m2-vjnqnX4N8pf9rMHcRMh_UzAAD7_OGJfAWt41oOnrUew3NZ1kp2sXlx9fbidUWeIvBM0Dug--JIrR_LVWajpJ0RnlIj5v-IrWgJjLP4D48NnxGbT7JtKxv4JmDQmvjw',
    'Dermatology Routine Screening',
    'Sep 14, 2025',
    '#RX-44910',
    'Dx: Mild Seasonal Atopic Dermatitis',
    'Prescribed: Hydrocortisone Topical 1%, Cetirizine 10mg daily. Follow-up suggested in 6 weeks.',
    'Metro Health Medical Center'
  ),
  (
    'rec-39201',
    NULL,
    'dr-marcus-vance',
    'Dr. Marcus Vance',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuChnbHoTrLJlFwPLpjT7Xvry43M_PsGsU9fSFkkxe4Qdq-bepTiqH5s-RS3m4lYwt67tZMhsPmpsynh9lFlYgRWoRBVo2B8gW6Ot8p5LEyjAJzI3mH3R9bUzYRi-3JpmJbiovly4PgLWDU566DA3RkL9Sf3bNwNzE65-KdYE0QsGd58O1ARoX3gENDOvOmlx9Sj0IoMzUjDnhRKG0eSeIXNLWkbHoYT_Zi79eYq0SQ',
    'Orthopedics & Sports Injury',
    'Aug 02, 2025',
    '#RX-39201',
    'Dx: Right Patellar Tendon Strain',
    'Prescribed: Physiotherapy regimen 2x weekly, NSAID gel PRN. Cleared for light jogging.',
    'GreenLife Medical Center'
  )
ON CONFLICT (id) DO NOTHING;

-- 6.6 Sample Initial Family Members
INSERT INTO public.family_members (id, user_id, name, relation, age, blood_group, member_id, primary_physician)
VALUES
  ('fam-1', NULL, 'Alex Morgan', 'Self (Primary)', 34, 'O+', '#MZ-88219', 'Dr. Arjun Kumar'),
  ('fam-2', NULL, 'Maya Morgan', 'Spouse', 32, 'A+', '#MZ-88220', 'Dr. Priya Sharma'),
  ('fam-3', NULL, 'Leo Morgan', 'Son', 7, 'O+', '#MZ-88221', 'Dr. Elena Rostova')
ON CONFLICT (id) DO NOTHING;
