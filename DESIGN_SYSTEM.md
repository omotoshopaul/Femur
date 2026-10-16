# FEMUR Global Design System (Internal Reference Only — Non-Rendered)

## Brand & Product Context
FEMUR is an emergency-care coordination platform for Nigeria.
Four core services:
- FEMUR Locate: discover appropriate facilities and resources.
- FEMUR Verify: see confirmed capabilities and availability with last-confirmed timestamps.
- FEMUR Dispatch: connect requests to existing ambulance providers (subject to provider acceptance).
- FEMUR Assist: explore hospital-verified fundraising, sponsorship, NGO support, and optional regulated financing.

AI Emergency Navigator: helps users describe needs in plain language. Never diagnoses, never invents availability.

## Design Tokens
- `--green-900` (brand, headings, body text): `#0F3F24`
- `--green-950` (hover/pressed, deepest emphasis): `#0A2E19`
- `--green-600` (secondary text, muted labels): `#4F6B58`
- `--bg` (page): `#FDFDFB`
- `--surface` (cards, inputs): `#FFFFFF`
- `--surface-muted` (alternate sections): `#EEF3EC`
- `--border` (hairlines): `#CFDACF`
- `--accent-plum` (ONLY for check tiles and rare accents): `#3B1239`
- `--danger`: `#B42318`
- `--warning`: `#9A6700`
- `--success`: `#247447`
- `--info`: `#245B91`
- `--surface-sage-100` (bento headline panel): `#E1F2E0`
- `--surface-sky-300` (bento line-art panel): `#B6CFD6`
- `--surface-sage-300` (bento link panel): `#B0DAB8`
- `--on-green` (text on solid green): `#FFFFFF`

## Typography
- Headings: "Newsreader" (Google Fonts), weight 300–400, optical size auto, letter-spacing -0.02em to -0.03em, line-height 1.0–1.1.
- Interface/body: "DM Sans", weights 400/500/600.
- Fallbacks: Georgia, serif / system-ui, sans-serif.
- Operational items (forms, timestamps, counts, prices, statuses): strictly sans-serif.

## Layout & Rules
- 4px spacing scale. Max content width 1200px.
- Page gutters: 20px mobile / 40px tablet / 72px desktop.
- Section vertical spacing: 96–160px desktop, 64–96px mobile.
- Corner radius: 12px for buttons and cards, 8px for inputs/small tags, full-round only for status pills.
- Hairline 1px borders, no heavy drop shadows, no gradients.
- Mobile-first, minimum 44x44px touch targets.
- WCAG 2.2 AA compliant.
