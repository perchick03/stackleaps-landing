# Design System Document: The Global Architect

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **The Digital Curator**. In the Destination Management (DMC) world, trust is built through precision, and desire is built through atmosphere. We are moving away from the "template-heavy" look of standard B2B lead generation and toward a high-end editorial experience.

This system breaks the traditional "grid-lock" by utilizing **Intentional Asymmetry** and **Tonal Depth**. We treat the screen not as a flat canvas, but as a series of curated layers. By overlapping vibrant, high-action travel imagery with sophisticated, structured surfaces, we convey a brand that is both a logistical powerhouse and a visionary travel partner.

## 2. Colors: The Depth of Trust
The palette leverages a foundation of "Deep Atlantic" blues to establish corporate authority, punctuated by "Vibrant Apricot" to drive lead conversion.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Boundaries must be defined solely through:
1. **Background Color Shifts:** Transitioning from `surface` (#f8f9ff) to `surface-container-low` (#eef4ff).
2. **Subtle Tonal Transitions:** Using padding and color blocks to create a "built-in" structure.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of premium materials. Use the `surface-container` tiers to create depth:
* **Base Layer:** `surface` (#f8f9ff) for the main page body.
* **Mid-Level:** `surface-container-low` (#eef4ff) for secondary content areas.
* **Highest Level:** `surface-container-highest` (#d5e4f8) for interactive cards or high-priority lead forms.

### The "Glass & Gradient" Rule
To escape the "flat" corporate look, use **Glassmorphism** for floating navigation and overlay cards. Use `surface-container-lowest` (#ffffff) at 80% opacity with a 20px `backdrop-blur`.
**Signature Textures:** Apply a subtle linear gradient from `primary` (#16314a) to `primary_container` (#2e4862) on main CTAs to give them a tactile, "pressable" soul.

## 3. Typography: Editorial Authority
We utilize **Plus Jakarta Sans** to bridge the gap between corporate reliability and modern hospitality.

* **Display Scales (`display-lg` to `display-sm`):** Reserved for hero value propositions. Use tight letter-spacing (-0.02em) to create a "headline" feel that commands attention.
* **Headline & Title (`headline-lg` to `title-sm`):** These define the rhythm of the page. Headlines should always be set in `primary` (#16314a) to maintain a high-trust anchor.
* **Body (`body-lg` to `body-sm`):** Optimized for readability. Use `on_surface_variant` (#43474d) for long-form text to reduce visual fatigue while maintaining professional contrast.

## 4. Elevation & Depth
Elevation is achieved through light and tone, never through heavy drop shadows.

* **The Layering Principle:** Instead of shadows, place a `surface-container-lowest` card inside a `surface-container-low` section. The subtle contrast creates a soft, natural lift.
* **Ambient Shadows:** For floating lead-gen forms, use a highly diffused shadow: `0px 20px 40px rgba(14, 29, 43, 0.06)`. This mimics natural ambient light.
* **The "Ghost Border" Fallback:** If a container needs definition against a similar color, use the `outline_variant` token at **15% opacity**. Never use a 100% opaque border.
* **Glassmorphism:** Use for "floating" elements like sticky headers or image captions to allow the vibrant travel photography to bleed through the UI, softening the layout.

## 5. Components

### Buttons
* **Primary (The Lead Driver):** Gradient fill from `secondary` (#984800) to `secondary_container` (#ff8e3b). Roundedness: `md` (0.375rem). No border.
* **Secondary (The Explorer):** Transparent background with a "Ghost Border" of `primary`. Text color set to `primary`.
* **Tertiary:** Text-only in `primary` with an icon. Use for "Learn More" links.

### Cards & Content Lists
* **Rule:** Forbid divider lines.
* **Spacing:** Use `spacing-8` (2rem) to separate list items.
* **Interaction:** On hover, a card should shift from `surface-container-low` to `surface-container-lowest` with an Ambient Shadow.

### Lead Generation Inputs
* **Surface:** Use `surface_container_lowest` for the input field background.
* **State:** On focus, the border shifts to a 2px `secondary` (#984800) "Ghost Border" (20% opacity).
* **Typography:** Labels must be `label-md` in `on_surface_variant`.

### Destination Chips
* Used for filtering regions. High roundedness (`full`). Background: `primary_fixed_dim`. Text: `on_primary_fixed`. No shadow.

### Relevant Custom Components
* **The Image Mosaic:** A layout component for travel photography using intentional asymmetry (e.g., one large vertical image overlapping two smaller horizontal ones) to break the corporate grid.
* **Trust Bar:** A `surface-container-low` full-width strip featuring monochromatic logos of partner airlines and hotel chains.

## 6. Do’s and Don’ts

### Do
* **Do** use asymmetrical margins (e.g., more whitespace on the left than the right) to create a bespoke, editorial feel.
* **Do** use the `secondary` orange sparingly—only for elements that require a user's action (CTAs, form submissions).
* **Do** ensure travel imagery has a slight "cool" color grade to match the `primary` blue tones.

### Don’t
* **Don't** use 1px solid black or dark grey borders. This immediately destroys the premium "Digital Curator" aesthetic.
* **Don't** use standard "drop shadows" (e.g., 0px 2px 4px). They feel dated and "out-of-the-box."
* **Don't** clutter the page. If a section feels "busy," increase the vertical spacing using `spacing-20` (5rem) or `spacing-24` (6rem).