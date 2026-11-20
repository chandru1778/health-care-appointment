import { useEffect, useState } from 'react';
import { DOCTORS } from '../data/medizapData';
import type { Doctor } from '../types/medizap';
import { ResilientImage } from './ResilientImage';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user' | 'error';
  text: string;
  recommendedDoctor?: Doctor;
  urgency?: string;
}

interface AiAssistantWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onBookDoctor: (doctor: Doctor) => void;
  pendingQuery?: string;
  onClearPendingQuery?: () => void;
}

function clientSideTriage(query: string): { reply: string; recommendedDoctor: Doctor; urgency: string } {
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
        'CRITICAL: Your symptoms indicate a possible medical emergency. Please call 911 or proceed immediately to the nearest Emergency Department (Apollo Care 24/7 Trauma Center). We have highlighted our on-duty emergency cardiologist below.',
      recommendedDoctor: cardDoc,
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
      reply: `Based on your cardiovascular symptoms, consulting a Cardiology specialist is advised for an ECG and diagnostic check. Dr. ${doc.name} at ${doc.hospitalName} has slots available.`,
      recommendedDoctor: doc,
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
      recommendedDoctor: doc,
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
      reply: `For joint, muscular, or skeletal discomfort, an orthopedic specialist can evaluate mobility and recommend imaging or physical therapy. Dr. ${doc.name} specializes in joint trauma recovery.`,
      recommendedDoctor: doc,
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
      recommendedDoctor: doc,
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
      reply: `For childhood wellness, pediatric fevers, or developmental checks, Dr. ${doc.name} at City Health Multispeciality provides compassionate pediatric consultations.`,
      recommendedDoctor: doc,
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
      recommendedDoctor: doc,
      urgency: 'Prompt',
    };
  }

  const doc = DOCTORS.find((d) => d.specialty === 'General Physician') || DOCTORS[6];
  return {
    reply: `For your described symptoms, a General Physician consultation is recommended to conduct preliminary diagnostic labs and determine whether specialized care is needed. Dr. ${doc.name} has slots available.`,
    recommendedDoctor: doc,
    urgency: 'Routine',
  };
}

export function AiAssistantWidget({
  isOpen,
  onToggle,
  onBookDoctor,
  pendingQuery,
  onClearPendingQuery,
}: AiAssistantWidgetProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'intro-1',
      role: 'assistant',
      text: 'Hello! I can match you with the right specialist or emergency facility. What symptoms or appointments can I arrange for you?',
      recommendedDoctor: DOCTORS[1],
      urgency: 'Routine',
    },
  ]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) {
        const fallback = clientSideTriage(trimmed);
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            text: fallback.reply,
            recommendedDoctor: fallback.recommendedDoctor,
            urgency: fallback.urgency,
          },
        ]);
        return;
      }

      const matchedDoc =
        DOCTORS.find((d) => d.id === data.recommendedDoctorId) ||
        DOCTORS.find((d) =>
          d.specialty.toLowerCase().includes(String(data.recommendedSpecialty || '').toLowerCase())
        ) ||
        DOCTORS[0];

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: data.reply || `I recommend consulting a ${matchedDoc.specialty} specialist.`,
          recommendedDoctor: matchedDoc,
          urgency: data.urgency || 'Routine',
        },
      ]);
    } catch {
      const fallback = clientSideTriage(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: fallback.reply,
          recommendedDoctor: fallback.recommendedDoctor,
          urgency: fallback.urgency,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && pendingQuery && pendingQuery.trim() && !loading) {
      const q = pendingQuery.trim();
      onClearPendingQuery?.();
      void sendMessage(q);
    }
  }, [isOpen, pendingQuery]);

  return (
    <>
      {/* Expandable Conversational Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-outline-variant/30">
          {/* Chat Header */}
          <div className="bg-primary-container text-on-primary p-space-md flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-on-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold leading-none">Healthcare AI Assistant</span>
                <span className="text-[11px] opacity-90 mt-1">Instant Clinical Triage</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggle}
              className="w-7 h-7 rounded-full hover:bg-on-primary/20 flex items-center justify-center transition-colors"
              aria-label="Close AI assistant"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Chat Messages Flow */}
          <div className="p-space-md flex flex-col gap-3 max-h-96 overflow-y-auto bg-surface-container-low/50">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-2">
                {msg.role === 'user' ? (
                  <div className="self-end max-w-[85%] bg-primary text-on-primary p-3 rounded-2xl rounded-tr-none text-[13px] shadow-sm">
                    {msg.text}
                  </div>
                ) : msg.role === 'error' ? (
                  <div className="bg-error-container/50 text-on-error-container p-3 rounded-xl text-[12px] flex items-start gap-2">
                    <span className="material-symbols-outlined text-[16px] mt-0.5">warning</span>
                    <span>{msg.text}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      </div>
                      <div className="bg-surface-container-lowest p-3 rounded-2xl rounded-tl-none shadow-sm text-[13px] text-on-surface leading-relaxed">
                        {msg.urgency === 'Emergency' && (
                          <div className="mb-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-error text-[11px] font-bold">
                            Urgent Triage Alert
                          </div>
                        )}
                        <p>{msg.text}</p>
                      </div>
                    </div>

                    {msg.recommendedDoctor && (
                      <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm flex flex-col gap-2 ml-8">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-secondary font-bold uppercase tracking-wider">
                            Top Recommendation
                          </span>
                          <span className="text-[11px] text-tertiary font-bold">
                            Slot: {msg.recommendedDoctor.nextSlot}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ResilientImage
                            src={msg.recommendedDoctor.image}
                            alt={msg.recommendedDoctor.name}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            fallbackLabel={msg.recommendedDoctor.name}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="text-[13px] text-on-surface font-bold truncate">
                              {msg.recommendedDoctor.name}
                            </span>
                            <span className="text-[11px] text-on-surface-variant truncate">
                              {msg.recommendedDoctor.specialty} • {msg.recommendedDoctor.hospitalName}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onBookDoctor(msg.recommendedDoctor!)}
                          className="w-full py-1.5 bg-primary-container text-on-primary rounded-md text-[12px] font-semibold hover:bg-primary transition-colors text-center shadow-sm"
                        >
                          Book This Match (${msg.recommendedDoctor.fee})
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-[12px] text-on-surface-variant pl-8">
                <span className="material-symbols-outlined text-[16px] text-primary animate-spin">
                  progress_activity
                </span>
                <span>Analyzing symptoms and querying availability...</span>
              </div>
            )}
          </div>

          {/* Prompt Suggestions */}
          <div className="px-space-md pt-2 pb-1 flex gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => sendMessage('Check Apollo emergency wait time and heart care')}
              className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-[11px] whitespace-nowrap"
            >
              🚨 Emergency wait times
            </button>
            <button
              type="button"
              onClick={() => sendMessage('I have a skin rash and need a dermatologist tomorrow')}
              className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-[11px] whitespace-nowrap"
            >
              🧴 Dermatology consult
            </button>
            <button
              type="button"
              onClick={() => sendMessage('Knee pain after running, need orthopedist')}
              className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-[11px] whitespace-nowrap"
            >
              🦴 Knee pain triage
            </button>
          </div>

          {/* Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="p-space-md bg-surface-container-lowest flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe symptoms or request..."
              className="flex-1 bg-surface-container-low rounded-lg px-3 py-2 text-[13px] text-on-surface focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-lg bg-primary-container hover:bg-primary disabled:opacity-50 text-on-primary flex items-center justify-center shadow-sm"
              aria-label="Send message"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      )}

      {/* Persistent Bottom-Right Trigger */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
        <button
          type="button"
          onClick={onToggle}
          aria-label="Open AI Health Assistant"
          className="w-14 h-14 rounded-full bg-primary-container text-on-primary hover:bg-primary transition-all shadow-[0_12px_32px_-6px_rgba(28,28,28,0.18)] hover:scale-105 active:scale-95 flex items-center justify-center group relative cursor-pointer"
        >
          <span className="material-symbols-outlined text-[28px] leading-none transition-transform group-hover:rotate-12">
            {isOpen ? 'close' : 'smart_toy'}
          </span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-tertiary rounded-full ring-2 ring-surface-container-lowest" />
        </button>
      </div>
    </>
  );
}
