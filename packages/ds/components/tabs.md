# Tabs

A compound `Tabs` API (`Root` / `List` / `Trigger` / `Content`) built on the
light-DOM custom element [`ds-tabs.ts`](./ds-tabs.ts), styled by
[`tabs.css`](./tabs.css).

It is **progressively enhanced**: the no-JS fallback is a radio group (each panel
holds a hidden `<input type="radio">`, each trigger is its `<label>`), so a tab
can be selected with no JavaScript via `:has(> input:checked)`.
Once `<ds-tabs>` registers it upgrades to a full WAI-ARIA tablist (roles, roving
tabindex, arrow/Home/End keys, `aria-orientation`, `data-state`).

## Behavior

Uncontrolled by default (`defaultValue`); pass `value` + `onValueChange` to control it once
hydrated, and `orientation` (`"horizontal"` | `"vertical"`) to set the arrow-key axis. It works
at three layers, each usable on its own:

- **No JS** - a radio group switches panels via `:has(> input:checked)`, with no URL change.
- **Upgraded** - `<ds-tabs>` adds the WAI-ARIA tablist (roles, roving tabindex, arrow/Home/End
  keys, `data-state`), correlating triggers to panels by `data-value`.
- **Hydrated** - React adds `onValueChange` and controlled `value`; a selection made before
  hydration is handed off, with `preHydration` (`"ignore"` | `"report"`) choosing
  whether the controlled value or the user's pick wins.

`onValueChange` fires only on a real user change - never on mount, never when re-selecting the
active tab.

## Resources

### WCAG

- [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
- [2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
- [2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
- [2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
- [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)
- [WAI-ARIA APG - Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) - roles
  (`tablist`/`tab`/`tabpanel`), roving tabindex, and the keyboard model.

### Progressive enhancement

- [GOV.UK Design System - Tabs](https://design-system.service.gov.uk/components/tabs/) - the
  canonical PE tabs: degrades to a stack of headings + content without JS.
- [Inclusive Components - Tabbed interfaces](https://inclusive-components.design/tabbed-interfaces/)
  (Heydon Pickering) - the reasoning behind the ARIA + keyboard behaviour.
- [web.dev - Building a tabs component](https://web.dev/articles/building/a-tabs-component)
  (Adam Argyle) - a CSS-forward take (scroll-snap, `:target`).
- Platform primitives we lean on:
  [`:has()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:has),
  [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements),
  [`:defined`](https://developer.mozilla.org/en-US/docs/Web/CSS/:defined).

### Component-library equivalents

- [Radix Primitives - Tabs](https://www.radix-ui.com/primitives/docs/components/tabs)
- [Base UI - Tabs](https://base-ui.com/react/components/tabs)
- [React Aria - Tabs](https://react-spectrum.adobe.com/react-aria/Tabs.html)
- [shadcn/ui - Tabs](https://ui.shadcn.com/docs/components/tabs)
- [The Component Gallery - Tabs](https://component.gallery/components/tabs/)
