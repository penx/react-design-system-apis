# Tabs approaches

Six implementations of the same Tabs API, each exploring a different mechanism.
The first three are no-JS-native techniques; the last three layer a custom
element on top.

Legend: ✅ yes · ⚠️ partial · ❌ no

| Approach | Works without JS | Active item styled from CSS file | Real tablist a11y | Composable from `.astro` | Other limitations |
| --- | :---: | :---: | :---: | :---: | --- |
| **TabsRadio** (radio + `:has`) | ✅ | ❌ ¹ | ❌ ⁴ | ❌ ⁵ | - |
| **TabsDetails** (`<details name>`) | ✅ | ✅ | ❌ ⁴ | ❌ ⁵ | User can close all tabs (no "always one selected"). |
| **TabsTarget** (pure CSS `:target`) | ⚠️ ⁷ | ❌ ⁷ | ❌ ⁴ | ✅ ⁶ | Selecting changes the URL/history (scroll jump), and only one `:target` matches per page ⁹. No JS at all. |
| **TabsElement** (custom element, no no-JS fallback) | ❌ ³ | ✅ | ✅ | ✅ | Requires loading the `define` script. Composes in `.astro` with no per-part `id`. |
| **TabsElementTarget** (custom element, `:target` fallback) | ⚠️ ² | ✅ | ✅ | ✅ ⁶ | Requires loading the `define` script. |
| **TabsElementRadio** (custom element, radio no-JS fallback) | ⚠️ ⁸ | ✅ | ✅ | ✅ ⁶ | Requires loading the `define` script. |

1. Needs an inline `<style>` per trigger for the active underline. It works without JS (the `<style>` is static), but it can't live in a `.css` file.
2. Without JS the panels still switch via `:target`, but the active tab is not styled (the active state is set by the upgraded element).
3. No no-JS fallback at all: every panel shows and the triggers are inert until the element upgrades.
4. Not the WAI-ARIA tablist pattern (no `tablist`/`tab`/`tabpanel` roles, roving tabindex, or arrow keys); exposes radio-group, disclosure, or plain-link semantics instead.
5. Parts share an id through React Context, which does not cross Astro islands, and there is no per-part `id` override - so composing the parts directly in an `.astro` file breaks the link.
6. Each part takes an optional `id`, resolved prop → Context → default, so it composes in `.astro` as one instance (default base) or many (distinct per-part `id`).
7. Pure CSS: panels switch via `:target`, but the active trigger can't be styled without per-value CSS, so there is no active-tab indicator.
8. Without JS the active tab is not styled (the active state is set by the upgraded element). Panels still switch, but via a hidden radio group rather than `:target`, so selection never touches the URL and multiple instances stay independent (no single-`:target`-per-page limit).
9. Only one element per page can match `:target` (the single URL fragment), so multiple `:target`-based tab sets can't each hold a non-default selection at once - activating one resets the others to their default. The radio/`<details>` variants don't share this; for TabsElementTarget it only affects the no-JS `:target` fallback.

The throughline: the no-JS-native variants (TabsRadio, TabsDetails, TabsTarget) need no JS;
TabsTarget is the only zero-JS option but mutates the URL. The custom-element variants add
real tablist a11y and differ in their no-JS fallback and how they compose in `.astro`:
TabsElement has no fallback (but composes anywhere with no `id`), TabsElementTarget adds a
`:target` fallback with a prop/Context/default `id`, and TabsElementRadio swaps that for a
radio fallback that doesn't touch the URL. None is a full Radix (focus management is minimal).
