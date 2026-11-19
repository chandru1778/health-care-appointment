-- ==============================================================================
-- MediSlot AI Appointment System - Supabase PostgreSQL Schema
-- ==============================================================================
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor > New query).

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Patient / User profile)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT,
    full_name TEXT NOT NULL DEFAULT 'Alex Mercer',
    avatar_url TEXT DEFAULT 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEjGhrvkFcRea3TnLnR-T5jqGB4jsK7VYJHlmtziwextzvnmy6OLQB-vDKys1hBa5RaWuVIZhnGK7ar8OhenzTwALm94aCuM1E4i-7vAf5lBlCgtfGWiseE0ZVMOI8AZxO4FQ8QbIyeqCZbpLuNtEdx5Yx1LJIx0I96F6ssQyMHY9YvQdkPaKASgs2-J2wWnOVMKsaZ43hiGgJ-wplZh-sGvWHL5EaJmrLO8afR9Q',
    phone TEXT DEFAULT '+1 (555) 382-9012',
    insurance_provider TEXT DEFAULT 'BlueCross BlueShield Premier',
    insurance_id TEXT DEFAULT 'BCBS-9912048',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PROVIDERS TABLE
CREATE TABLE IF NOT EXISTS providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    credentials TEXT,
    specialty TEXT NOT NULL,
    category TEXT NOT NULL,
    clinic_name TEXT NOT NULL,
    clinic_address TEXT,
    rating NUMERIC(2,1) DEFAULT 4.8,
    reviews_count INTEGER DEFAULT 0,
    experience_years INTEGER DEFAULT 5,
    languages TEXT[] DEFAULT ARRAY['EN'],
    image_url TEXT,
    in_network BOOLEAN DEFAULT TRUE,
    telehealth_available BOOLEAN DEFAULT FALSE,
    estimated_copay NUMERIC(6,2) DEFAULT 25.00,
    next_opening TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TIME_SLOTS TABLE
CREATE TABLE IF NOT EXISTS time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    slot_time TEXT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_name TEXT NOT NULL DEFAULT 'Alex Mercer',
    patient_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    slot_id UUID REFERENCES time_slots(id) ON DELETE SET NULL,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    clinic_name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    copay NUMERIC(6,2) DEFAULT 25.00,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled', 'rescheduled')),
    pass_code TEXT DEFAULT 'MS-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6)),
    symptoms_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ACTIVITY_LOGS TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT DEFAULT 'sync',
    badge_color TEXT DEFAULT 'primary',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) setup
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read & write access for anon demo key
CREATE POLICY "Public profiles access" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public providers read" ON providers FOR SELECT USING (true);
CREATE POLICY "Public time_slots read" ON time_slots FOR SELECT USING (true);
CREATE POLICY "Public appointments all" ON appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public activity_logs all" ON activity_logs FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Seed default Profile
INSERT INTO profiles (id, email, full_name, phone, insurance_provider, insurance_id)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'alex.mercer@medislot.ai',
    'Alex Mercer',
    '+1 (555) 382-9012',
    'BlueCross BlueShield Premier',
    'BCBS-9912048'
) ON CONFLICT (id) DO NOTHING;

-- Seed Providers
INSERT INTO providers (id, name, credentials, specialty, category, clinic_name, clinic_address, rating, reviews_count, experience_years, languages, image_url, in_network, telehealth_available, estimated_copay, next_opening)
VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Dr. Sarah Jenkins',
    'MD',
    'Cardiology & Internal Medicine',
    'Doctors',
    'CityCare Health Plaza',
    'CityCare Ste 402, 742 Evergreen Terrace',
    4.9,
    142,
    12,
    ARRAY['EN', 'ES'],
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCNUKSoQZkW4qI9vJJ6eEoE0OaHI0WOdTn6LlR6OzJfeFTT6mE-bonF5wYlT2f8f7dhAZwPoRLjsnHv1DOUTX9rglH34qIC4NmvxBqwAIYEl-ZJRDUgoi35rDm5m_qKHms7MEtb98w1ikNsRg7iUIKt_tGu-bUVrFbGOm7iZB6-D-w0qomWveX9Xidp2hcF5eCGwwSoChsHaN6CdeP_VzrRoPJN6CoFY4EmC-X5wgU',
    TRUE,
    FALSE,
    30.00,
    'Tomorrow, 10:30 AM'
),
(
    '22222222-2222-2222-2222-222222222222',
    'Dr. Marcus Vance',
    'DDS',
    'Cosmetic & General Dentistry',
    'Dentists',
    'Downtown Dental Studio',
    'Downtown Dental Studio, 120 Market St #300',
    4.8,
    128,
    9,
    ARRAY['EN'],
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBR4HsY8DwEb4oY5fCVytHCSDW-Prucxi1PrNCIFV_fO-lIep4IUzDI9SJWbB1XmvVOg_UYuanLlIapsZmwt8EIOcSZHNA5ErrRT0lKwzvZTucE4Bi2IOE6h13lM-7C45_CEDoEl6EQKNpEQpMwSWcvJUthP8843MmPG8wulEUdbcVRQIGS3pM78rqB1T3blNSkYfDB7v_jFe1bVASgKz9_9NRzzFDZuXcGiutyF_A',
    TRUE,
    FALSE,
    25.00,
    'Tomorrow, 2:15 PM'
),
(
    '33333333-3333-3333-3333-333333333333',
    'Dr. Priya Patel',
    'PsyD',
    'Clinical Psychologist & Therapy',
    'Consultants',
    'MindWell Health',
    'MindWell Suites, 88 Pine St',
    5.0,
    64,
    8,
    ARRAY['EN', 'HI'],
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAIWdI8FfJjA4_HrXZHXAcxyjQo0uQoCch0P3IqD6Ql4x0O-P3I7Ky4YQNShFaZzkono6WFIeJ7Xk0Q5KHxoao-qssbzVcEWAd87HnSRRn2J3yvjEatFJjzFyFyrptm4zLGwBRNw0_YfPbTi4xKrVNIisOtYKuNEyuyRuwzD5NdfhxRAXE2iGy2tjBUjOXKIkM1ZYh8GDKtjHsoy2GlUMZlPJdBze4r2vdciWZGfeQ',
    TRUE,
    TRUE,
    20.00,
    'Wed, Oct 30, 4:00 PM'
),
(
    '44444444-4444-4444-4444-444444444444',
    'Dr. Elena Rostova',
    'DDS',
    'General Dentistry & Orthodontics',
    'Dentists',
    'BrightSmiles Studio',
    'Metro Plaza Suite 210',
    4.8,
    94,
    11,
    ARRAY['EN', 'RU'],
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAcyNY3rI35dblYWJom-ZH5KtXYD44Q-hnnRsXNX4K-jBhqcHm2Nlx1bohY_A9N1QESUpSelDarqiASF046dxBFxWz9OHeNxLOEjMj1ltCEtZAj1oTc-c9meeb4LMTj89kEYUgM4zPMmFMVEguk20K4-7uEMn6d-RqGyz-o__yetZDamBNyJ9jynRFkSc3MpV4YwX5ZlDNHuU7EqVifqpNTCKE9s_orkLwSKE26y10',
    TRUE,
    FALSE,
    25.00,
    'Tomorrow, 3:30 PM'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Time Slots
INSERT INTO time_slots (provider_id, slot_date, slot_time, is_available)
VALUES
('11111111-1111-1111-1111-111111111111', CURRENT_DATE + 1, '10:30 AM', TRUE),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE + 1, '2:30 PM', FALSE),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE + 2, '11:00 AM', TRUE),
('22222222-2222-2222-2222-222222222222', CURRENT_DATE + 1, '2:15 PM', TRUE),
('22222222-2222-2222-2222-222222222222', CURRENT_DATE + 1, '4:00 PM', TRUE),
('33333333-3333-3333-3333-333333333333', CURRENT_DATE + 2, '4:00 PM', TRUE),
('44444444-4444-4444-4444-444444444444', CURRENT_DATE + 1, '3:30 PM', TRUE);

-- Seed Initial Upcoming Priority Appointment (matches Customer Dashboard)
INSERT INTO appointments (id, patient_name, patient_id, provider_id, appointment_date, appointment_time, clinic_name, specialty, copay, status, pass_code, symptoms_notes)
VALUES
(
    '55555555-5555-5555-5555-555555555555',
    'Alex Mercer',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '11111111-1111-1111-1111-111111111111',
    'Tomorrow (Oct 29)',
    '2:30 PM',
    'CityCare Ste 402',
    'Cardiology & Vascular',
    30.00,
    'confirmed',
    'MS-CARD402',
    'Annual cardiology checkup & stress test'
) ON CONFLICT (id) DO NOTHING;

-- Seed Activity Logs
INSERT INTO activity_logs (title, description, icon, badge_color)
VALUES
('Appointment Rescheduled', 'Dr. Sarah Jenkins moved to Oct 29, 2:30 PM via AI slot-fill.', 'sync', 'primary'),
('Blood Panel Synced', 'Biometrics report ready for review with Primary Care.', 'lab_profile', 'tertiary'),
('Prescription Filled', 'Metro Health Chemist delivered refill order #MS-9912.', 'receipt_long', 'secondary');
