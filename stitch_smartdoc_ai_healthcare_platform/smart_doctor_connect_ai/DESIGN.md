---
name: Smart Doctor Connect AI
colors:
  surface: '#f7f9ff'
  surface-dim: '#d7dae0'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4fa'
  surface-container: '#ebeef4'
  surface-container-high: '#e5e8ee'
  surface-container-highest: '#dfe3e8'
  on-surface: '#181c20'
  on-surface-variant: '#414754'
  inverse-surface: '#2d3135'
  inverse-on-surface: '#eef1f7'
  outline: '#727785'
  outline-variant: '#c1c6d6'
  surface-tint: '#005bc0'
  primary: '#005bbf'
  on-primary: '#ffffff'
  primary-container: '#1a73e8'
  on-primary-container: '#ffffff'
  inverse-primary: '#adc7ff'
  secondary: '#006e2c'
  on-secondary: '#ffffff'
  secondary-container: '#86f898'
  on-secondary-container: '#00722f'
  tertiary: '#9e4300'
  on-tertiary: '#ffffff'
  tertiary-container: '#c55500'
  on-tertiary-container: '#0e0200'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc7ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#89fa9b'
  secondary-fixed-dim: '#6ddd81'
  on-secondary-fixed: '#002108'
  on-secondary-fixed-variant: '#005320'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb691'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#783100'
  background: '#f7f9ff'
  on-background: '#181c20'
  surface-variant: '#dfe3e8'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2.5rem
  xl: 4rem
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The brand personality is clinical yet accessible, blending high-tech AI capabilities with human-centric healthcare. This design system follows a **Corporate / Modern** aesthetic that prioritizes clarity, speed, and reliability. The visual language conveys competence and security, ensuring patients feel safe sharing sensitive data while doctors find the interface efficient and focused. Elements are balanced with generous whitespace to reduce cognitive load, essential for medical decision-making.

## Colors
The palette is rooted in medical trust.
- **Primary Blue (#1a73e8):** Used for primary actions, brand presence, and active states. It suggests intelligence and stability.
- **Success Green (#34a853):** Reserved specifically for "Available" status indicators, positive health trends, and confirmation actions.
- **Neutrals:** A range of grays from deep charcoal for text to a very light gray (#f8f9fa) for card surfaces and background sections.
- **White (#ffffff):** The primary background color to maintain a "clean room" feel and maximize readability.

## Typography
This design system utilizes **Manrope** for headings to provide a modern, slightly geometric tech-feel, while **Inter** is used for all body text and UI labels due to its exceptional legibility in data-dense environments.
- **Headings:** Bold and structured, using tighter letter-spacing on larger sizes to maintain a professional "editorial" look.
- **Body:** Standardized at 16px for optimal reading comfort.
- **Mobile Scaling:** For mobile devices, `display-lg` should scale down to 32px and `headline-lg` to 24px to prevent horizontal overflow.

## Layout & Spacing
The system uses a **Fixed Grid** model for desktop, centered within a 1280px container. 
- **Grid:** 12-column structure with 24px gutters.
- **Rhythm:** An 8px linear scale (using a 4px base) governs all padding and margins.
- **Mobile:** Transition to a fluid 4-column grid with 16px side margins. 
- **Logic:** Use `lg` (40px) spacing between major sections and `sm` (16px) for internal card padding to maintain a breathable, organized interface.

## Elevation & Depth
Depth is conveyed through **Ambient Shadows** rather than heavy borders. 
- **Level 0 (Flat):** Default background.
- **Level 1 (Low):** Standard cards. Use a subtle shadow: `0px 2px 8px rgba(0, 0, 0, 0.05)`.
- **Level 2 (Hover/Active):** Interactive elements on hover. Lift the element using a more pronounced shadow: `0px 8px 20px rgba(0, 0, 0, 0.08)` and a -2px Y-axis translation.
- **Overlays:** Modals and dropdowns use a high-elevation shadow with a 10% opacity black tint to separate from the clinical white background.

## Shapes
A **Rounded** shape language is applied consistently to soften the technical nature of the application. 
- **Cards:** Fixed at 12px border-radius to create a modern, friendly frame for medical content.
- **Buttons:** Follow a 8px (rounded-lg) radius.
- **Inputs:** 8px radius for a consistent form-entry experience.
- **Status Chips:** Full pill-shape (rounded-xl) to distinguish them from interactive buttons.

## Components

### Navigation & Footer
- **Navbar:** Height 72px, white background with a thin bottom border (#dadce0). 
  - **Left:** Logo "SmartDoc AI" in Primary Blue, Manrope Bold.
  - **Center:** Links (Home, Find Doctor, For Doctors) in Inter Medium, Neutral Gray. Active state uses Primary Blue with a 2px bottom indicator.
  - **Right:** Login (Ghost button) and Signup (Filled Primary button).
- **Footer:** Deep neutral background (#1a1f23) with white text. Includes site map, legal links, and a "Powered by AI" badge.

### Core Elements
- **Buttons:** Primary buttons use #1a73e8 with white text. Hover state shifts brightness by 10%. Smooth 200ms transitions on all hover states.
- **Cards:** Light gray background (#f8f9fa), 12px radius, Level 1 shadow. On hover, apply Level 2 shadow.
- **Available Status:** A green (#34a853) dot or pill with "Available" text in 12px Inter Bold.
- **Input Fields:** 1px border (#dadce0), focus state uses a 2px Primary Blue outline with 10% opacity blue glow.
- **Medical Chips:** Small tags for specialties (e.g., "Cardiology") using light blue backgrounds (#e8f0fe) and dark blue text.

### AI Indicators
- Elements generated or assisted by AI should feature a subtle gradient border or a small sparkle icon in the primary blue to denote "Smart" functionality.