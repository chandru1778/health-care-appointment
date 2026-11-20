import express from 'express';
import type { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import {
  DOCTORS,
  HOSPITALS,
  INITIAL_APPOINTMENTS,
  INITIAL_FAMILY_MEMBERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_RECORDS,
} from '../src/data/medizapData';
import type {
  Appointment,
  FamilyMember,
  MedicalRecord,
  NotificationPreference,
} from '../src/types/medizap';

const app = express();
app.use(express.json());

// In-memory runtime cache for serverless invocation
let runtimeAppointments: Appointment[] = [...INITIAL_APPOINTMENTS];
let runtimeFamily: FamilyMember[] = [...INITIAL_FAMILY_MEMBERS];
let runtimeNotifications: NotificationPreference[] = [...INITIAL_NOTIFICATIONS];
let runtimeRecords: MedicalRecord[] = [...INITIAL_RECORDS];
let runtimeProfile = {
  name: 'Alex Morgan',
  email: 'alex.m@healthmail.com',
  phone: '+1 (555) 438-9921',
};

const DOCTOR_CATALOG_SUMMARY = DOCTORS.map((d) => ({
  id: d.id,
  name: d.name,
  specialty: d.specialty,
  hospital: d.hospitalName,
  fee: d.fee,
  nextSlot: d.nextSlot,
}));

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function fallbackTriage(query: string) {
  const q = query.toLowerCase();

  if (
    q.includes('chest pain') ||
    q.includes('heart attack') ||
    q.includes('difficulty breathing') ||
    q.includes('severe bleeding') ||
    q.includes('stroke') ||
    q.includes('unconscious')
  ) {
    const cardDoc = DOCTORS.find((d) => d.specialty === 'Cardiology') || DOCTORS[0];
    return {
      reply:
        'CRITICAL: Your symptoms indicate a possible medical emergency. Please call 911 or proceed immediately to the nearest Emergency Department (Apollo Care 24/7 Trauma Center). We have also highlighted our on-duty emergency cardiologist below.',
      recommendedSpecialty: 'Cardiology',
      recommendedDoctorId: cardDoc.id,
      urgency: 'Emergency',
    };
  }

  if (
    q.includes('heart') ||
    q.includes('cardio') ||
    q.includes('palpitation') ||
    q.includes('bp') ||
    q.includes('blood pressure') ||
    q.includes('cholesterol')
  ) {
    const doc = DOCTORS.find((d) => d.specialty === 'Cardiology') || DOCTORS[0];
    return {
      reply: `Based on your cardiac inquiries, consulting a Cardiology specialist is advised for an ECG and cardiovascular evaluation. Dr. ${doc.name} at ${doc.hospitalName} is available for consultation.`,
      recommendedSpecialty: 'Cardiology',
      recommendedDoctorId: doc.id,
      urgency: 'Prompt',
    };
  }

  if (
    q.includes('skin') ||
    q.includes('rash') ||
    q.includes('acne') ||
    q.includes('eczema') ||
    q.includes('itch') ||
    q.includes('allergy')
  ) {
    const doc = DOCTORS.find((d) => d.specialty === 'Dermatology') || DOCTORS[2];
    return {
      reply: `For dermatological symptoms or allergic skin reactions, a certified dermatologist can examine the condition and prescribe targeted topicals. Dr. ${doc.name} has next available openings.`,
      recommendedSpecialty: 'Dermatology',
      recommendedDoctorId: doc.id,
      urgency: 'Routine',
    };
  }

  if (
    q.includes('bone') ||
    q.includes('joint') ||
    q.includes('knee') ||
    q.includes('back pain') ||
    q.includes('fracture') ||
    q.includes('sprain') ||
    q.includes('shoulder')
  ) {
    const doc = DOCTORS.find((d) => d.specialty === 'Orthopedics') || DOCTORS[3];
    return {
      reply: `For joint, muscular, or skeletal discomfort, an orthopedic specialist can evaluate joint mobility and recommend digital imaging or rehab. Dr. ${doc.name} specializes in sports trauma and joint recovery.`,
      recommendedSpecialty: 'Orthopedics',
      recommendedDoctorId: doc.id,
      urgency: 'Prompt',
    };
  }

  if (
    q.includes('headache') ||
    q.includes('migraine') ||
    q.includes('nerve') ||
    q.includes('dizzy') ||
    q.includes('numbness')
  ) {
    const doc = DOCTORS.find((d) => d.specialty === 'Neurology') || DOCTORS[4];
    return {
      reply: `Neurological symptoms such as recurrent migraines or vertigo should be assessed by a neurologist for accurate pathway diagnosis. Dr. ${doc.name} is available for clinical evaluation.`,
      recommendedSpecialty: 'Neurology',
      recommendedDoctorId: doc.id,
      urgency: 'Prompt',
    };
  }

  if (
    q.includes('baby') ||
    q.includes('child') ||
    q.includes('kid') ||
    q.includes('pediatric') ||
    q.includes('infant')
  ) {
    const doc = DOCTORS.find((d) => d.specialty === 'Pediatrics') || DOCTORS[7];
    return {
      reply: `For childhood wellness, pediatric fevers, or milestone checks, Dr. ${doc.name} at City Health Multispeciality provides compassionate pediatric consultations.`,
      recommendedSpecialty: 'Pediatrics',
      recommendedDoctorId: doc.id,
      urgency: 'Prompt',
    };
  }

  if (
    q.includes('lung') ||
    q.includes('cough') ||
    q.includes('asthma') ||
    q.includes('breath') ||
    q.includes('wheezing')
  ) {
    const doc = DOCTORS.find((d) => d.specialty === 'Pulmonology') || DOCTORS[10];
    return {
      reply: `Respiratory concerns or persistent coughing warrant a spirometry and lung function assessment. Dr. ${doc.name} leads our pulmonary critical care wing.`,
      recommendedSpecialty: 'Pulmonology',
      recommendedDoctorId: doc.id,
      urgency: 'Prompt',
    };
  }

  const doc = DOCTORS.find((d) => d.specialty === 'General Physician') || DOCTORS[6];
  return {
    reply: `For your described symptoms, a General Physician consultation is recommended to conduct preliminary diagnostic labs and determine whether specialized care is needed. Dr. ${doc.name} has slots available.`,
    recommendedSpecialty: 'General Physician',
    recommendedDoctorId: doc.id,
    urgency: 'Routine',
  };
}

// API Routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'medizap-api-vercel',
    supabaseConfigured: Boolean(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
  });
});

app.get('/api/doctors', (_req: Request, res: Response) => {
  res.json({ doctors: DOCTORS });
});

app.get('/api/hospitals', (_req: Request, res: Response) => {
  res.json({ hospitals: HOSPITALS });
});

app.get('/api/portal-state', (_req: Request, res: Response) => {
  res.json({
    appointments: runtimeAppointments,
    records: runtimeRecords,
    familyMembers: runtimeFamily,
    notificationPrefs: runtimeNotifications,
    profile: runtimeProfile,
  });
});

app.post('/api/appointments', (req: Request, res: Response) => {
  const apt = req.body as Appointment;
  if (!apt || !apt.doctorName || !apt.dateLabel || !apt.timeSlot) {
    return res.status(400).json({ error: 'Invalid appointment payload.' });
  }
  const exists = runtimeAppointments.some((a) => a.id === apt.id);
  if (!exists) {
    runtimeAppointments = [apt, ...runtimeAppointments];
  }
  return res.status(201).json({ appointment: apt });
});

app.patch('/api/appointments/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const updates = req.body as Partial<Appointment>;
  const idx = runtimeAppointments.findIndex((a) => a.id === id);
  if (idx !== -1) {
    runtimeAppointments[idx] = { ...runtimeAppointments[idx], ...updates };
    return res.json({ appointment: runtimeAppointments[idx] });
  }
  return res.json({ success: true, updated: updates });
});

app.post('/api/family', (req: Request, res: Response) => {
  const member = req.body as FamilyMember;
  if (member && member.name) {
    runtimeFamily = [...runtimeFamily, member];
  }
  return res.status(201).json({ member });
});

app.patch('/api/notifications/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const channel = req.body?.channel as 'sms' | 'email' | 'push';
  if (channel) {
    runtimeNotifications = runtimeNotifications.map((p) =>
      p.id === id ? { ...p, [channel]: !p[channel] } : p
    );
  }
  return res.json({ notificationPrefs: runtimeNotifications });
});

app.patch('/api/profile', (req: Request, res: Response) => {
  const { name, email, phone } = req.body as {
    name?: string;
    email?: string;
    phone?: string;
  };
  runtimeProfile = {
    name: name?.trim() || runtimeProfile.name,
    email: email?.trim() || runtimeProfile.email,
    phone: phone?.trim() || runtimeProfile.phone,
  };
  return res.json({ profile: runtimeProfile });
});

app.post('/api/ai-triage', async (req: Request, res: Response) => {
  const query = typeof req.body?.query === 'string' ? req.body.query.trim() : '';
  if (!query) {
    return res.status(400).json({ error: 'Please describe your symptoms or care request.' });
  }

  const ai = getGeminiClient();
  if (!ai) {
    const fallback = fallbackTriage(query);
    return res.json(fallback);
  }

  try {
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Patient inquiry: "${query}"\n\nAvailable verified specialists:\n${JSON.stringify(DOCTOR_CATALOG_SUMMARY)}`,
      config: {
        systemInstruction:
          'You are the MediZap AI Clinical Triage Assistant. Provide concise, empathetic guidance in 2-3 sentences. Do not diagnose; recommend the most relevant specialty and matching doctor from the provided catalog. If emergency symptoms (chest pain, difficulty breathing, stroke signs, severe bleeding) are described, mark urgency as "Emergency" and advise calling 911 immediately.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: 'Concise 2-3 sentence empathetic clinical triage response.',
            },
            recommendedSpecialty: {
              type: Type.STRING,
              description: 'Best matching specialty name.',
            },
            recommendedDoctorId: {
              type: Type.STRING,
              description: 'ID of the best matching doctor from the catalog.',
            },
            urgency: {
              type: Type.STRING,
              description: 'One of Routine, Prompt, or Emergency.',
            },
          },
          required: ['reply', 'recommendedSpecialty', 'recommendedDoctorId', 'urgency'],
        },
      },
    });

    const raw = (response.text ?? '{}').trim();
    const parsed = JSON.parse(raw);
    return res.json(parsed);
  } catch (err: unknown) {
    console.warn('Gemini API call failed, using clinical fallback triage:', err);
    const fallback = fallbackTriage(query);
    return res.json(fallback);
  }
});

export default app;
