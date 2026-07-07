# React Design System APIs

Building stateful Design System components that work across React Architectures, from Vite to 11ty.

## Design principles

- Let the platform do the work: [prefer native HTML and CSS over JavaScript][native-html].
- Where possible, use custom elements and hydration for enhancement only, so a component works without them.
- When core functionality must rely on JavaScript, prefer custom elements over hydration.
- When hydrated, a component should behave like a standard stateful component to its React consumer; hydration only adds React event props like `onClick` and `onValueChange`.
- Maintain state when enhanced: a selection made before the element upgrades or the app hydrates should carry over, not reset.
- Add accessibility semantics, but [No ARIA is better than Bad ARIA][no-bad-aria]: add a role only once it can be backed.
- Where client JavaScript is used, follow the [APG Patterns][apg-patterns] for example good practices, and only diverge from them where there is good reason.
- Build with React, but [minimize framework lock-in][framework-agnostic] so core behavior does not depend heavily on it.

## Example APIs

Native building blocks these approaches lean on. They cut JavaScript but still leave the
semantics to you:

- [Popover API][popover-api] - see Hidde de Vries on [popover semantics][popover-semantics], [dialog, modal and popover differences][dialog-popover], and [accessible dialogs and popovers][overlays-talk]
- [`<details>` / `<summary>`][details]
- [Radio inputs][radio]
- [Checkboxes][checkbox]

[native-html]: https://www.danieleteti.it/post/native-html-replaces-javascript-en/
[popover-semantics]: https://hidde.blog/popover-semantics/
[dialog-popover]: https://hidde.blog/dialog-modal-popover-differences/
[overlays-talk]: https://talks.hiddedevries.nl/VZNuWJ/slides
[framework-agnostic]: https://piccalil.li/blog/framework-agnostic-design-systems-part-1/
[no-bad-aria]: https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/
[apg-patterns]: https://www.w3.org/WAI/ARIA/apg/patterns/
[popover-api]: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
[details]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Element/details
[radio]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Element/input/radio
[checkbox]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Element/input/checkbox
