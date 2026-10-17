# BlockBridge AI — Design System & Visual Specification

> **Platform:** BlockBridge AI  
> **Tagline:** Find the support. Take the next step.  
> **Aesthetic Philosophy:** Warm civic editorial, human-centered, grounded in dignity, trustworthy public-interest craftsmanship.

---

## 1. Visual Brand Foundation

BlockBridge AI is designed to look like an editorial-grade, human-first public-interest platform designed by a high-end product studio. It explicitly avoids the cold, generic "AI SaaS dashboard" aesthetic (dark glassmorphism, neon purple glows, generic stock photos, or cluttered metric cards).

### Core Values
1. **Dignity First:** Tone is empowering, respectful, and transparent. We never use deficit framing, stigmatizing language, or presumptuous assumptions about users or neighborhoods.
2. **Actionable Clarity:** Information is structured into manageable, clear steps. We reduce cognitive load for users who may be stressed or short on time.
3. **Source Grounded & Honest:** Every resource displays its provenance, last verified date, and clear disclaimers. Uncertainty is highlighted rather than hidden.
4. **Calm, High-Contrast Editorial:** Ample whitespace, warm ivory and clean white surfaces, deep forest green primary accents, terracotta warmth, and high-readability typography.

---

## 2. Color Palette & CSS Variables

All color styles are anchored to CSS variables configured in `:root` and integrated directly into the Tailwind utility system.

```css
:root {
  /* Canvas & Surfaces */
  --bb-bg: #FAF8F3;          /* Warm Ivory page background */
  --bb-surface: #FFFFFF;     /* Pure White cards and modals */
  --bb-surface-soft: #F1F3EC;/* Muted sage-tinted neutral surface */
  --bb-surface-hover: #F6F5EE;

  /* Typography / Inks */
  --bb-ink: #202720;          /* Deep charcoal primary text (high contrast) */
  --bb-ink-muted: #626A63;    /* Muted slate secondary text */
  --bb-ink-subtle: #8A948C;   /* Placeholder and subdued notes */

  /* Brand Primary */
  --bb-brand: #246B52;        /* Forest green — primary actions & links */
  --bb-brand-hover: #18523F;  /* Deeper green for interactive hover/active */
  --bb-brand-soft: #DCEBE1;   /* Soft sage for active badges & highlights */
  --bb-brand-border: #BCD4C4;

  /* Accents */
  --bb-coral: #E98770;        /* Warm terracotta accent */
  --bb-coral-hover: #D7735C;
  --bb-coral-soft: #FBE7E0;   /* Light warm wash */
  --bb-butter: #F5E8B8;       /* Pale butter highlight for attention markers */
  --bb-butter-soft: #FCF7E6;

  /* Borders & Dividers */
  --bb-line: #E5E5DC;         /* Standard container border */
  --bb-line-strong: #D1CFBF;  /* Prominent borders / active inputs */

  /* Functional / Status Tokens */
  --bb-success: #237A4B;      /* Verified / Completed */
  --bb-success-soft: #E3F2E9;
  --bb-warning: #98651B;      /* Needs Re-verification / Pending */
  --bb-warning-soft: #FCF4E3;
  --bb-danger: #B33A3A;       /* Expired / Error */
  --bb-danger-soft: #FDE8E8;
  --bb-info: #315F91;         /* External Link / Informational */
  --bb-info-soft: #E9F1FA;

  /* Accessibility Focus */
  --bb-focus: #276EF1;        /* WCAG AA compliant focus outline */
}
```

### Contrast & Accessibility Rules
- Text on `--bb-bg` and `--bb-surface` must always achieve a minimum contrast ratio of **4.5:1** for normal text and **3:1** for large text (18pt+ or 14pt+ bold).
- Status must **never** be communicated via color alone: always pair status colors with an icon and readable text label (e.g., `[✓ Verified Source]`, `[! Needs Confirmation]`).

---

## 3. Typography & Hierarchy

### Font Families
- **Display Serif:** `DM Serif Display`, `Fraunces`, `Georgia`, serif.
  - Used for Hero headlines, editorial section titles, and page titles.
  - Conveys warmth, civic credibility, and timeless human craft.
- **Body & UI Sans:** `DM Sans`, `Inter`, -apple-system, BlinkMacSystemFont, sans-serif.
  - Used for body copy, form fields, navigation, buttons, and metadata.
  - Highly legible at small sizes on all screens.

### Type Scale
| Level | Font Family | Size (px / rem) | Line Height | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | DM Serif Display | `48px – 64px` (`3rem – 4rem`) | `1.1` | 400 | `-0.02em` | Homepage Hero Title |
| **Section H1** | DM Serif Display | `36px – 44px` (`2.25rem – 2.75rem`) | `1.2` | 400 | `-0.015em` | Page Headings, Feature Highlights |
| **Section H2** | DM Serif Display | `28px – 32px` (`1.75rem – 2rem`) | `1.25` | 400 | `0` | Subsections, Modal Headers |
| **H3 / Card Title** | DM Sans | `20px` (`1.25rem`) | `1.35` | 600 | `-0.01em` | Resource Titles, Task Titles |
| **Subtitle / Lead** | DM Sans | `18px – 20px` (`1.125rem – 1.25rem`)| `1.5` | 400 | `0` | Hero Subtitles, Narrative Intros |
| **Body Regular** | DM Sans | `16px` (`1rem`) | `1.6` | 400 | `0` | Main Copy, Descriptions, Steps |
| **Body Medium** | DM Sans | `16px` (`1rem`) | `1.5` | 500 | `0` | Emphasized content, List titles |
| **Small / Label** | DM Sans | `14px` (`0.875rem`) | `1.4` | 500 / 600 | `0.01em` | Form labels, Metadata, Table cells |
| **Caption / Eyebrow** | DM Sans | `12px` (`0.75rem`) | `1.3` | 700 | `0.08em` | Category tags, Eyebrow pills, Statuses |

---

## 4. Spacing, Radii, Borders & Elevation

### Spacing Scale
Uses standard 4px / 8px scale:
- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-6`: 24px
- `space-8`: 32px
- `space-12`: 48px
- `space-16`: 64px
- `space-20`: 80px

### Corner Radii
- **Cards & Modals:** `rounded-2xl` (`16px` – `20px`) for major cards; gives a warm, approachable character.
- **Buttons & Form Inputs:** `rounded-xl` (`10px` – `12px`) for tactile touch and click targets.
- **Badges & Pills:** `rounded-full` (`9999px`) for compact status markers.

### Borders & Shadows
- Use subtle, crisp single-pixel borders (`border border-[var(--bb-line)]`).
- Avoid heavy, muddy drop shadows. Use subtle ambient elevation:
  - `shadow-sm`: `0 1px 2px 0 rgba(32, 39, 32, 0.05)`
  - `shadow-md`: `0 4px 12px -2px rgba(32, 39, 32, 0.08), 0 2px 4px -2px rgba(32, 39, 32, 0.04)`
  - `shadow-lg`: `0 12px 24px -4px rgba(32, 39, 32, 0.10)`
  - Card hover effect: lift by `-2px` with a transition duration of `200ms ease-out`.

---

## 5. Core Component Design Rules

### Buttons
- **Primary Button:**
  - Background: `var(--bb-brand)` (`#246B52`)
  - Text: `#FFFFFF`, weight 600
  - Hover: `var(--bb-brand-hover)` (`#18523F`)
  - Focus: 2px ring `var(--bb-focus)` with 2px offset
  - Minimum touch target: 44px height
- **Secondary Button:**
  - Background: `var(--bb-surface)`
  - Border: `1px solid var(--bb-line)`
  - Text: `var(--bb-ink)`, weight 600
  - Hover: `var(--bb-surface-soft)`
- **Accent Button:**
  - Background: `var(--bb-coral)` (`#E98770`)
  - Text: `#FFFFFF`
  - Hover: `var(--bb-coral-hover)`
- **Outline / Ghost Button:**
  - Background: transparent
  - Text: `var(--bb-brand)` or `var(--bb-ink-muted)`
  - Hover: `var(--bb-brand-soft)` or `var(--bb-surface-soft)`

### Verification & Status Badges
Badges are critical for the trustworthiness of BlockBridge AI:
- **Verified Source:**
  - Background: `var(--bb-success-soft)`, Text: `var(--bb-success)`, Border: `#B7DEC6`, Icon: `CheckCircle2`
  - Label: `Verified Source`
- **Needs Confirmation:**
  - Background: `var(--bb-warning-soft)`, Text: `var(--bb-warning)`, Border: `#F1DFB4`, Icon: `HelpCircle`
  - Label: `Confirm with Provider`
- **Needs Re-verification (Stale):**
  - Background: `var(--bb-warning-soft)`, Text: `var(--bb-warning)`, Border: `#F1DFB4`, Icon: `Clock`
  - Label: `Verification Expired`
- **Demo Fixture:**
  - Background: `var(--bb-butter-soft)`, Text: `#6A5200`, Border: `var(--bb-butter)`, Icon: `Sparkles`
  - Label: `Demo Fixture • Sample Data`

### Resource Cards
Every resource card must follow a standardized information hierarchy:
1. **Header Row:** Category chip, Provider name, and Verification Status Pill.
2. **Title:** Program name in prominent semi-bold font.
3. **Summary:** 2-line plain language description.
4. **"Why this may fit":** 1-2 concise bullet points grounded in user criteria.
5. **Coverage & Location:** City/State/National pill with MapPin icon.
6. **Footer Row:** Official source link with external icon, Last verified date, and primary action (`Add to Plan` / `View Details`).

### Forms & Interactive Controls
- Inputs use `var(--bb-surface)` background, `var(--bb-line)` border, and minimum 44px height.
- Focus state has a clear blue ring (`var(--bb-focus)`).
- Error state shows an inline message linked via `aria-describedby` in red (`var(--bb-danger)`).
- Every input has a visible, persistent `<label>`.

### Modals & Dialogs
- Backdropped by a warm translucent overlay (`rgba(32, 39, 32, 0.4)` with light blur `backdrop-blur-sm`).
- Modal card has `bg-white`, `rounded-2xl`, and `max-w-xl`.
- Focus is trapped within modal; Escape key closes; clicking backdrop closes.

---

## 6. Layout & Grid Principles

### Breakpoints
- **Mobile Small:** `360px`
- **Mobile Standard:** `390px`
- **Tablet:** `768px` (`md:`)
- **Desktop:** `1024px` (`lg:`)
- **Large Desktop:** `1440px` (`xl:`, max width container `1280px` or `1360px`)

### Responsive Patterns
- **Hero:**
  - Desktop: 2-column split (Left: editorial copy & CTAs, Right: curated visual with overlapping sample product preview).
  - Mobile: Single column with stacked hierarchy; prominent CTA kept above the fold; visual scaled intentionally without overflowing.
- **Search & Results:**
  - Desktop: Left sidebar filters (w-72), right results feed.
  - Mobile: Horizontal category chips + expandable filter sheet/drawer.
- **Action Plan Tracker:**
  - Desktop: Progress overview card on left/top, task list with expandable details.
  - Mobile: Full width step cards with prominent status toggle pills.

---

## 7. Motion & Accessibility Standards

- **Transitions:** Snappy and subtle (`duration-200 ease-out`).
- **Motion Reduction:** Media query `@media (prefers-reduced-motion: reduce)` disables all transforms and animated shifts.
- **No Faux Animations:** No artificial delayed timers pretending an AI is "thinking" if the computation is already finished. Show honest skeleton states for real network calls.
- **Screen Reader Support:** All icon-only buttons include `aria-label`. All status badges include screen-reader accessible text.
