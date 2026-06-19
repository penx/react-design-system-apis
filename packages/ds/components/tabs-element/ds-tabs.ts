/*
 * <ds-tabs> - a light-DOM HTML custom element that does ALL the wiring at
 * runtime: it mints a unique base id per instance and assigns panel ids,
 * aria-controls/labelledby, roles, roving tabindex, etc. itself. It correlates
 * triggers to panels purely by `data-value` in the DOM.
 *
 * Because nothing is correlated through a React-shared id, the React wrapper
 * needs neither useId nor Context - so its parts don't depend on living in one
 * React tree (React Context can't cross Astro islands), and they compose
 * directly in an .astro file. Trade-off: no no-JS fallback - before upgrade the
 * baseline simply shows every panel.
 */

export {};

if (typeof HTMLElement !== "undefined" && typeof customElements !== "undefined") {
  let instanceCount = 0;

  class DsTabs extends HTMLElement {
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

      // Unique per instance, generated here - the React side ships no ids at all.
      const base = `ds-tabs-${(instanceCount += 1)}`;

      const list = this.querySelector<HTMLElement>("[data-tabs-list]");
      if (list) list.setAttribute("role", "tablist");

      triggers.forEach((trigger) => {
        const value = trigger.dataset.value ?? "";
        const panel = this.panels.find((p) => p.dataset.value === value);
        trigger.setAttribute("role", "tab");
        trigger.id = `${base}-${value}-tab`;
        if (panel) {
          panel.id = `${base}-${value}`;
          trigger.setAttribute("aria-controls", panel.id);
          panel.setAttribute("role", "tabpanel");
          panel.setAttribute("tabindex", "0");
          panel.setAttribute("aria-labelledby", trigger.id);
        }
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

  if (!customElements.get("ds-tabs")) {
    customElements.define("ds-tabs", DsTabs);
  }
}
