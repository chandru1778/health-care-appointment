---
name: MediZap Clinical Intelligence
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1b1b1b'
  on-surface-variant: '#3c4a45'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#6c7a75'
  outline-variant: '#bbcac3'
  surface-tint: '#006b58'
  primary: '#006b58'
  on-primary: '#ffffff'
  primary-container: '#1abc9c'
  on-primary-container: '#004538'
  inverse-primary: '#4eddbb'
  secondary: '#006397'
  on-secondary: '#ffffff'
  secondary-container: '#5cb8fd'
  on-secondary-container: '#00476e'
  tertiary: '#006e26'
  on-tertiary: '#ffffff'
  tertiary-container: '#50bc60'
  on-tertiary-container: '#004716'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6ff9d6'
  primary-fixed-dim: '#4eddbb'
  on-primary-fixed: '#002019'
  on-primary-fixed-variant: '#005141'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#92ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#8dfa96'
  tertiary-fixed-dim: '#71dd7c'
  on-tertiary-fixed: '#002106'
  on-tertiary-fixed-variant: '#00531b'
  background: '#fcf9f8'
  on-background: '#1b1b1b'
  surface-variant: '#e5e2e1'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 38px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  title-card:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-base:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-badge:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 1.5rem
  margin-sm: 1rem
  margin-lg: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes a clinical-grade, modern minimalist experience tailored for rapid, stress-free healthcare discovery and appointment scheduling. The visual tone is engineered to project clinical precision, instantaneous efficiency, and welcoming empathy. The interface eliminates cognitive strain for patients navigating high-stress medical decisions while empowering clinical providers with crisp, data-dense clarity.

Drawing inspiration from high-end diagnostic interfaces and contemporary healthtech minimalism, the design language relies on expansive white space, luminous turquoise accents, structural grid alignment, and micro-interactions that feel responsive yet calm. Avoid visual noise, decorative gradients, or heavy skeumorphic textures. Depth is expressed through subtle atmospheric separation, soft outlines, and calculated surface shifts.

## Colors

The palette balances precision clinical tones with approachable optimism:

- **Primary (`#1ABC9C` - Soft Turquoise):** Anchors primary brand actions, active filters, vital confirmation states, and key navigational highlights. Radiates cleanliness and forward-looking care.
- **Secondary (`#3498DB` - Clinical Blue):** Designates informational architecture, specialty navigation, tertiary links, and patient record data indicators.
- **Tertiary (`#24963F` - Success Emerald):** Reserved strictly for booking confirmation badges, real-time doctor availability indicators, telemedicine readiness, and verified provider marks.
- **Neutral Dark (`#1C1C1C` - Slate Charcoal):** Applied to high-contrast headlines and structural typography to ensure crisp readability without the harshness of pure black.
- **Surface & Structural Neutrals:**
  - Background Base: `#FFFFFF` (Pure pristine white)
  - Surface Muted: `#F9FAFB` (Soft backings for secondary cards, table headers, and form inputs)
  - Border Subdued: `#E5E7EB` (Subtle cool grey dividing lines and card perimeters)
  - Text Muted: `#6B7280` (Secondary body descriptions, metadata, and timestamps)

## Typography

The typography leverages Plus Jakarta Sans across all roles to achieve a geometric, ultra-clean aesthetic that mirrors clinical precision and contemporary digital health interfaces.

Headlines employ strong weights (`600` and `700`) with tight letter-spacing to command authority and readability during urgent triage or rapid discovery. Body styles are strictly locked to `14px` for general UI data and `16px` for long-form medical guidance to sustain legibility across all clinical demographics. Badge and category labels utilize uppercase tracking and `600` weight to deliver high-contrast glanceability on busy provider directories.

## Layout & Spacing

This design system uses a strict 12-column responsive fluid grid designed around high-density search results and structured scheduling flows:

- **Desktop (1200px+):** 12-column layout with 24px (`gutter`) to 32px (`gutter-lg`) gutters and outer canvas margins of 48px (`margin-lg`). Doctor and hospital listings render in a balanced 3-column configuration (`span-4` per card).
- **Tablet (768px - 1199px):** 8-column layout with 16px (`gutter-sm`) to 24px (`gutter`) gutters and 24px (`margin`) margins. Cards collapse gracefully into a 2-column pattern (`span-4` per card).
- **Mobile (< 768px):** 4-column layout with 16px gutters and 16px (`margin-sm`) margins. Cards, modal sheets, and action controls collapse to full-width spans (`span-4`).

Use the `space-*` scale rigorously for internal component padding, metadata separation, and vertical component flow to maintain optical rhythm.

## Elevation & Depth

Visual hierarchy is maintained via micro-elevation shadows and subtle cool grey boundaries rather than dramatic blurs or heavy drop shadows:

- **Flat/Ground Tier:** Background `#FFFFFF` and muted blocks `#F9FAFB` bound by a 1px border of `#E5E7EB`.
- **Card Tier (Resting):** Bounded by 1px `#E5E7EB` with a soft ambient shadow: `0 1px 3px 0 rgba(28, 28, 28, 0.04), 0 1px 2px -1px rgba(28, 28, 28, 0.03)`.
- **Card Tier (Hover/Interactive):** Subtle upward shift with enhanced ambient spread: `0 8px 20px -4px rgba(28, 28, 28, 0.08), 0 4px 6px -2px rgba(28, 28, 28, 0.02)` and border color transitioning to `#1ABC9C33`.
- **Floating Modals & AI Widget Tier:** Elevates overlays, bottom sheets, and the AI prompt trigger using an intentional clinical glow: `0 12px 32px -6px rgba(28, 28, 28, 0.12), 0 4px 12px -2px rgba(28, 28, 28, 0.04)`.

## Shapes

The shape system is set to Rounded (`level 2`), defining an 8px (`0.5rem`) baseline for controls and interactive surfaces:

- **Standard Cards & Modal Sheets:** Use `rounded-lg` (`1rem` / 16px) to match the soft-card aesthetic and convey modern hospitality.
- **Category Icon Containers & Floating Action Buttons:** Circular (`rounded-full`) to create organic balance against geometric card layouts.
- **Badges, Chips, and Time Slots:** Rounded pill styles (`rounded-full`) to communicate clickable ease and diagnostic clarity.
- **Form Fields & Action Buttons:** Use 8px (`0.5rem`) for crisp architectural alignment.

## Components

### Buttons
- **Primary CTA:** Background `#1ABC9C`, text `#FFFFFF`, font `label-md`, radius 8px, padding `12px 20px`. Hover transitions to `#16A085` with subtle micro-scale.
- **Secondary Action:** White background with 1px `#3498DB` border, `#3498DB` label. Hover activates a faint tint of `#3498DB0D`.
- **Ghost/Tertiary:** No border, transparent background, text `#1C1C1C`, hover tint `#F9FAFB`.

### Badges & Chips
- **Status Pills:** Fully rounded (`rounded-full`), `label-badge` font, padding `4px 10px`.
  - *Available Today:* Pale emerald background (`#24963F14`) with `#24963F` text and an active green pulsing dot indicator.
  - *Telehealth / Fast Track:* Soft turquoise tint (`#1ABC9C14`) with `#1ABC9C` text.
  - *Specialty Category:* Soft blue tint (`#3498DB14`) with `#3498DB` text.
- **Interactive Time-Slot Chips:** Surface `#FFFFFF`, border 1px `#E5E7EB`, text `#1C1C1C`. Selected state switches to fill `#1ABC9C`, text `#FFFFFF`, border `#1ABC9C`.

### Cards (Doctor & Hospital)
- **Container:** Background `#FFFFFF`, border 1px `#E5E7EB`, radius 16px (`rounded-lg`), padding 20px (`space-lg`).
- **Structure:**
  - Header: 64px rounded doctor portrait or facility logo flanked by category pill and rating badge.
  - Body: Doctor name in `title-card`, medical specialty in `body-sm` (`#6B7280`), followed by a 1px divider and key hospital affiliation.
  - Footer: Next available opening slot in `caption` with a direct "Book Now" primary mini-CTA button.

### Category Icon Circles
- 56px circular surface with muted background (`#F9FAFB`), subtle hover shift to light turquoise tint (`#1ABC9C1A`). Encloses a 24px medical line icon colored in `#1ABC9C` or `#3498DB`.

### Input Fields & Search Triage
- Background `#F9FAFB`, border 1px `#E5E7EB`, radius 8px, padding `12px 16px`. Placeholder text in `#9CA3AF`.
- Focus state switches background to `#FFFFFF`, border color to `#1ABC9C`, and introduces a 2px outer ring in `#1ABC9C26`.

### Interactive Modal Sheets
- **Desktop Modal:** Centered dialog, radius 16px, background `#FFFFFF`, padded with 32px (`space-xl`), framed by micro-elevation tier.
- **Mobile Bottom Sheet:** Anchored to bottom viewport, upper corners rounded at 16px (`rounded-t-lg`), with a centralized drag handle (`36px x 4px`, `#E5E7EB`).

### Floating AI Assistant Widget
- Persistent in bottom-right corner (24px offset).
- Composed of a 56px circular button in `#1ABC9C` with white diagnostic glyph, accompanied by an expandable conversational drawer surfaced in `#FFFFFF`, with 16px radius, micro-elevation, and streaming recommendation chips.