/*
 * <ds-tabs> - the custom element behind the Tabs API. The hidden radio group is
 * the single source of truth: selecting a tab (a <label> click, or arrow keys
 * via radio.click()) toggles its radio and fires the radio's native `change`.
 * This element listens for that one change to update the tablist UI - and React
 * can observe the same native change directly through the radio's `onChange`,
 * so no bridging CustomEvent listener/effect is needed on the React side. It
 * still emits a bubbling `ds-tabs:change` for non-React consumers.
 *
 * Before upgrade the radios + `:has(> input:checked)` drive the no-JS fallback.
 * On upgrade it adds the accessible tablist (roles, roving tabindex,
 * arrow/Home/End keys, aria-orientation, data-state, hidden).
 */

declare global {
  interface HTMLElementEventMap {
    "ds-tabs:change": CustomEvent<{ value: string }>;
  }
}

export {};

if (
  typeof HTMLElement !== "undefined" &&
  typeof customElements !== "undefined"
) {
  let instanceCount = 0;

  class DsTabs extends HTMLElement {
    private initialised = false;
    private orientation: "horizontal" | "vertical" = "horizontal";
    private observer?: MutationObserver;

    static get observedAttributes() {
      return ["value"];
    }

    // Reflect the controlled `value` to an attribute whether React sets it as a
    // property or an attribute, so attributeChangedCallback always runs.
    get value(): string | null {
      return this.getAttribute("value");
    }
    set value(next: string | null) {
      if (next == null) this.removeAttribute("value");
      else this.setAttribute("value", next);
    }

    // Controlled mode: the consumer drives selection via the `value` attribute.
    // Check the matching radio silently (no native change -> no onChange echo)
    // and update the UI. Pre-init changes are ignored; init() reads the initial.
    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      value: string | null,
    ) {
      if (
        name === "value" &&
        this.initialised &&
        // Ignore a no-op re-set (e.g. React re-asserting the same declarative
        // value on hydration) so it can't clobber a preserve-checked pick.
        oldValue !== value &&
        value != null &&
        value !== this.dataset.value
      ) {
        this.select(value, false);
      }
    }

    connectedCallback() {
      if (this.triggers.length > 0) {
        this.init();
        return;
      }
      // Children may not be parsed (or hydrated) yet. Retry after a microtask,
      // and if they're still absent, watch for them so the element always
      // upgrades once its triggers arrive rather than giving up silently.
      queueMicrotask(() => {
        if (this.initialised) return;
        if (this.triggers.length > 0) {
          this.init();
          return;
        }
        this.observer = new MutationObserver(() => {
          if (this.triggers.length > 0) this.init();
        });
        this.observer.observe(this, { childList: true, subtree: true });
      });
    }

    disconnectedCallback() {
      this.observer?.disconnect();
    }

    private get triggers(): HTMLElement[] {
      return Array.from(
        this.querySelectorAll<HTMLElement>("[data-tabs-trigger]"),
      );
    }

    private get panels(): HTMLElement[] {
      return Array.from(
        this.querySelectorAll<HTMLElement>("[data-tabs-content]"),
      );
    }

    private radioOf(value: string): HTMLInputElement | null {
      const panel = this.panels.find((p) => p.dataset.value === value);
      return (
        panel?.querySelector<HTMLInputElement>('input[type="radio"]') ?? null
      );
    }

    private checkedValue(): string | undefined {
      return this.panels.find(
        (p) =>
          p.querySelector<HTMLInputElement>('input[type="radio"]')?.checked,
      )?.dataset.value;
    }

    private init() {
      if (this.initialised) return;
      const triggers = this.triggers;
      if (triggers.length === 0) return;
      this.initialised = true;
      this.observer?.disconnect();

      const base = `ds-tabs-${(instanceCount += 1)}`;
      this.orientation =
        this.getAttribute("orientation") === "vertical"
          ? "vertical"
          : "horizontal";
      const list = this.querySelector<HTMLElement>("[data-tabs-list]");
      if (list) {
        list.setAttribute("role", "tablist");
        list.setAttribute("aria-orientation", this.orientation);
      }

      triggers.forEach((trigger) => {
        const value = trigger.dataset.value ?? "";
        const panel = this.panels.find((p) => p.dataset.value === value);
        trigger.setAttribute("role", "tab");
        if (panel) {
          if (!panel.id) panel.id = `${base}-${value}-panel`;
          if (!trigger.id) trigger.id = `${panel.id}-tab`;
          trigger.setAttribute("aria-controls", panel.id);
          panel.setAttribute("role", "tabpanel");
          panel.setAttribute("tabindex", "0");
          panel.setAttribute("aria-labelledby", trigger.id);
        }
        trigger.addEventListener("keydown", (e) => this.onKeydown(e));
      });

      // The radio group is the source of truth: a <label> click or radio.click()
      // (from the keyboard) fires one native change. React's onChange sees the
      // same event; here we sync the UI and notify non-React consumers. Native
      // semantics give us "no event on mount" and "no event on re-select" free.
      this.addEventListener("change", (e) => {
        const target = e.target as HTMLElement | null;
        if (!target?.matches('[data-tabs-content] > input[type="radio"]'))
          return;
        const value = this.checkedValue();
        if (value !== undefined && value !== this.dataset.value) {
          this.applyState(value, true);
          this.dispatchEvent(
            new CustomEvent("ds-tabs:change", {
              detail: { value },
              bubbles: true,
            }),
          );
        }
      });

      // Initial value. Normally the `value` attribute wins (a controlled value,
      // or default). With `preserve-checked`, an already-checked radio wins over
      // `value` - so a selection the user made before this upgrade (e.g. via the
      // no-JS fallback) is kept rather than overridden. Then default-value, then
      // first tab. Synced silently (no event), so no spurious change is fired.
      const preserveChecked = this.hasAttribute("preserve-checked");
      const initial =
        (preserveChecked ? this.checkedValue() : undefined) ??
        this.getAttribute("value") ??
        this.checkedValue() ??
        this.getAttribute("default-value") ??
        triggers[0].dataset.value ??
        "";
      this.select(initial, false);
    }

    // Silently check the radio and update the UI - no native change is fired, so
    // React's onChange does not echo. Used for the initial sync and controlled
    // `value` pushes.
    private select(value: string, focusTab: boolean) {
      const radio = this.radioOf(value);
      if (radio && !radio.checked) radio.checked = true; // unchecks siblings
      this.applyState(value, focusTab);
    }

    // UI only: roles state, roving tabindex, panel visibility, optional focus.
    private applyState(value: string, focusTab: boolean) {
      this.triggers.forEach((t) => {
        const active = t.dataset.value === value;
        t.setAttribute("aria-selected", String(active));
        t.setAttribute("tabindex", active ? "0" : "-1");
        t.dataset.state = active ? "active" : "inactive";
        if (active && focusTab) t.focus();
      });
      this.panels.forEach((p) => {
        const active = p.dataset.value === value;
        p.dataset.state = active ? "active" : "inactive";
        p.hidden = !active;
      });
      this.dataset.value = value;
    }

    private onKeydown(e: KeyboardEvent) {
      const triggers = this.triggers;
      const current = triggers.findIndex((t) => t.dataset.state === "active");
      const nextKey =
        this.orientation === "vertical" ? "ArrowDown" : "ArrowRight";
      const prevKey = this.orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
      let next = -1;
      switch (e.key) {
        case nextKey:
          next = (current + 1) % triggers.length;
          break;
        case prevKey:
          next = (current - 1 + triggers.length) % triggers.length;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = triggers.length - 1;
          break;
        default:
          return;
      }
      e.preventDefault();
      // Toggle via the radio so the native change fires for both React's
      // onChange and our own change listener (which moves focus + emits).
      this.radioOf(triggers[next].dataset.value ?? "")?.click();
    }
  }

  if (!customElements.get("ds-tabs")) {
    customElements.define("ds-tabs", DsTabs);
  }
}
