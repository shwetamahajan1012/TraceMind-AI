---
name: TraceMind AI
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bcc9cd'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#869397'
  outline-variant: '#3d494c'
  surface-tint: '#4cd7f6'
  primary: '#4cd7f6'
  on-primary: '#003640'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#00687a'
  secondary: '#4fdbc8'
  on-secondary: '#003731'
  secondary-container: '#04b4a2'
  on-secondary-container: '#003f38'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#e79400'
  on-tertiary-container: '#563400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#71f8e4'
  secondary-fixed-dim: '#4fdbc8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system delivers a high-precision, diagnostic enterprise SaaS interface tailored for technical operators—lab managers, system administrators, and industrial maintenance engineers. The core visual narrative balances clinical rigor with high-speed intelligence: high information density without cognitive clutter. 

The aesthetic is anchored in **Modern Dark Enterprise Tech**, incorporating precision glassmorphism, crisp structural borders, and electric analytical accents. It evokes forensic authority, calm situational awareness during active failures, and scientific dependability. Interfaces prioritize telemetry legibility, structured causal graphs, and immediate hierarchy separation between passive historical telemetry, active diagnostics, and predictive root-cause insights.

## Colors

The color architecture is built for mission-critical dark interfaces:

- **Primary (`#06B6D4` / Electric Cyan)**: Signifies automated machine intelligence, predictive graph relations, telemetry pulses, and focused interaction states.
- **Secondary (`#14B8A6` / Technical Teal)**: Marks resolved incidents, validated counter-measures, steady telemetry feeds, and positive system health states.
- **Tertiary (`#F59E0B` / Signal Amber)**: Identifies warning zones, recurrence thresholds, pending remediation approvals, and medium-severity incident vectors. Complemented by Critical Crimson (`#EF4444`) strictly reserved for root failures, critical anomalies, and irreversible destructive actions.
- **Neutral Core (`#0F172A` / Midnight Slate)**: Grounded by a multi-tiered surface hierarchy (`#0B1120` base canvas, `#162032` intermediate containers, `#1E293B` raised cards, `#334155` crisp borders) maintaining WCAG AAA contrast for technical text and data grids.

## Typography

Typography drives diagnostic legibility. **Plus Jakarta Sans** provides geometric authority across section headers and high-level analytical dashboards. **Inter** handles narrative investigations, ticket timelines, and dense tabular data with neutral clarity. **JetBrains Mono** is enforced across system timestamps, error codes, IP coordinates, telemetry values, and status metadata to ensure optical column vertical alignment and unambiguous character differentiation.

## Layout & Spacing

The system runs on a strict 12-column adaptive grid:
- **Desktop (≥1280px)**: 12 columns with 24px (`1.5rem`) gutters and 32px (`2rem`) canvas margins. Side utility drawers and incident timeline panels anchor into persistent structural rails.
- **Tablet (768px - 1279px)**: 8 columns with 16px gutters; telemetry sidebars collapse into toggleable sheets or slide-over overlays.
- **Mobile (<768px)**: 4 columns with 12px (`0.75rem`) gutters and 16px (`1rem`) page margins. Data matrices reflow into stacked diagnostic cards.

Component internal padding uses consistent pairings: compact metadata controls use `space-xs` and `space-sm`, while analytical panels and operational dashboards default to `space-md` internally and `space-lg` between visual groupings.

## Elevation & Depth

Visual hierarchy does not rely on heavy drop shadows; rather, it uses chromatic surface stepping, semi-translucent backdrops, and inner perimeter glows:

1. **Canvas (Base Level)**: Solid `#0B1120` background.
2. **Surface Tier 1 (Containers/Sidebars)**: `#162032` with a 1px border of `#1E293B`.
3. **Surface Tier 2 (Interactive Cards & Datagrids)**: `#1E293B` backed with a 1px perimeter outline of `rgba(51, 65, 85, 0.6)`. On hover or active state, cards receive a subtle inner top edge illumination (`inset 0 1px 0 0 rgba(6, 182, 212, 0.3)`).
4. **Surface Tier 3 (Modals, Context Overlays, Investigatory Inspect Windows)**: `#0F172A` with 80% opacity, `backdrop-filter: blur(12px)`, an outer ambient drop shadow (`0 20px 25px -5px rgba(0, 0, 0, 0.5)`), and a subtle border ring in `#334155`.

## Shapes

The design system standardizes on calibrated rounded forms to soften data density while maintaining structural enterprise poise:
- Default elements (buttons, text fields, filter chips): `0.5rem` (8px).
- Standard analytical cards, diagnostic tables, and metrics widgets: `rounded-lg` at `1rem` (16px).
- Modals, large incident breakout modules, and outer surface panels: `rounded-xl` at `1.5rem` (24px).
- Status indicator pills, active system status badges, and telemetry tags: full capsule `pill-shaped` border radius.

## Components

### Buttons
- **Primary (AI / Action)**: Cyan gradient background (`linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)`), text in `#0B1120`, font weight 600. Glowing accent ring on focus (`0 0 0 2px rgba(6, 182, 212, 0.4)`).
- **Secondary (Neutral Surface)**: Dark slate `#1E293B`, crisp border in `#334155`, text in `#F8FAFC`. Hover brings border to `#06B6D4` with text transition.
- **Destructive**: Deep crimson surface tint (`rgba(239, 68, 68, 0.12)`), text in `#EF4444`, border `rgba(239, 68, 68, 0.3)`.

### Chips & Status Badges
- Pill-shaped capsular geometry with monospaced typography (`label-sm`).
- **Critical / Recurrence High**: Crimson text `#EF4444`, background `rgba(239, 68, 68, 0.1)`, 1px border `rgba(239, 68, 68, 0.25)`, pulsing status dot.
- **Warning / Medium Risk**: Amber text `#F59E0B`, background `rgba(245, 158, 11, 0.1)`, 1px border `rgba(245, 158, 11, 0.25)`.
- **Telemetry Steady / Resolved**: Teal text `#14B8A6`, background `rgba(20, 184, 166, 0.1)`, 1px border `rgba(20, 184, 166, 0.25)`.
- **AI Suggested Filter**: Cyan text `#38BDF8`, background `rgba(6, 182, 212, 0.08)`, border `rgba(6, 182, 212, 0.3)`.

### Form Inputs & Telemetry Fields
- Background `#162032` with a 1px border `#334155`. Height standardized at 40px with `space-md` horizontal padding.
- Focused state transitions border directly to `#06B6D4` with an ambient glow (`box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15)`).

### Cards & Analytical Panels
- Structural cards feature `#1E293B` fill, 16px corner radius, and 1px `#334155` border stroke. 
- Headers separate visually via a hairline divider (`#162032`). Internal card headers pair a title in `headline-sm` with a right-aligned telemetry pill or live status pulse.

### Incident Causal Node & Recurrence Tree
- Specialized interactive node components featuring dark slate capsules bordered by severity status tiers. 
- Branch links render as crisp 1.5px paths in `#334155` with animated SVG dash arrays marking real-time data tracing.