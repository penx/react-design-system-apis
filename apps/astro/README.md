# Astro demo app

Demonstrates the design system's progressively-enhanced `Tabs` (`@repo/ds`):
the `<ds-tabs>` custom element renders a radio-group fallback that works with no
JS, then upgrades to a WAI-ARIA tablist once registered.

`src/pages/tabs.astro` renders the demo twice on purpose - once SSR-only (no
hydration, upgraded by the `@repo/ds/tabs/define` script) and once as a React
island (`client:idle`) - to exercise both enhancement paths on a single page.
Each instance is given a distinct `id` so the two demos stay independent.

## Commands

Run from `apps/astro`:

| Command        | Action                                   |
| :------------- | :--------------------------------------- |
| `pnpm dev`     | Start the dev server at `localhost:4321` |
| `pnpm build`   | Build to `./dist/`                       |
| `pnpm preview` | Preview the production build             |
