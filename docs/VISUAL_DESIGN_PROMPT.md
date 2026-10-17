# BlockBridge AI --- Visual Excellence & Build Workflow Prompt for Antigravity

## Read this first

Read `docs/PRD.md` fully before coding. The PRD defines product
behavior; this document defines visual quality and implementation
workflow. Inspect the repository and preserve working code. Do not
rebuild blindly.

## Mission

Build a visually outstanding, trustworthy, warm, modern, responsive
civic-tech website that looks like a product designed by a professional
product studio---not a generic AI template, school project, plain admin
dashboard, or collection of identical cards.

Do not stop at a plan or mockup. Implement the website, connect its real
core workflow, run it, test it, and refine it.

## Mandatory workflow

1.  Inspect repository, framework, routes, styles, assets, existing
    functionality, and package manager.
2.  Read `docs/PRD.md`; write `docs/UI_IMPLEMENTATION_CHECKLIST.md`.
3.  Create `docs/DESIGN_SYSTEM.md` before styling pages.
4.  Build and refine the complete landing page first, checking desktop
    and mobile layouts.
5.  Apply the same design quality to resource discovery, resource
    details, action plans, dashboard, and authentication.
6.  Run the app and inspect the rendered result using available
    preview/browser tools. If screenshots are available, capture and
    inspect them. Never claim to have visually inspected something if
    you did not.
7.  Run lint, type-check, tests, and production build. Fix errors,
    broken links, broken images, layout overflow, inconsistent spacing,
    and console errors.
8.  Report exact setup commands, configuration, tests/build results, and
    any honest limitations.

Do not stop after creating the homepage. Do not ask me to approve every
small visual decision. Make confident, coherent design decisions.

------------------------------------------------------------------------

# 1. Brand and visual direction

**Name:** BlockBridge AI\
**Tagline:** Find the support. Take the next step.\
**Personality:** human, trustworthy, community-centered, optimistic,
capable, calm, inclusive, action-oriented.

The visual direction should combine modern public-interest technology,
editorial typography, premium product craft, and approachable community
service. Avoid the generic "AI SaaS template" look.

## Color system

Use CSS variables and apply tokens consistently:

``` css
:root {
  --bb-bg: #FAF8F3;
  --bb-surface: #FFFFFF;
  --bb-surface-soft: #F1F3EC;
  --bb-ink: #202720;
  --bb-ink-muted: #626A63;
  --bb-brand: #246B52;
  --bb-brand-hover: #18523F;
  --bb-brand-soft: #DCEBE1;
  --bb-coral: #E98770;
  --bb-coral-soft: #FBE7E0;
  --bb-butter: #F5E8B8;
  --bb-line: #E5E5DC;
  --bb-success: #237A4B;
  --bb-warning: #98651B;
  --bb-danger: #B33A3A;
  --bb-info: #315F91;
  --bb-focus: #276EF1;
}
```

Keep most surfaces warm ivory and white; use deep green for primary
actions, sage for supportive surfaces, and coral/butter sparingly. No
default purple-blue AI gradients, no entire dark dashboard, no random
colors per page, no excessive shadows, and no giant blurred blobs. Never
rely on color alone to communicate status.

## Typography and layout

-   Display headings: **DM Serif Display** or **Fraunces**.
-   Body/UI: **DM Sans** or **Inter**.
-   Use a confident, readable editorial type scale, clear hierarchy,
    comfortable line lengths, and consistent spacing.
-   Use a responsive max-width container and a consistent grid.
-   Major cards: 14--22px radius; controls: 10--14px radius.
-   Use subtle borders and shadows only where useful.
-   Avoid nested cards, overused pills, excessive glassmorphism, and
    identical three-card grids in every section.
-   Use Lucide icons consistently.
-   Add focus, hover, pressed, disabled, loading, and error states to
    interactive elements.

------------------------------------------------------------------------

# 2. Images and art direction --- required

The website must not feel empty or text-only. Use a small, coherent set
of high-quality visuals with a warm, natural-light editorial look.

Use relevant, respectful photography or custom illustrations depicting
community collaboration, neighborhood small-business owners, local
storefronts, mentoring, and community services. Avoid stereotypical
poverty imagery, exploitative imagery, generic robot/AI brain pictures,
irrelevant stock photography, and unverified partner logos.

Rules: - Include a large hero visual featuring community or
small-business life. - Include at least one image-led community/business
section. - Include a meaningful visual in the "How it works" or product
showcase section. - Build an actual product preview UI showing a
resource recommendation and action checklist; label sample data
clearly. - Resource cards should use small thumbnails only when helpful;
otherwise use a consistent icon system. - Prefer local, stable, licensed
assets or a reliable image source. Do not use fragile URLs without
fallbacks. - Every image must load; broken image icons are
unacceptable. - Use `object-fit: cover`, intentional crops, responsive
sizes, optimized files, and appropriate alt text. - If images cannot be
sourced, create a polished original SVG or CSS illustration rather than
silently omitting imagery. - Do not imply that a pictured person is an
actual user, beneficiary, partner, or local resident unless verified.

------------------------------------------------------------------------

# 3. Landing page --- art-directed, not templated

Build these sections with varied layouts and clear visual rhythm. Do not
make every section a heading followed by three cards.

## A. Navigation

Brand wordmark "BlockBridge" with a simple bridge/connection mark; links
to How it works, Explore resources, For organizations; primary CTA "Find
support". Working mobile menu. Align the header to the main content
grid.

## B. Hero --- first-screen impact

Create a split editorial hero: - Small eyebrow: "COMMUNITY SUPPORT, MADE
ACTIONABLE". - Large headline: "Find the support. Take the next step." -
Highlight a short phrase with brand green or a restrained accent. -
Plain-language supporting paragraph. - Primary CTA "Find support";
secondary CTA "Explore the demo". - Reassurance line: "Source-backed
resources. Clear next steps. No guesswork." - On the other side, a
large, compelling community/business image with a restrained overlapping
product-preview panel. The preview should show a sample resource,
source/verification badge, and short action checklist; label it "Sample
preview". - Make the composition feel custom designed---not an image
casually placed next to text. - On mobile, recompose intentionally, keep
the CTA prominent, and prevent the image from dominating the screen.

## C. Trust strip

Three concise principles with restrained icons: official sources where
available; unknown eligibility clearly identified; practical next-step
plan. No fabricated impact numbers, testimonials, or partner logos.

## D. Two pathways

Create two visually distinct pathways: "I need support" for residents
and "I'm growing a small business" for business owners. Use coordinated
but different layouts, concise descriptions, and clear CTAs.

## E. How it works

Use a connected process/illustration, not four identical cards: 1. Tell
us what you need. 2. Explore relevant, source-backed resources. 3.
Understand what to confirm. 4. Build a plan and track next steps.

## F. Product showcase

Show a believable, attractive resource recommendation with provider,
category, source/verification status, "Why it may fit", and "What to
confirm". Pair it with an action checklist and progress indicator. Use
labelled demo content.

## G. Community/business feature

Image-led split section with a different composition from the hero.
Explain how the platform supports small businesses and communities.

## H. Community partner section

A quieter contrasting surface explaining how organizations can suggest
resources and corrections. Do not claim that any organization is already
a partner.

## I. Responsible AI and verification

Use an editorial layout to explain: sources are shown; stale information
is flagged; AI organizes information but does not guarantee eligibility;
users can report outdated details. Show example source badges rather
than vague marketing claims.

## J. Final CTA

A memorable but restrained section with one strong headline, primary
action, and a simple sentence that lowers the barrier to starting.

## K. Footer

Functional links to resources, how it works, partner information,
resource standards, privacy, terms, feedback, plus the PRD disclaimer.

No fake testimonials, invented partners, fabricated user counts, or
unverified impact statistics.

------------------------------------------------------------------------

# 4. Core app screens must match the same quality

## Dashboard

Human, calm, and useful---not a generic admin template. Include a clear
"Find support" action, active plans, saved resources, and next steps
based on actual data. Do not invent activity. Provide helpful empty
states.

## Search/results

Prominent search/intake panel; accessible filters (sidebar desktop,
drawer mobile); readable results; provider, category, coverage,
verification status, and "Why this may fit" summary. Show source and
last-checked date clearly. Include no-results and broaden-search states.

## Resource detail

Strong title/provider hierarchy; official source CTA; eligibility and
required documents; separate "What we know" and "What to confirm";
save/add-to-plan actions; report-an-issue action; relevant disclaimer.

## Action plan

Show the user's goal, next best action, accessible checklist/timeline,
task statuses, source links, editable steps, and honest confirmation
messages based on actual backend responses.

## Authentication

Polished, branded login/register/forgot-password pages. Proper labels,
validation, password visibility toggle, loading state, server errors,
and accessible focus. Use real authentication when configured. Never
fake successful login. If credentials are missing, provide a clearly
labelled demo route that cannot be mistaken for a real account.

------------------------------------------------------------------------

# 5. Animation and interaction

Use subtle, purposeful motion: - Gentle hero entrance (opacity + small
vertical movement). - Small button hover/pressed transitions. -
Restrained image zoom and card elevation on hover. - Smooth mobile
menu/filter drawer. - Progress animation only when a real workflow stage
changes. - Skeletons for real network loading. - Satisfying but
restrained completion feedback for a genuinely completed task.

Use CSS or an existing animation library. Respect
`prefers-reduced-motion`. No perpetual floating elements, distracting
parallax, excessive bouncing, or animations that block interaction.
Never fake AI progress: each displayed workflow step must correspond to
actual work.

------------------------------------------------------------------------

# 6. Responsive requirements

Test at **360px, 390px, 768px, 1024px, and 1440px**. At each width: - No
horizontal overflow or clipped content. - Headings wrap naturally. -
Images crop intentionally. - Cards stack in a logical order. -
Navigation and forms work. - Dialogs fit the viewport and scroll where
necessary. - Touch targets are at least 44×44px. - Dashboard becomes a
clear single-column layout on mobile. - Recompose mobile layouts
intentionally; do not merely shrink desktop CSS.

------------------------------------------------------------------------

# 7. Functionality and integrity rules

-   Preserve the PRD's real need → resource → action plan → progress
    workflow.
-   No dead buttons, placeholder links, fake forms, fake success
    messages, or unfinished routes.
-   No `localStorage` as the primary database, no auth bypass, and no
    hard-coded "logged in" state.
-   Never expose API keys, service-role keys, or privileged credentials
    in client code.
-   If a service is not configured, provide a visibly labelled,
    deterministic demo mode. Do not pretend it is live.
-   Never invent organizations, grants, deadlines, addresses,
    eligibility rules, amounts, or source links.
-   Recommendations must come from the catalogue. AI can interpret and
    explain but cannot invent resources.
-   Show source provenance and verification state.
-   Do not claim that an application was submitted, a provider
    contacted, or assistance granted unless the action genuinely
    happened.
-   Implement proper loading, empty, error, success, and disabled
    states.
-   Preserve security, ownership checks, and authentication rules from
    `docs/PRD.md`.

------------------------------------------------------------------------

# 8. Final visual and technical quality gate

Do not declare the work complete until you have checked the following:

### Visual

-   The first screen is memorable, clearly branded, and visually
    balanced.
-   Hero has a successful image or polished original visual.
-   Typography, spacing, colors, radii, and buttons are consistent.
-   Sections have varied composition and a strong rhythm.
-   No broken images, awkward whitespace, tiny low-contrast text, or
    generic template appearance.
-   No excessive gradients, shadows, badges, or identical cards.

### Functional

-   All visible links and buttons work.
-   Search, filters, forms, saving, plans, and progress work.
-   Authentication is real when configured; demo mode is clearly
    labelled otherwise.
-   Error, loading, empty, and success states work.
-   No fixable console errors.

### Responsive/accessibility

-   Test all five widths.
-   Keyboard navigation and visible focus work.
-   Images have appropriate alt behavior.
-   Reduced-motion is respected.
-   Contrast is adequate.

### Engineering

-   Run lint, type-check, tests, and production build.
-   Fix failures.
-   Verify no secrets are exposed.
-   Test the main user journey end-to-end.
-   Document incomplete items honestly.

If a preview/browser tool is available, inspect the real rendered site
and iterate. If not, run available checks and state clearly what could
not be visually verified. Never claim a screenshot was inspected if it
was not.

------------------------------------------------------------------------

# 9. Execute now

1.  Read `docs/PRD.md` and inspect the existing repository.
2.  Write `docs/UI_IMPLEMENTATION_CHECKLIST.md` and
    `docs/DESIGN_SYSTEM.md`.
3.  Implement the design tokens and reusable components.
4.  Build the full landing page with images, section variety, polished
    typography, and responsive behavior.
5.  Inspect and refine the landing page at desktop and mobile sizes.
6.  Apply the same standard to resource discovery, details, action
    plans, dashboard, and authentication.
7.  Connect the real product logic and preserve security; add an honest
    demo fallback where required.
8.  Run the quality gate and fix issues.
9.  Report completed features, exact run commands, environment
    variables, test/build results, and known limitations.

Do not stop after creating a plan. Implement the site. Make confident
design decisions without asking me to approve every small choice.

**Success means a beautiful, distinctive, responsive website and a
working, trustworthy end-to-end product---not just a good-looking
homepage.**
