# Lai Huy Interior — design system for `/dich-vu` mockup

## Brand character

Precise, architectural, quiet, premium, and grounded in real manufacturing capability. The visual language should feel like a contemporary interior architecture studio rather than a generic corporate landing page.

## Typography

- Use the existing Inter family only.
- Headlines are large, tightly tracked, and structurally composed; no decorative serif.
- Labels and metadata use restrained uppercase with generous letter spacing.
- Body copy remains compact and highly legible.

## Color

- Ink: `#0b0a09` for footer and one controlled proof chapter.
- Paper: `#ffffff`.
- Warm paper: `#f7f7f5`.
- Wood accent: existing wood token scale from `main.css`.
- No gradients, neon, new saturated brand colors, or random color proliferation.

## Layout

- Desktop artboard: 1440px, with the existing shell container and spacing tokens.
- Use asymmetric editorial compositions, oversized numbering, generous whitespace, and 40/60 or 60/40 image/text splits.
- Avoid rounded card grids and long sequences of similar horizontal bands.
- Prefer a few large project and workshop images over many small thumbnails.
- Use hairline rules as architectural guides, not as borders around every block.

## Page rhythm

1. Cinematic service hero with a clear promise and drawing-led CTA.
2. Bright editorial introduction with a concise chapter index.
3. Steps 01–03 as alternating image-led service chapters.
4. One dark proof chapter in the middle for workshop/manufacturing capability.
5. A real-project proof strip followed by a compact steps 04–06 index.
6. A bright final CTA on paper or warm-paper background.
7. Existing ink footer, visibly separated from the CTA above it.

## Hard constraints

- The section immediately before the footer must not use `#0b0a09`; use white or warm paper so the footer reads as a distinct closing layer.
- Preserve all existing factual claims and bilingual content meaning.
- The CTA may invite the user to send drawings through contact channels, but must not present a functional upload or successful submission state.
- Keep the shared header/footer identity and generated media approach.
- Design must remain plausible at mobile and at the 767/768 and 1279/1280 boundaries.
