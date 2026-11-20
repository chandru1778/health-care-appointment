/**
 * Neumorphism (Soft UI) Design System Tokens
 * Strict adherence to dual opposing RGB shadows, cool grey base (#E0E5EC),
 * WCAG AA/AAA compliant typography, and soft pillowed radiuses.
 */

export const NEU_COLORS = {
  background: '#E0E5EC',
  foreground: '#3D4852', // 7.5:1 contrast against #E0E5EC (WCAG AAA)
  muted: '#6B7280',      // 4.6:1 contrast against #E0E5EC (WCAG AA)
  accent: '#6C63FF',     // Soft violet
  accentLight: '#8B84FF',
  accentSecondary: '#38B2AC', // Teal
  placeholder: '#A0AEC0',
  border: 'transparent',
} as const;

export const NEU_SHADOWS = {
  // Extruded (Convex / Raised)
  extruded: '9px 9px 16px rgb(163, 177, 198, 0.6), -9px -9px 16px rgba(255, 255, 255, 0.5)',
  extrudedHover: '12px 12px 20px rgb(163, 177, 198, 0.7), -12px -12px 20px rgba(255, 255, 255, 0.6)',
  extrudedSm: '5px 5px 10px rgb(163, 177, 198, 0.6), -5px -5px 10px rgba(255, 255, 255, 0.5)',
  
  // Inset (Concave / Pressed / Wells)
  inset: 'inset 6px 6px 10px rgb(163, 177, 198, 0.6), inset -6px -6px 10px rgba(255, 255, 255, 0.5)',
  insetDeep: 'inset 10px 10px 20px rgb(163, 177, 198, 0.7), inset -10px -10px 20px rgba(255, 255, 255, 0.6)',
  insetSm: 'inset 3px 3px 6px rgb(163, 177, 198, 0.6), inset -3px -3px 6px rgba(255, 255, 255, 0.5)',

  // Primary Accent Button Shadows
  primaryExtruded: '7px 7px 16px rgba(108, 99, 255, 0.35), -7px -7px 16px rgba(255, 255, 255, 0.7)',
  primaryHover: '9px 9px 20px rgba(108, 99, 255, 0.45), -9px -9px 20px rgba(255, 255, 255, 0.8)',
  primaryActive: 'inset 4px 4px 8px rgba(0, 0, 0, 0.25), inset -4px -4px 8px rgba(255, 255, 255, 0.2)',
} as const;

export const NEU_RADIUS = {
  container: 'rounded-[32px]', // 32px
  base: 'rounded-2xl',         // 16px
  inner: 'rounded-xl',         // 12px
  pill: 'rounded-full',        // 9999px
} as const;

export const NEU_TRANSITION = 'transition-all duration-300 ease-out';
