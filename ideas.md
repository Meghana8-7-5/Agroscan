# AgroScan Design Direction

## Three stylistic approaches

### Theme Name: Field Notes
**Very Brief Intro:** A warm agrarian editorial system that treats crop care as practical field intelligence: soft paper tones, botanical green, and clear wayfinding. It feels trustworthy, grounded, and quietly premium.
**Probability:** 0.07

### Theme Name: Sunlit Utility
**Very Brief Intro:** A bright, optimistic utility interface built around daylight, sky blue, harvest yellow, and generous tap-friendly controls. It feels friendly and approachable for first-time digital users.
**Probability:** 0.03

### Theme Name: Night Scout
**Very Brief Intro:** A dark, high-contrast field-monitoring system with luminous crop signals and radar-like data accents. It feels focused and operational, but is less suitable for a low-literacy, daylight-first audience.
**Probability:** 0.08

## Chosen approach: Field Notes

### Design Movement
Modern agrarian editorial design with Swiss-inspired wayfinding, documentary field photography, and a tactile paper-and-ink sensibility.

### Core Principles
1. **Clarity before cleverness:** Every action is labeled, legible, and comfortably tappable; icons support words rather than replacing them.
2. **Field intelligence, not dashboard noise:** Information is organized as calm, editorially spaced modules with visible hierarchy and short, useful sentences.
3. **Warm trust:** Natural textures, botanical colors, and quiet depth make the experience feel human and dependable rather than clinical.
4. **Progress feels tangible:** Detection, recommendations, and crop tasks use small visual signals that show movement without overwhelming the farmer.

### Color Philosophy
AgroScan uses forest green as an ownable signal for healthy action and confidence, anchored by warm oat paper for approachability. Deep ink provides strong contrast for low-literacy readability; clay and pale sky appear sparingly as status and environmental accents. The palette should feel like a field journal: natural, calm, and useful under bright daylight.

### Layout Paradigm
Use an asymmetric editorial frame instead of a centered marketing grid. The Landing page opens with a two-column hero: a narrow narrative rail and a large image field with a floating result card. Supporting features sit in a staggered horizontal band, while authenticated screens use a persistent left rail on desktop and a compact bottom navigation on mobile. Modules should align to a visible vertical rhythm, not identical card widths.

### Signature Elements
- Fine contour-line and seed-mark details used as background texture and section dividers.
- Soft oat panels with ink-green labels that resemble field-note annotations.
- A rounded leaf-notch symbol that appears in the logo, active states, and key call-to-action icons.

### Interaction Philosophy
Interactions should reassure rather than surprise. Buttons visibly press down, cards lift slightly on hover, and status changes use a short, calm transition. Every icon-led action also carries a text label. Placeholder features show a clear “Coming soon” explanation instead of behaving like broken links.

### Animation
Use 160–240ms ease-out transitions for buttons, navigation states, and cards. On first load, reveal the hero copy and image in a gentle 40px-to-0 vertical settle, then stagger feature badges by 60ms. Float the detection card by 4px over 4.5s with a paused, respectful rhythm; disable decorative movement when `prefers-reduced-motion` is enabled. Avoid bouncing, flashing, or excessive parallax.

### Typography System
Use **Fraunces** for display headlines and key editorial numerals; its soft serif forms connect the product to printed field notes. Use **Manrope** for body copy, navigation, forms, and buttons for clean screen readability. Headlines are compact, slightly tight, and sentence-cased; body copy is 16px minimum with 1.55 line-height. Labels use 11–12px uppercase tracking only for metadata, never for primary actions.

### Brand Essence
AgroScan is a lightweight crop-care companion for farmers who need a clear next step from a single leaf photo, without subscriptions or app installs. **Personality:** grounded, encouraging, practical.

### Brand Voice
Headlines are direct and hopeful; CTAs are action-oriented and specific; microcopy explains what happens next in plain language. Avoid hype, jargon, and generic filler.

Example headline: “Spot the problem while the crop can still recover.”

Example CTA: “Scan a leaf and see your next step.”

### Wordmark & Logo
The mark is a simple, bold leaf silhouette with a small scan notch cut into its upper edge, suggesting both plant health and image recognition. Pair the mark with a custom wordmark that uses a slightly softened lowercase “g” and an open counter in the “a”; never render the brand name as an unmodified default font logo.

### Signature Brand Color
**Scan Green — #2F6B45**, a deep botanical green that reads as confident and calm against warm oat surfaces.

## Style Decisions
- Use documentary crop imagery with light, breathable framing and enough negative space for readable copy.
- Keep green reserved for actions, healthy states, and selected navigation; do not flood every surface with green.
- Prefer warm oat backgrounds and deep ink text over pure white wherever a surface can carry texture.
- Use softly rounded containers, but vary corner emphasis so the interface does not feel like a uniform card grid.
- Keep all interaction labels explicit for farmers with minimal digital literacy.

- The leaf-notch mark is the recurring AgroScan motif in the brand mark and primary scan action.
- Lower-page modules use varied proportions, annotation labels, and field-note rhythm instead of equal card tiles.
- Headlines and CTAs describe a concrete crop-care action or outcome, not a generic product promise.
