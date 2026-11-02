
## Requirements

Derived from the implementation, grouped for integration testing. "Upgraded"
means `<ds-tabs>` has registered; "hydrated" means React has attached.

### No JS (no script, or before any runs)

- Exactly one panel is visible: the one whose hidden radio is checked (`:has(> input:checked)`); the rest are not rendered visible.
- The initially visible panel is the default (the controlled `value` if set, else `defaultValue`, else the first).
- Activating a trigger (its `<label>`) checks that panel's radio and switches the visible panel.
- Switching a tab never changes the URL or browser history.
- No active-tab indicator is shown (no `data-state` is set without the element).
- No `tablist`/`tab`/`tabpanel` roles are present - the markup is a radio group + labels.
- The hidden radios are not serialised into a surrounding `<form>` (their `form` attribute targets a non-form id, so their form owner is null).
- Multiple instances on one page do not cross-talk: each has its own radio-group `name` and unique ids.

### Upgraded (custom element registered, not hydrated)

- Triggers correlate to panels by `data-value`.
- The list gets `role="tablist"` and `aria-orientation` (`horizontal` by default, `vertical` when `orientation="vertical"`).
- Each trigger gets `role="tab"` + `aria-controls` + `aria-selected`; each panel gets `role="tabpanel"` + `aria-labelledby` + `tabindex="0"`.
- Roving tabindex: the active trigger has `tabindex="0"`, all others `tabindex="-1"`.
- Arrow keys move selection along the orientation axis only (Left/Right when horizontal, Up/Down when vertical); off-axis arrows are ignored so page scroll still works; Home/End jump to first/last.
- The active trigger and panel carry `data-state="active"` (others `"inactive"`); inactive panels get the `hidden` attribute, so exactly one panel shows.
- Initial active tab resolves in order: controlled `value` attribute -> currently-checked radio (a pre-upgrade selection survives) -> `default-value` -> first trigger.
- No `ds-tabs:change` event fires for the initial activation.
- A genuine user change dispatches one bubbling `ds-tabs:change` event with `detail.value`; re-selecting the already-active tab dispatches nothing.
- The upgrade keeps each panel's radio `checked` in sync with the active tab.
- If no triggers exist when the element connects, it still upgrades once they appear (does not give up silently).

### Hydrated (React island or CSR) - adds to the upgraded behaviour

- `onValueChange` fires once with the new value on each real user change (click or keyboard).
- `onValueChange` does not fire on mount for the initial value.
- Changing the `onValueChange` identity across renders neither drops events nor re-subscribes.
- No hydration DOM-mismatch warning is logged (the radio is uncontrolled; the element owns `checked`).
- To its React consumer the component behaves like a standard stateful component.

### Uncontrolled (`defaultValue`)

- The element owns the selection; the consumer is only notified via `onValueChange`.
- The initially active tab is `defaultValue` (or the first trigger if unset).
- On hydration, a selection made beforehand (e.g. via the no-JS fallback) that differs from `defaultValue` is reported once through `onValueChange`.

### Controlled (`value`)

- The active tab always reflects `value`; changing `value` switches the active tab.
- A programmatic `value` change does not echo back through `onValueChange`.
- User interaction still fires `onValueChange` (so the consumer can update `value`); the tab updates optimistically.
- `preHydration="ignore"` (default): a pre-hydration selection differing from `value` is overridden by `value`.
- `preHydration="report"`: a pre-hydration selection differing from `value` is reported via `onValueChange` (for the consumer to adopt) instead of being overridden.

### Composition and identity

- Each part's base id resolves prop -> Context -> default.
- In a single React tree, multiple instances are independent with no manual ids (`useId`).
- Composed directly in `.astro` (no Context across islands), a single instance works on the default base; a 2nd+ instance needs explicit per-part `id`s to stay independent.

### Known testing limitations

The pre-hydration interaction race - which once looked untestable - is covered by holding the
island JS with Playwright's `page.route`, interacting with the no-JS fallback, then releasing it
(see `pre-hydration.spec.ts`). These remaining lines stay uncovered by design:

- A few **defensive branches** are intentionally unreachable in normal markup and left uncovered: the empty-trigger guards in `init`, the `onValueChange?.()` no-op when no callback is passed, and the `?? ""` / `?? el.dataset.value` fallbacks when a `data-value` is missing.
- Two **lifecycle/timing internals** are not reached by e2e: `disconnectedCallback`'s observer cleanup (no test removes a watched element), and the `connectedCallback` microtask fast-path (children arriving in the window between connect and the queued microtask, rather than synchronously or via the later `MutationObserver`).
