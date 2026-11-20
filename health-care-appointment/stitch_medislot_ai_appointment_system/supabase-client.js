/**
 * MediSlot AI - Supabase Integration Client Layer
 * Handles live Supabase connections with automatic local demo fallback.
 */

(function (window) {
  'use strict';

  // Default seed providers matching screenshots and HTML
  const DEFAULT_PROVIDERS = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Dr. Sarah Jenkins',
      credentials: 'MD',
      specialty: 'Cardiology & Internal Medicine',
      category: 'Doctors',
      clinic_name: 'CityCare Health Plaza',
      clinic_address: 'CityCare Ste 402, 742 Evergreen Terrace',
      rating: 4.9,
      reviews_count: 142,
      experience_years: 12,
      languages: ['EN', 'ES'],
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNUKSoQZkW4qI9vJJ6eEoE0OaHI0WOdTn6LlR6OzJfeFTT6mE-bonF5wYlT2f8f7dhAZwPoRLjsnHv1DOUTX9rglH34qIC4NmvxBqwAIYEl-ZJRDUgoi35rDm5m_qKHms7MEtb98w1ikNsRg7iUIKt_tGu-bUVrFbGOm7iZB6-D-w0qomWveX9Xidp2hcF5eCGwwSoChsHaN6CdeP_VzrRoPJN6CoFY4EmC-X5wgU',
      in_network: true,
      telehealth_available: false,
      estimated_copay: 30.00,
      next_opening: 'Tomorrow, 10:30 AM',
      available_slots: ['Tomorrow, 10:30 AM', 'Tomorrow, 2:30 PM', 'Wednesday, 11:00 AM']
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Dr. Marcus Vance',
      credentials: 'DDS',
      specialty: 'Cosmetic & General Dentistry',
      category: 'Dentists',
      clinic_name: 'Downtown Dental Studio',
      clinic_address: 'Downtown Dental Studio, 120 Market St #300',
      rating: 4.8,
      reviews_count: 128,
      experience_years: 9,
      languages: ['EN'],
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR4HsY8DwEb4oY5fCVytHCSDW-Prucxi1PrNCIFV_fO-lIep4IUzDI9SJWbB1XmvVOg_UYuanLlIapsZmwt8EIOcSZHNA5ErrRT0lKwzvZTucE4Bi2IOE6h13lM-7C45_CEDoEl6EQKNpEQpMwSWcvJUthP8843MmPG8wulEUdbcVRQIGS3pM78rqB1T3blNSkYfDB7v_jFe1bVASgKz9_9NRzzFDZuXcGiutyF_A',
      in_network: true,
      telehealth_available: false,
      estimated_copay: 25.00,
      next_opening: 'Tomorrow, 2:15 PM',
      available_slots: ['Tomorrow, 2:15 PM', 'Tomorrow, 4:00 PM', 'Thursday, 9:30 AM']
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Dr. Priya Patel',
      credentials: 'PsyD',
      specialty: 'Clinical Psychologist & Therapy',
      category: 'Consultants',
      clinic_name: 'MindWell Health',
      clinic_address: 'MindWell Suites, 88 Pine St',
      rating: 5.0,
      reviews_count: 64,
      experience_years: 8,
      languages: ['EN', 'HI'],
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIWdI8FfJjA4_HrXZHXAcxyjQo0uQoCch0P3IqD6Ql4x0O-P3I7Ky4YQNShFaZzkono6WFIeJ7Xk0Q5KHxoao-qssbzVcEWAd87HnSRRn2J3yvjEatFJjzFyFyrptm4zLGwBRNw0_YfPbTi4xKrVNIisOtYKuNEyuyRuwzD5NdfhxRAXE2iGy2tjBUjOXKIkM1ZYh8GDKtjHsoy2GlUMZlPJdBze4r2vdciWZGfeQ',
      in_network: true,
      telehealth_available: true,
      estimated_copay: 20.00,
      next_opening: 'Wed, Oct 30, 4:00 PM',
      available_slots: ['Wed, Oct 30, 4:00 PM', 'Friday, 1:15 PM', 'Monday, 10:00 AM']
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'Dr. Elena Rostova',
      credentials: 'DDS',
      specialty: 'General Dentistry & Orthodontics',
      category: 'Dentists',
      clinic_name: 'BrightSmiles Studio',
      clinic_address: 'Metro Plaza Suite 210',
      rating: 4.8,
      reviews_count: 94,
      experience_years: 11,
      languages: ['EN', 'RU'],
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcyNY3rI35dblYWJom-ZH5KtXYD44Q-hnnRsXNX4K-jBhqcHm2Nlx1bohY_A9N1QESUpSelDarqiASF046dxBFxWz9OHeNxLOEjMj1ltCEtZAj1oTc-c9meeb4LMTj89kEYUgM4zPMmFMVEguk20K4-7uEMn6d-RqGyz-o__yetZDamBNyJ9jynRFkSc3MpV4YwX5ZlDNHuU7EqVifqpNTCKE9s_orkLwSKE26y10',
      in_network: true,
      telehealth_available: false,
      estimated_copay: 25.00,
      next_opening: 'Tomorrow, 3:30 PM',
      available_slots: ['Tomorrow, 3:30 PM', 'Friday, 11:30 AM']
    }
  ];

  const DEFAULT_APPOINTMENTS = [
    {
      id: '55555555-5555-5555-5555-555555555555',
      patient_name: 'Alex Mercer',
      provider_name: 'Dr. Sarah Jenkins',
      provider_id: '11111111-1111-1111-1111-111111111111',
      specialty: 'Cardiology & Vascular',
      clinic_name: 'CityCare Ste 402',
      clinic_address: 'CityCare Ste 402, 742 Evergreen Terrace',
      appointment_date: 'Tomorrow (Oct 29)',
      appointment_time: '2:30 PM (45m)',
      status: 'confirmed',
      copay: 30.00,
      pass_code: 'MS-CARD402',
      is_priority: true,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNUKSoQZkW4qI9vJJ6eEoE0OaHI0WOdTn6LlR6OzJfeFTT6mE-bonF5wYlT2f8f7dhAZwPoRLjsnHv1DOUTX9rglH34qIC4NmvxBqwAIYEl-ZJRDUgoi35rDm5m_qKHms7MEtb98w1ikNsRg7iUIKt_tGu-bUVrFbGOm7iZB6-D-w0qomWveX9Xidp2hcF5eCGwwSoChsHaN6CdeP_VzrRoPJN6CoFY4EmC-X5wgU'
    },
    {
      id: '66666666-6666-6666-6666-666666666666',
      patient_name: 'Alex Mercer',
      provider_name: 'Dr. Marcus Vance',
      provider_id: '22222222-2222-2222-2222-222222222222',
      specialty: 'Cosmetic & General Dentistry',
      clinic_name: 'Downtown Dental Studio',
      clinic_address: 'Downtown Dental Studio, 120 Market St #300',
      appointment_date: 'Thu, Nov 07',
      appointment_time: '10:00 AM (30m)',
      status: 'confirmed',
      copay: 25.00,
      pass_code: 'MS-DENT120',
      is_priority: false,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR4HsY8DwEb4oY5fCVytHCSDW-Prucxi1PrNCIFV_fO-lIep4IUzDI9SJWbB1XmvVOg_UYuanLlIapsZmwt8EIOcSZHNA5ErrRT0lKwzvZTucE4Bi2IOE6h13lM-7C45_CEDoEl6EQKNpEQpMwSWcvJUthP8843MmPG8wulEUdbcVRQIGS3pM78rqB1T3blNSkYfDB7v_jFe1bVASgKz9_9NRzzFDZuXcGiutyF_A'
    }
  ];

  const DEFAULT_ACTIVITIES = [
    {
      id: '1',
      title: 'Appointment Rescheduled',
      description: 'Dr. Sarah Jenkins moved to Oct 29, 2:30 PM via AI slot-fill.',
      time_ago: '2h ago',
      icon: 'sync',
      badge_bg: 'bg-primary-container',
      badge_text: 'text-on-surface'
    },
    {
      id: '2',
      title: 'Blood Panel Synced',
      description: 'Biometrics report ready for review with Primary Care.',
      time_ago: 'Yesterday',
      icon: 'lab_profile',
      badge_bg: 'bg-tertiary-container',
      badge_text: 'text-tertiary'
    },
    {
      id: '3',
      title: 'Prescription Filled',
      description: 'Metro Health Chemist delivered refill order #MS-9912.',
      time_ago: 'Oct 24',
      icon: 'receipt_long',
      badge_bg: 'bg-secondary-container',
      badge_text: 'text-on-secondary-fixed'
    }
  ];

  class MediSlotSupabaseClient {
    constructor() {
      this.supabase = null;
      const envUrl = (window.MEDISLOT_ENV && window.MEDISLOT_ENV.SUPABASE_URL) || '';
      const envKey = (window.MEDISLOT_ENV && (window.MEDISLOT_ENV.SUPABASE_ANON_KEY || window.MEDISLOT_ENV.SUPABASE_KEY)) || '';

      const defaultUrl = envUrl || 'https://dbiiejpqecascguowhwy.supabase.co';
      const defaultKey = envKey || 'sb_publishable_achLmIKrIfrJmKRgpC91nA_m0qWe29J';

      const storedUrl = localStorage.getItem('MEDISLOT_SUPABASE_URL');
      const storedKey = localStorage.getItem('MEDISLOT_SUPABASE_KEY');

      this.url = storedUrl && storedUrl.trim() ? storedUrl.trim() : defaultUrl;
      this.key = storedKey && storedKey.trim() ? storedKey.trim() : defaultKey;
      this.mode = localStorage.getItem('MEDISLOT_DATA_MODE') || 'auto'; // 'auto', 'supabase', 'local'
      this.isLive = false;
      this.initClient();
      this.syncWithServerEnv();
    }

    async syncWithServerEnv() {
      try {
        if (window.location && window.location.protocol && window.location.protocol.startsWith('http')) {
          const res = await fetch('/api/env');
          if (res.ok) {
            const data = await res.json();
            if (data && data.SUPABASE_URL && data.SUPABASE_ANON_KEY) {
              const customStored = localStorage.getItem('MEDISLOT_SUPABASE_URL');
              if (!customStored) {
                this.url = data.SUPABASE_URL;
                this.key = data.SUPABASE_ANON_KEY;
                this.initClient();
                if (window.MediSlotApp && typeof window.MediSlotApp.updateSupabaseStatusBadge === 'function') {
                  window.MediSlotApp.updateSupabaseStatusBadge();
                }
              }
            }
          }
        }
      } catch (e) {
        // Fallback silently if /api/env is not served
      }
    }

    initClient() {
      if (this.url && this.key && window.supabase && window.supabase.createClient) {
        try {
          this.supabase = window.supabase.createClient(this.url, this.key);
          this.isLive = true;
          console.log('[MediSlot] Connected to live Supabase instance:', this.url);
        } catch (e) {
          console.warn('[MediSlot] Failed to initialize Supabase client:', e);
          this.supabase = null;
          this.isLive = false;
        }
      } else {
        this.supabase = null;
        this.isLive = false;
      }

      // Initialize local storage seeds if absent
      if (!localStorage.getItem('MEDISLOT_PROVIDERS')) {
        localStorage.setItem('MEDISLOT_PROVIDERS', JSON.stringify(DEFAULT_PROVIDERS));
      }
      if (!localStorage.getItem('MEDISLOT_APPOINTMENTS')) {
        localStorage.setItem('MEDISLOT_APPOINTMENTS', JSON.stringify(DEFAULT_APPOINTMENTS));
      }
      if (!localStorage.getItem('MEDISLOT_ACTIVITIES')) {
        localStorage.setItem('MEDISLOT_ACTIVITIES', JSON.stringify(DEFAULT_ACTIVITIES));
      }
      if (!localStorage.getItem('MEDISLOT_LEDGER')) {
        localStorage.setItem('MEDISLOT_LEDGER', JSON.stringify({
          total: 12,
          upcoming: 2,
          completed: 9,
          cancelled: 1
        }));
      }
    }

    getStatus() {
      return {
        configured: Boolean(this.url && this.key),
        isLive: this.isLive,
        url: this.url,
        keyPreview: this.key ? this.key.slice(0, 8) + '...' + this.key.slice(-4) : '',
        mode: this.isLive ? 'Supabase Cloud (Live)' : 'Local Engine (Instant Demo)'
      };
    }

    async setCredentials(url, key) {
      this.url = (url || '').trim();
      this.key = (key || '').trim();
      localStorage.setItem('MEDISLOT_SUPABASE_URL', this.url);
      localStorage.setItem('MEDISLOT_SUPABASE_KEY', this.key);
      this.initClient();
      return this.testConnection();
    }

    clearCredentials() {
      this.url = '';
      this.key = '';
      localStorage.removeItem('MEDISLOT_SUPABASE_URL');
      localStorage.removeItem('MEDISLOT_SUPABASE_KEY');
      this.supabase = null;
      this.isLive = false;
      return { success: true, message: 'Switched back to Local Engine.' };
    }

    async testConnection() {
      if (!this.url || !this.key) {
        return { success: false, message: 'URL and Key are required.' };
      }
      try {
        if (!window.supabase) {
          return { success: false, message: 'Supabase JS library not loaded.' };
        }
        const tempClient = window.supabase.createClient(this.url, this.key);
        // Test query
        const { data, error } = await tempClient.from('providers').select('id').limit(1);
        if (error) {
          // Check if table missing
          if (error.code === '42P01') {
            return {
              success: true,
              tableMissing: true,
              message: 'Connected to Supabase! However, tables are not created yet. Please execute supabase_schema.sql in your Supabase SQL Editor.'
            };
          }
          if (error.code === '42501') {
            return {
              success: false,
              message: 'Permission denied (42501). Grant privileges to the anon role in Supabase SQL Editor: GRANT USAGE ON SCHEMA public TO anon; GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;'
            };
          }
          return { success: false, message: 'Supabase error: ' + error.message };
        }
        return { success: true, message: 'Successfully connected to Supabase database!' };
      } catch (err) {
        return { success: false, message: 'Network or syntax error: ' + err.message };
      }
    }

    // Providers
    async getProviders(filters = {}) {
      if (this.isLive && this.supabase) {
        try {
          let query = this.supabase.from('providers').select('*');
          if (filters.category && filters.category !== 'All') {
            query = query.eq('category', filters.category);
          }
          if (filters.search) {
            query = query.or(`name.ilike.%${filters.search}%,specialty.ilike.%${filters.search}%,clinic_name.ilike.%${filters.search}%`);
          }
          const { data, error } = await query;
          if (!error && data && data.length > 0) {
            return data;
          }
        } catch (e) {
          console.warn('[MediSlot] Supabase query failed, falling back to local:', e);
        }
      }

      // Local fallback
      const stored = JSON.parse(localStorage.getItem('MEDISLOT_PROVIDERS') || '[]');
      return stored.filter(p => {
        if (filters.category && filters.category !== 'All') {
          if (p.category.toLowerCase() !== filters.category.toLowerCase()) return false;
        }
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const match = p.name.toLowerCase().includes(q) ||
                        p.specialty.toLowerCase().includes(q) ||
                        p.clinic_name.toLowerCase().includes(q);
          if (!match) return false;
        }
        if (filters.availableToday && !p.next_opening.toLowerCase().includes('tomorrow') && !p.next_opening.toLowerCase().includes('today')) {
          // loose filter check
        }
        if (filters.inNetwork && !p.in_network) return false;
        if (filters.topRated && p.rating < 4.8) return false;
        return true;
      });
    }

    // Appointments
    async getAppointments() {
      if (this.isLive && this.supabase) {
        try {
          const { data, error } = await this.supabase
            .from('appointments')
            .select('*, providers(*)')
            .order('created_at', { ascending: false });
          if (!error && data && data.length > 0) {
            return data.map(a => ({
              ...a,
              provider_name: a.providers ? a.providers.name : a.patient_name,
              image_url: a.providers ? a.providers.image_url : null
            }));
          }
        } catch (e) {
          console.warn('[MediSlot] Appointments query failed, using local storage:', e);
        }
      }
      return JSON.parse(localStorage.getItem('MEDISLOT_APPOINTMENTS') || '[]');
    }

    async bookAppointment(aptData) {
      const newApt = {
        id: 'ms-' + Date.now(),
        patient_name: aptData.patient_name || 'Alex Mercer',
        provider_name: aptData.provider_name,
        provider_id: aptData.provider_id,
        specialty: aptData.specialty,
        clinic_name: aptData.clinic_name,
        clinic_address: aptData.clinic_address || aptData.clinic_name,
        appointment_date: aptData.appointment_date,
        appointment_time: aptData.appointment_time,
        status: 'confirmed',
        copay: aptData.copay || 25.00,
        pass_code: 'MS-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        is_priority: false,
        image_url: aptData.image_url,
        notes: aptData.notes || 'Booked via MediSlot AI'
      };

      if (this.isLive && this.supabase) {
        try {
          const { data, error } = await this.supabase.from('appointments').insert([{
            patient_name: newApt.patient_name,
            provider_id: newApt.provider_id,
            appointment_date: newApt.appointment_date,
            appointment_time: newApt.appointment_time,
            clinic_name: newApt.clinic_name,
            specialty: newApt.specialty,
            copay: newApt.copay,
            status: 'confirmed',
            pass_code: newApt.pass_code,
            symptoms_notes: newApt.notes
          }]).select();
          if (!error && data) {
            console.log('[MediSlot] Successfully saved appointment to Supabase:', data);
          }
        } catch (err) {
          console.warn('[MediSlot] Could not insert to Supabase, continuing with local:', err);
        }
      }

      // Always update local storage for instant reactive UI
      const appointments = JSON.parse(localStorage.getItem('MEDISLOT_APPOINTMENTS') || '[]');
      appointments.unshift(newApt);
      localStorage.setItem('MEDISLOT_APPOINTMENTS', JSON.stringify(appointments));

      // Update Ledger
      const ledger = JSON.parse(localStorage.getItem('MEDISLOT_LEDGER') || '{}');
      ledger.total = (ledger.total || 0) + 1;
      ledger.upcoming = (ledger.upcoming || 0) + 1;
      localStorage.setItem('MEDISLOT_LEDGER', JSON.stringify(ledger));

      // Add to Activity
      this.addActivity({
        title: 'New Booking Confirmed',
        description: `${newApt.provider_name} on ${newApt.appointment_date} at ${newApt.appointment_time}.`,
        time_ago: 'Just now',
        icon: 'event_available',
        badge_bg: 'bg-primary-container',
        badge_text: 'text-on-surface'
      });

      return newApt;
    }

    async cancelAppointment(aptId) {
      if (this.isLive && this.supabase) {
        try {
          await this.supabase.from('appointments').update({ status: 'cancelled' }).eq('id', aptId);
        } catch (e) {
          console.warn('[MediSlot] Cancel update failed on Supabase:', e);
        }
      }

      const appointments = JSON.parse(localStorage.getItem('MEDISLOT_APPOINTMENTS') || '[]');
      const aptIndex = appointments.findIndex(a => a.id === aptId);
      if (aptIndex !== -1) {
        appointments[aptIndex].status = 'cancelled';
        localStorage.setItem('MEDISLOT_APPOINTMENTS', JSON.stringify(appointments));

        // Update Ledger
        const ledger = JSON.parse(localStorage.getItem('MEDISLOT_LEDGER') || '{}');
        ledger.upcoming = Math.max(0, (ledger.upcoming || 1) - 1);
        ledger.cancelled = (ledger.cancelled || 0) + 1;
        localStorage.setItem('MEDISLOT_LEDGER', JSON.stringify(ledger));

        // Add Activity
        this.addActivity({
          title: 'Appointment Cancelled',
          description: `${appointments[aptIndex].provider_name} slot was released with zero penalty.`,
          time_ago: 'Just now',
          icon: 'cancel',
          badge_bg: 'bg-error-container',
          badge_text: 'text-error'
        });

        return true;
      }
      return false;
    }

    async rescheduleAppointment(aptId, newDate, newTime) {
      if (this.isLive && this.supabase) {
        try {
          await this.supabase.from('appointments').update({
            appointment_date: newDate,
            appointment_time: newTime,
            status: 'confirmed'
          }).eq('id', aptId);
        } catch (e) {
          console.warn('[MediSlot] Supabase reschedule failed:', e);
        }
      }

      const appointments = JSON.parse(localStorage.getItem('MEDISLOT_APPOINTMENTS') || '[]');
      const aptIndex = appointments.findIndex(a => a.id === aptId);
      if (aptIndex !== -1) {
        appointments[aptIndex].appointment_date = newDate;
        appointments[aptIndex].appointment_time = newTime;
        appointments[aptIndex].status = 'confirmed';
        localStorage.setItem('MEDISLOT_APPOINTMENTS', JSON.stringify(appointments));

        this.addActivity({
          title: 'Appointment Rescheduled',
          description: `${appointments[aptIndex].provider_name} moved to ${newDate}, ${newTime}.`,
          time_ago: 'Just now',
          icon: 'sync',
          badge_bg: 'bg-primary-container',
          badge_text: 'text-on-surface'
        });

        return appointments[aptIndex];
      }
      return null;
    }

    getLedgerStats() {
      return JSON.parse(localStorage.getItem('MEDISLOT_LEDGER') || JSON.stringify({
        total: 12,
        upcoming: 2,
        completed: 9,
        cancelled: 1
      }));
    }

    getActivityLogs() {
      return JSON.parse(localStorage.getItem('MEDISLOT_ACTIVITIES') || '[]');
    }

    addActivity(activity) {
      const activities = JSON.parse(localStorage.getItem('MEDISLOT_ACTIVITIES') || '[]');
      activities.unshift({
        id: 'act-' + Date.now(),
        ...activity
      });
      localStorage.setItem('MEDISLOT_ACTIVITIES', JSON.stringify(activities.slice(0, 10)));
    }
  }

  window.MediSlotDB = new MediSlotSupabaseClient();
})(window);
