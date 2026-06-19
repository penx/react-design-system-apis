/*
 * <ds-tabs-target> - custom-element tabs that work across rendering contexts.
 *
 * Same runtime behaviour as the other custom-element variants: it correlates
 * triggers to panels by `data-value` and adds the accessible tablist (roles,
 * roving tabindex, arrow/Home/End keys, `data-state`, `hidden`).
 *
 * Unlike <ds-tabs>, it KEEPS any ids the markup already has - the
 * React wrapper renders them (from a prop, Context, or a default) to drive the
 * no-JS :target fallback - and only generates ids when they are absent, so the
 * render-time and runtime ids stay consistent.
 */

export {};

if (typeof HTMLElement !== "undefined" && typeof customElements !== "undefined") {
  let instanceCount = 0;

  class DsTabsTarget extends HTMLElement {
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

      // Only used to mint ids when the markup didn't ship any.
      const fallbackBase = `ds-tabs-target-${(instanceCount += 1)}`;

      const list = this.querySelector<HTMLElement>("[data-tabs-list]");
      if (list) list.setAttribute("role", "tablist");

      triggers.forEach((trigger) => {
        const value = trigger.dataset.value ?? "";
        const panel = this.panels.find((p) => p.dataset.value === value);
        trigger.setAttribute("role", "tab");
        if (panel) {
          if (!panel.id) panel.id = `${fallbackBase}-${value}`;
          if (!trigger.id) trigger.id = `${panel.id}-tab`;
          trigger.setAttribute("aria-controls", panel.id);
          panel.setAttribute("role", "tabpanel");
          panel.setAttribute("tabindex", "0");
          panel.setAttribute("aria-labelledby", trigger.id);
        }
        trigger.addEventListener("click", (e) => {
          e.preventDefault();
          this.activate(value, true);
        });
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

  if (!customElements.get("ds-tabs-target")) {
    customElements.define("ds-tabs-target", DsTabsTarget);
  }
}
