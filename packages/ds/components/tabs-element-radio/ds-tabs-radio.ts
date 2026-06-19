/*
 * <ds-tabs-radio> - custom-element tabs whose no-JS fallback is a radio group
 * (hidden <input type="radio"> + <label> triggers), not :target. The radios
 * drive visibility via `:has(> input:checked)` before upgrade, so selecting a
 * tab without JS does NOT touch the URL/history (the win over the :target
 * fallback).
 *
 * On upgrade the element behaves like the other custom-element variants:
 * correlate by `data-value`, add the tablist roles, roving tabindex,
 * arrow/Home/End keys, `data-state`, and `hidden`. It keeps the radios in sync
 * so state is consistent, but post-upgrade visibility is driven by `hidden`.
 */

export {};

if (typeof HTMLElement !== "undefined" && typeof customElements !== "undefined") {
  let instanceCount = 0;

  class DsTabsRadio extends HTMLElement {
    private initialised = false;

    connectedCallback() {
      if (this.triggers.length === 0) {
        queueMicrotask(() => this.init());
      } else {
        this.init();
      }
    }

    private get triggers(): HTMLElement[] {
      return Array.from(this.querySelectorAll<HTMLElement>("[data-tabs-trigger]"));
    }

    private get panels(): HTMLElement[] {
      return Array.from(this.querySelectorAll<HTMLElement>("[data-tabs-content]"));
    }

    private init() {
      if (this.initialised) return;
      const triggers = this.triggers;
      if (triggers.length === 0) return;
      this.initialised = true;

      const base = `ds-tabs-radio-${(instanceCount += 1)}`;
      const list = this.querySelector<HTMLElement>("[data-tabs-list]");
      if (list) list.setAttribute("role", "tablist");

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
        // No preventDefault: clicking the <label> also checks its radio, which
        // keeps the fallback state in sync; activate() owns visibility/aria.
        trigger.addEventListener("click", () => this.activate(value, true));
        trigger.addEventListener("keydown", (e) => this.onKeydown(e));
      });

      const initial =
        this.getAttribute("default-value") ?? triggers[0].dataset.value ?? "";
      this.activate(initial, false);
    }

    private activate(value: string, focusTab: boolean) {
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
        const input = p.querySelector<HTMLInputElement>('input[type="radio"]');
        if (input) input.checked = active;
      });
      this.dataset.value = value;
      this.dispatchEvent(
        new CustomEvent("ds-tabs:change", { detail: { value }, bubbles: true }),
      );
    }

    private onKeydown(e: KeyboardEvent) {
      const triggers = this.triggers;
      const current = triggers.findIndex((t) => t.dataset.state === "active");
      let next = -1;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          next = (current + 1) % triggers.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
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
      this.activate(triggers[next].dataset.value ?? "", true);
    }
  }

  if (!customElements.get("ds-tabs-radio")) {
    customElements.define("ds-tabs-radio", DsTabsRadio);
  }
}
