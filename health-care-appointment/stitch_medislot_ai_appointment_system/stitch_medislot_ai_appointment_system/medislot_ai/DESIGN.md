---
name: MediSlot AI
colors:
  surface: '#f9f9fa'
  surface-dim: '#dadadb'
  surface-bright: '#f9f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeef'
  surface-container-high: '#e8e8e9'
  surface-container-highest: '#e2e2e3'
  on-surface: '#1a1c1d'
  on-surface-variant: '#4c4637'
  inverse-surface: '#2f3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#7d7765'
  outline-variant: '#cfc6b2'
  surface-tint: '#715c00'
  primary: '#715c00'
  on-primary: '#ffffff'
  primary-container: '#ffe17c'
  on-primary-container: '#786303'
  inverse-primary: '#e1c563'
  secondary: '#59605a'
  on-secondary: '#ffffff'
  secondary-container: '#dde5dc'
  on-secondary-container: '#5f6660'
  tertiary: '#53615e'
  on-tertiary: '#ffffff'
  tertiary-container: '#d7e6e2'
  on-tertiary-container: '#596764'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe17c'
  primary-fixed-dim: '#e1c563'
  on-primary-fixed: '#231b00'
  on-primary-fixed-variant: '#554500'
  secondary-fixed: '#dde5dc'
  secondary-fixed-dim: '#c1c8c0'
  on-secondary-fixed: '#161d18'
  on-secondary-fixed-variant: '#414943'
  tertiary-fixed: '#d7e6e2'
  tertiary-fixed-dim: '#bbcac6'
  on-tertiary-fixed: '#111e1c'
  on-tertiary-fixed-variant: '#3c4a47'
  background: '#f9f9fa'
  on-background: '#1a1c1d'
  surface-variant: '#e2e2e3'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.04em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 22px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '800'
    lineHeight: 12px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an unapologetic Neo-Brutalist visual language calibrated for high-velocity medical and clinical appointment scheduling. By merging brutalist structural clarity with modern enterprise utility, it eliminates the sterile, timid conventions of legacy healthcare software. 

### Core Ethos
- **High-Velocity Clarity:** Medical booking demands instantaneous decision-making. Information is enclosed in bold geometry with absolute boundaries, eliminating ambiguity.
- **Controlled Tactility:** Physical metaphors via hard unblurred drop-shadows and tactile click offsets provide immediate physical feedback that critical actions (rescheduling, booking, triaging) have registered.
- **Constructive Utility:** Heavy black line work, high-contrast primary accents, and structured data blocks evoke the reliability of physical medical clipboards, reimagined as a cutting-edge clinical AI engine.

### Design Principles
1. **Zero Ambiguity:** Borders are strictly opaque and structural (`2px` or `3px` solid `#000000`). No diffuse glows, no gradient overlays, no feathered glass.
2. **Definitive Grounding:** Depth is conveyed exclusively through discrete, offset hard shadows (`4px 4px 0px` and `8px 8px 0px`), creating a layered architectural stack.
3. **Intentional Friction:** Interactive targets have defined physical states that press into the surface on interaction, reinforcing intent and confidence.

## Colors

The palette balances clinical legibility with raw graphic punch. It employs high-contrast primary surfaces contrasted against architectural charcoal and muted sage undertones.

### Color Roles
- **Primary Accent (`#ffe17c`):** High-energy electric yellow. Reserved for primary booking triggers, pending availability slots, key status highlights, and active micro-badges. When used across hero cards or large banners, it pairs with subtle black dot patterns (`#000000` at 12% opacity, 12px grid).
- **Background Charcoal (`#171e19`):** Deep blackened pine/charcoal. Used for persistent primary navigation sidebars, high-priority system alerts, schedule headers, and administrative command bars. Text on charcoal surfaces is strictly `#ffffff` or `#ffe17c`.
- **Accent Sage (`#b7c6c2`):** Calming, clinical secondary tone. Applied to metadata containers, historical slot logs, secondary filters, and tertiary pill badges to balance the high-saturation yellow.
- **Canvas Neutral (`#f4f4f5`):** The default application workspace background. Provides a crisp foundation that lets pure white surfaces pop against black borders.
- **Surface White (`#ffffff`):** Dedicated to appointment cards, calendar day grids, data inputs, and flyout sheets.
- **Structural Black (`#000000`):** Defines all component outlines, hard drop-shadows, typographic hierarchies, and structural dividers. Never softened or alpha-blended on core boundaries.

## Typography

Typographic hierarchy relies on extreme contrast between heavyweight geometric headings and functional, highly legible sans-serif body copy.

### Heading Hierarchy
- Set in **Plus Jakarta Sans** with aggressive weights (`700` and `800`) and tight letter-spacing (`-0.01em` to `-0.04em`). This produces the compact, industrial punch characteristic of modern Neo-Brutalism.
- Display sizes are reserved for calendar metrics, appointment counts, and primary system metrics.

### Body & Data
- Set in **Inter** using a foundational weight of `500` (Medium). Neo-Brutalist layouts overpower standard `400` weight copy; medium weight ensures clinical notes, patient names, and scheduling parameters retain weight alongside thick borders.

### Labels & Badges
- Set uppercase or small-caps in **Plus Jakarta Sans** (`700`/`800`) with positive letter-spacing (`0.02em` to `0.06em`) to ensure instant legibility on micro-tags, status pills, and time stamps.

## Layout & Spacing

The layout is built upon an uncompromising, rigid 12-column grid. Visual structure is exposed rather than hidden, using explicit margins and column gutters to create visible separation between operational blocks.

### Grid & Breakpoints
- **Desktop (1200px+):** 12-column fluid grid, `2rem` outer margins, `1.5rem` gutters. Appointment streams and doctor schedules occupy multi-column lanes.
- **Tablet (768px - 1199px):** 8-column grid, `1.5rem` margins, `1rem` gutters. Side panels compress into sliding drawer trays.
- **Mobile (< 768px):** 4-column grid, `1rem` outer margins, `1rem` gutters. Cards snap to 100% width; horizontal shadow offsets reduce to `3px 3px 0px` to prevent viewport clipping.

### Spatial Rhythm
- Components strictly conform to an 8px spatial step. Spacing around interactive cards ensures that hard drop-shadows never overlap adjacent interactive targets or clipping masks.

## Elevation & Depth

This design system avoids soft, blurred Gaussian drop shadows. All spatial elevation is achieved through mechanical, hard-edge black offsets and surface color blocking.

### Elevation Layers
1. **Level 0 (Flat / Embedded):** `border: 2px solid #000000; box-shadow: none;`
   - Used for inactive input fields, table cell divisions, and subtle metadata blocks.
2. **Level 1 (Resting Cards & Interactive Elements):** `border: 2px solid #000000; box-shadow: 4px 4px 0px #000000;`
   - Standard resting state for appointment cards, standard buttons, dropdown menus, and quick-filter chips.
3. **Level 2 (Promoted / Active / Modals):** `border: 3px solid #000000; box-shadow: 8px 8px 0px #000000;`
   - Active drag targets, triage alert banners, datepicker overlays, and modal dialogues.

### Interactive Offset Physics
- **Hover:** Elements at Level 1 translate `-2px, -2px` and increase shadow to `6px 6px 0px #000000`.
- **Active / Pressed:** Elements translate `+4px, +4px` down-right while reducing shadow to `0px 0px 0px #000000`. The element physically depresses flush against the canvas.

## Shapes

The design system uses a constrained roundedness strategy capped at a maximum of `12px` (level 2 tokens adjusted for Neo-Brutalist containment). Fully round shapes are restricted to indicator dots and utility badges.

### Corner Radius System
- **Core Elements (`rounded` / 8px):** Standard buttons, text fields, appointment cards, dialog headers.
- **Compound Containers (`rounded-lg` / 12px):** High-level view wrappers, main calendar views, modals.
- **Strict Exception (Sharp / 0px):** Data tables, time-slot selection matrices, and administrative grid lists use `0px` to preserve clinical precision.
- **Pill Form (9999px):** Applied exclusively to micro-status indicators (e.g., "CONFIRMED", "AI PENDING", "URGENT") which retain a mandatory `2px solid #000000` boundary.

## Components

### Buttons
- **Primary Action (Book Slot, Confirm, AI Optimize):** Background `#ffe17c`, `2px solid #000000`, `4px 4px 0px #000000`, text `#000000`, font weight `700`, radius `8px`. Active state translates `+4px, +4px` with zero shadow.
- **Secondary Action (Reschedule, View Details):** Background `#ffffff`, `2px solid #000000`, `4px 4px 0px #000000`, text `#000000`. Active state mirrors the primary button translation.
- **Destructive (Cancel Slot):** Background `#ffffff`, `2px solid #000000`, `4px 4px 0px #000000`, text `#000000`. Hover turns background `#ff6b6b`.

### Cards & Panels
- **Appointment Card:** Background `#ffffff`, `2px solid #000000`, `4px 4px 0px #000000`, radius `10px`, padding `space-md`. Top-right displays an absolute status tag.
- **AI Highlight Card:** Background `#ffe17c` with a subtle repeating dot pattern (`#000000` dots, 2px size, 12px repeat), `3px solid #000000`, `8px 8px 0px #000000`, radius `12px`.

### Inputs & Selection Controls
- **Input Fields:** Background `#ffffff`, `2px solid #000000`, `box-shadow: 2px 2px 0px #000000`, radius `8px`. On focus: `box-shadow: 4px 4px 0px #000000`, outline: none, border-color `#000000`.
- **Checkboxes & Radios:** `20px x 20px`, `2px solid #000000`, background `#ffffff`, radius `4px` (checkbox) or `50%` (radio). When checked: Background `#ffe17c` with an unapologetic `2px` black tick or centered black dot. Hard shadow `2px 2px 0px #000000`.

### Chips & Filter Tags
- **Filter Chip:** Background `#ffffff`, `2px solid #000000`, radius `9999px`, padding `0.25rem 0.75rem`. Active state switches background to `#171e19` and text to `#ffe17c`.
- **Metadata Tag:** Background `#b7c6c2`, `1.5px solid #000000`, radius `4px`, font size `11px`, bold uppercase typography.

### Specialized Scheduling Components
- **Time Slot Selector Matrix:** A grid of sharp tiles (`0px` radius). Inactive: `#ffffff` background with `1.5px` border. Hover: `#b7c6c2`. Selected: `#ffe17c`, `2px solid #000000`, shadow `3px 3px 0px #000000`.
- **AI Recommendation Badge:** High-contrast pill tag (`rounded-full`), `#171e19` background, `#ffe17c` text, bordered by `2px solid #000000`, featuring a small yellow sparkle icon.