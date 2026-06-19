# React Design System APIs

Building stateful Design System components that work across React Architectures, from Vite to 11ty.

## References

https://www.danieleteti.it/post/native-html-replaces-javascript-en/
https://hidde.blog/popover-semantics/
https://hidde.blog/dialog-modal-popover-differences/
https://talks.hiddedevries.nl/VZNuWJ/slides
https://piccalil.li/blog/framework-agnostic-design-systems-part-1/
https://stackoverflow.com/questions/6906724/is-it-possible-to-have-tabs-without-javascript

## Constraints & gotchas (Astro islands + React)

Two issues shape which of these approaches actually survive in an Astro island.

### 1. React escapes the contents of inline `<style>` (during SSR)

- https://github.com/withastro/astro/issues/13863
- https://github.com/facebook/react/issues/13838#issuecomment-470294454

Before React 19, `ReactDOMServer` escaped the text _inside_ a `<style>` element -
`font-family: "Source Sans Pro"` was serialised as `font-family: &quot;Source Sans
Pro&quot;`. Per the WHATWG HTML spec, `<style>` (like `<script>`) is **RAWTEXT** and
its contents must **not** be escaped, so this is invalid for `text/html`. The Astro
issue reports the same thing breaking **quoted CSS attribute selectors**
(`[data-attr="x"]`) inside a React component's `<style>`; it was closed as "not
planned / upstream", pointing at the React issue.

**What this means for approaches that inline CSS:** any component that ships its CSS
through a React-rendered `<style>` element (rather than a real `.css` file) is exposed
to this. The escaping silently corrupts selectors that use `"`, `>` or `&` - so the
rule applies to the wrong elements (or nothing), with no error. React 19 fixes it by
treating `<style>`/`<script>` as raw text (verified: `"`, `>`, `&` now pass through
untouched). The takeaway holds regardless: **keep component CSS in `.css` files**;
a React `<style>` for stateful styling is version-dependent and fragile.

### 2. React Context does not cross Astro islands

Each Astro island is its own React root, and **React Context does not span roots**. So
if a compound component's parts are rendered as _separate_ islands, a value created in
`Root` (e.g. an id from `useId()`) and shared via Context is **invisible** to the
sub-components.

**What this means:** you cannot expose `Root` / `Trigger` / `Content` for a consumer to
scatter across `.astro` boundaries. The whole compound component must be **composed
inside a single `.tsx`** and that one component rendered from `.astro` - so it is one
React tree (one island, even when unhydrated) and Context resolves at render time.

## How the current approaches are affected

| Approach (`packages/ds`) | Inlines CSS via React `<style>`? (issue 1) | Shares `useId()` via Context? (issue 2) |
| --- | --- | --- |
| **TabsRadio** - radio + `:has` (`tabs-radio/`) | **Yes.** Injects `<style>` containing `input[id="…"]` per trigger. Under React 18 + Astro SSR the quotes were escaped (`&quot;`), so the `:has(input[id=…])` selector broke and the active-tab underline silently never applied. **The React 19 upgrade is what fixes it.** | Yes - `TabsRadioContext` shares the `useId()` id to `Trigger`/`Content`. Needs single-`.tsx` composition. |
| **TabsDetails** - `<details name>` (`tabs-details/`) | No. Selected state is a static rule in `tabs-details.css`. **Unaffected.** | Yes - shares the `useId()` group `name` via Context. Needs single-`.tsx` composition. |
| **TabsWeb** - HTML web component (`tabs-web/`) | No. CSS lives in `tabs-web.css`; behaviour ships as a `<script>`, and the `:target` fallback is in the stylesheet. **Unaffected.** | Yes (at render time) - shares `base`/`defaultValue` via Context to build matching ids/hrefs. Needs single-`.tsx` composition. (The runtime correlates trigger↔panel by `data-value` in the DOM, not Context.) |

**Summary**

- **Issue 1 (inline `<style>` escaping)** hits **only `TabsRadio`** - the only
  approach that inlines CSS in a React `<style>`. It was effectively broken in Astro
  before React 19; `TabsDetails` and `TabsWeb` sidestep it entirely by keeping CSS in
  `.css` files.
- **Issue 2 (Context across islands)** applies to **all three** - each uses `useId()` +
  Context to correlate parts. The mitigation (define the parts in one `.tsx`, render
  that from `.astro`) is exactly how the demo pages are already structured
  (`apps/astro/src/pages/index.tsx` rendered by `index.astro`), so as-built they work;
  the constraint is on how they may be _consumed_.