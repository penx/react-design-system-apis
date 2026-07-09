# Modal

A compound `Modal` API (`Root` / `Trigger` / `Content` / `Title` / `Description` / `Close`)
backed by a native [`<dialog popover>`](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
with **no JavaScript**.

- **Open** via `popovertarget` on the `Trigger`; **close** via `popovertargetaction="hide"` on
  `Close`. **Escape** and **outside-click** dismissal are native.
- The `popovertarget` <-> `id` wiring is emitted in the SSR markup, so the trigger works
  **before or without hydration**.
- Accessible name/description via `useId`: `Title`/`Description` supply the `id`s that `Content`
  references with `aria-labelledby`/`aria-describedby`; `<dialog>` provides `role="dialog"`.

## Optionally controlled

Uncontrolled needs no JS. As an opt-in JS layer over the same native element, `Root` accepts
`onOpenChange` (wired with the `<dialog>`'s synthetic `onToggle`, so it reports user *and*
programmatic open/close with no effect) and `open` (drives the popover via
`showPopover()`/`hidePopover()` - the one unavoidable effect, isolated in `useControlledPopover`,
since the Popover API has no declarative open prop). The triggers keep working natively even
when controlled - React just observes and can also drive it.

## Intentionally non-modal

`popover="auto"` is a supplemental/contextual overlay - the background stays interactive (no
focus trap), per [Hidde de Vries on dialog vs popover](https://hidde.blog/dialog-modal-popover-differences/)
and the project's "reach for the least disruptive pattern" principle. Reach for a true modal
(`<dialog>` via `showModal()`) only when blocking the page is genuinely necessary.

## Resources

- [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
- [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [Dialog, modal and popover differences](https://hidde.blog/dialog-modal-popover-differences/) - Hidde de Vries
- [Semantics and the popover attribute](https://hidde.blog/popover-semantics/) - Hidde de Vries
- [Radix Primitives - Dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
