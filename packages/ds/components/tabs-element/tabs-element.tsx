import React, { useEffect, useRef } from "react";
import "./ds-tabs"; // registers <ds-tabs> when this module ships
import "./tabs-element.css";

/*
 * TabsElement: the Tabs API over a light-DOM custom element (<ds-tabs>), with NO
 * useId and NO Context. The element correlates triggers to panels by `data-value`
 * and generates ids/ARIA itself at runtime, so the parts share nothing through
 * React. That makes them independent of a single React tree - the thing React
 * Context can't provide across Astro islands (Issue 2 in the README) - so the
 * parts compose directly in an .astro file with no per-part id.
 *
 * Trigger and Content only need their own `value`; they never read from Root.
 * Trade-off: no no-JS fallback (selection is wired entirely at runtime).
 */

export const Root: React.FC<{
  children?: React.ReactNode;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}> = ({ children, defaultValue, onValueChange }) => {
  const ref = useRef<HTMLElement>(null);

  // Optional callback, only when hydrated. Uses a ref (not Context).
  useEffect(() => {
    const el = ref.current;
    if (!el || !onValueChange) return;
    const handler = (e: Event) =>
      onValueChange((e as CustomEvent<{ value: string }>).detail.value);
    el.addEventListener("ds-tabs:change", handler as EventListener);
    return () => el.removeEventListener("ds-tabs:change", handler as EventListener);
  }, [onValueChange]);

  return React.createElement(
    "ds-tabs",
    { ref, className: "tabs-element-root", "default-value": defaultValue },
    children,
  );
};

export const List: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div data-tabs-list="">{children}</div>
);

export const Trigger: React.FC<{
  children?: React.ReactNode;
  value?: string;
}> = ({ children, value }) => (
  // No href/id needed: the element wires correlation by data-value at runtime.
  <button type="button" data-tabs-trigger="" data-value={value}>
    {children}
  </button>
);

export const Content: React.FC<{
  children?: React.ReactNode;
  value?: string;
}> = ({ children, value }) => (
  <div data-tabs-content="" data-value={value}>
    {children}
  </div>
);
