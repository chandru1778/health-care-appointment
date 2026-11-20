import { MEDIZAP_LOGO_URL } from '../data/medizapData';
import type { PageRoute } from '../types/medizap';
import { ResilientImage } from './ResilientImage';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
  onOpenAiAssistant: (query?: string) => void;
  onShowToast: (msg: string) => void;
}

export function Footer({ onNavigate, onOpenAiAssistant, onShowToast }: FooterProps) {
  return (
    <footer className="w-full bg-surface-container-low shadow-[0_-1px_8px_rgba(28,28,28,0.02)]">
      <div className="w-full px-margin md:px-margin-lg py-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-lg">
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-space-xs">
              <ResilientImage
                src={MEDIZAP_LOGO_URL}
                alt="Healthcare Logo"
                className="h-7 w-7 rounded-md object-contain"
                fallbackLabel="HC"
              />
              <span className="text-[18px] font-bold text-on-surface">Healthcare</span>
            </div>
            <p className="text-[13px] text-on-surface-variant leading-relaxed">
              AI-powered healthcare network connecting patients with verified medical professionals
              and accredited hospital networks for rapid care delivery.
            </p>
            <div className="flex items-center gap-2 pt-space-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-container/20 text-tertiary text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                24/7 Verified Network
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-space-sm">
            <h3 className="text-[14px] font-semibold text-on-surface uppercase tracking-wider">
              Services
            </h3>
            <ul className="flex flex-col gap-space-xs text-[13px] text-on-surface-variant">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('find-doctors')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Doctor Consultations
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('hospitals')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Hospital Emergency Booking
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('my-appointments')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Telehealth Video Triage
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('hospitals')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Diagnostic Labs &amp; Scans
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenAiAssistant('Assess my symptoms and suggest a specialist')}
                  className="hover:text-primary transition-colors text-left"
                >
                  AI Symptom Assessment
                </button>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-space-sm">
            <h3 className="text-[14px] font-semibold text-on-surface uppercase tracking-wider">
              For Healthcare Partners
            </h3>
            <ul className="flex flex-col gap-space-xs text-[13px] text-on-surface-variant">
              {[
                'Healthcare for Doctors',
                'Clinic Management Suite',
                'Hospital Integration API',
                'EMR Interoperability',
                'Join Provider Directory',
              ].map((label) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() =>
                      onShowToast(`${label}: Provider onboarding portal requests are reviewed within 24 hours.`)
                    }
                    className="hover:text-primary transition-colors text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-space-sm">
            <h3 className="text-[14px] font-semibold text-on-surface uppercase tracking-wider">
              Support
            </h3>
            <ul className="flex flex-col gap-space-xs text-[13px] text-on-surface-variant">
              {[
                'Patient Help Desk',
                'Emergency Contacts',
                'Insurance & Billing',
                'Contact Support Team',
                'Patient Care Feedback',
              ].map((label) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() =>
                      onShowToast(`${label}: 24/7 clinical support desk available at care@healthcare.health`)
                    }
                    className="hover:text-primary transition-colors text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-space-xl pt-space-lg bg-surface-container-high/40 rounded-xl p-space-md flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-semibold text-on-surface uppercase tracking-wide">
              Legal Disclaimer
            </span>
            <p className="text-[11px] text-on-surface-variant leading-relaxed max-w-4xl">
              Healthcare is a digital discovery and scheduling platform. In the event of an urgent
              medical crisis or life-threatening situation, immediately call local emergency services
              (e.g., 911) or proceed directly to the nearest hospital trauma center.
            </p>
          </div>
          <div className="flex items-center gap-space-md text-[11px] text-on-surface-variant flex-shrink-0">
            {['Privacy Policy', 'Terms of Service', 'HIPAA Security'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onShowToast(`${item}: Healthcare complies with HIPAA 256-bit encryption standards.`)}
                className="hover:text-on-surface transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm text-center sm:text-left">
          <p className="text-[11px] text-on-surface-variant">
            © 2025 Healthcare Health Technologies Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tertiary" />
            <span className="text-[11px] text-on-surface-variant">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
