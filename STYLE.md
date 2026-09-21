# Mozzarella frontend conventions

This document defines Mozzarella's permanent frontend conventions. Product screens and components should follow these rules as they are added.

## Hebrew and RTL

- Hebrew is the primary interface language.
- The default locale and its direction are configured in `consts/locales.ts`; the root layout derives the document `lang` and `dir` values from that configuration.
- Use the configured locale direction rather than assuming `dir="rtl"` in components or styles.
- Keep logical CSS properties such as `margin-inline`, `padding-inline`, and `inset-inline` so layouts work correctly in RTL.
- Treat code, file paths, numbers, and other left-to-right content as explicit isolated segments when needed.

## Internationalization

- Translation resources live in `lib/i18n/messages/`, with one typed module per locale, such as `he.ts`.
- Locale metadata and text direction live in `consts/locales.ts`, with the shared locale types in `types/locale.ts`. Hebrew (`he`) is the current default and primary locale; English (`en`) is architecturally supported as a left-to-right locale and receives a message catalog when it becomes an active product locale.
- Access messages through the i18n helpers. Keep translation lookup separate from components, routes, and application or business logic.
- Organize message objects by namespace and feature. Use concise, stable lower-case keys such as `app.title` or `marketplace.emptyState.title`; do not use translated sentences as keys.
- To add a user-facing string, add its key to the relevant locale resource first, then consume the translated value from the component. Never add a user-facing literal directly to a component, metadata object, error, label, or status.
- To add a language, add its locale and direction to `consts/locales.ts`, create its resource module under `lib/i18n/messages/`, register it with the message loader, and verify formatting, fallback behavior, and mixed-direction content.
- The message loader currently falls back to the default Hebrew catalog when a configured locale has no catalog. Do not expose a locale to users until its required messages are translated.
- Locale selectors and additional catalogs are product features; when implemented, they must use the established locale configuration and message loader.
- Avoid string concatenation for localized sentences. Use complete translated messages and add a typed interpolation approach when a feature needs variables.
- Do not use locale-specific punctuation, word order, spacing, or directional CSS assumptions in shared components.

## Typography

- Choose a legible Hebrew typeface with a clear, contemporary shape and a complete Latin character set.
- Establish a small type scale with distinct roles for headings, body text, labels, and code.
- Keep body text comfortable to read and avoid using condensed or decorative faces for instructional content.

## Spacing

- Use a consistent spacing scale based on Tailwind utilities.
- Prefer generous whitespace around learning content and compact, predictable spacing inside controls.
- Align related content to a shared container rather than adding one-off offsets.

## Colors

- Use a restrained, high-contrast palette with a warm educational character and clear semantic states.
- Keep color secondary to content hierarchy; never use color alone to communicate status or meaning.
- Use the semantic color tokens defined in `app/globals.css` rather than scattering arbitrary values through components.

## Design tokens and themes

- All recurring visual values are defined centrally in `app/globals.css`. The `:root` variables are the source tokens, and Tailwind's `@theme inline` block exposes semantic utilities.
- Prefer semantic names such as `background`, `foreground`, `muted`, `primary`, `secondary`, `border`, `accent`, and `destructive`. Token names should describe purpose, not a hue, component, or page.
- The current token set covers colors, font family, font sizes, line heights, weights, spacing, radii, shadows, borders, content width, transition timing, easing, and a content breakpoint.
- Components should consume Tailwind semantic utilities such as `bg-background`, `text-foreground`, `border-border`, `rounded-control`, `shadow-panel`, `max-w-content`, and `duration-standard`.
- If a visual value may be reused or themed, it belongs in the design system rather than directly in a component.
- Reuse an existing semantic token when its meaning matches. Introduce a new token only when the value is recurring or represents a distinct semantic role that existing tokens cannot express.
- Never hard-code colors, font stacks, font sizes, font weights, spacing, radii, shadows, border widths, animation timings, or layout widths inside components when a token can represent them.
- Additional themes should override the source variables centrally, for example under an `html[data-theme="..."]` selector. Components must remain unaware of theme names and must consume semantic tokens only.
- Theme selection is a product concern and must not be implemented by changing component-level visual values.
- Breakpoints describe content/layout behavior, not physical direction. Use logical properties and start/end concepts so the same tokens work in RTL and LTR.

## Responsive design

- Design from small screens upward and test Hebrew text at narrow widths.
- Let content determine height; avoid fixed heights that can clip translated or student-generated text.
- Preserve the core workflow and readability across mobile, tablet, and desktop layouts.

## Accessibility

- Use semantic HTML and a logical heading hierarchy.
- Every interactive control needs an accessible name, visible focus state, and keyboard support.
- Maintain sufficient contrast, support reduced motion, and provide text alternatives for meaningful icons and visual states.
- Validate dynamic content, errors, and status updates with appropriate accessible announcements.

## Icons

- Use Lucide React for interface icons when an icon communicates a clear action or state.
- Icons should support nearby text or have an accessible label; do not use icons as decoration when they add noise.
- Keep icon sizing and stroke weight consistent within a context.

## Visual direction

Mozzarella should feel like a modern learning marketplace: curious, welcoming, and grounded in real-world work. Product screens should make choosing a problem feel inviting while keeping the student's thinking and progress central. Prefer clear surfaces, purposeful color, strong hierarchy, and small moments of warmth over gamification-heavy decoration or a generic dashboard aesthetic.

## Component conventions

- Keep components close to the route or domain that owns them until reuse is demonstrated.
- Do not create a component abstraction for a single use without a clear accessibility or behavior benefit.
- Keep shared primitives focused and composable. Create shared UI components when multiple product surfaces need the same behavior or accessibility contract; do not build a component library speculatively.
- Keep product rules out of presentational components and keep server/client boundaries explicit.
- Do not read environment variables or emit application logs from presentational components. Keep deployment configuration and logging in their dedicated server-side boundaries.
