import React, { createContext, useContext, useEffect, useId, useRef } from "react";
import "./ds-tabs-target"; // registers <ds-tabs-target> when this module ships
import "./tabs-element-target.css";

/*
 * TabsElementTarget: custom-element tabs whose no-JS :target fallback is an
 * optional enhancement that appears wherever the parts can agree on a shared id.
 *
 * Each part resolves its id as: explicit `id` prop -> React Context -> default.
 *   - JSX tree: Root's Provider supplies a unique useId() base. Fallback works,
 *     multiple instances are distinct.
 *   - Single .astro island: no Provider, so parts use the Context default base.
 *     Fallback still works for one instance on the page.
 *   - Multiple .astro islands: pass a distinct `id` to each part so they
 *     correlate without Context and don't collide.
 * Under JS the element correlates by `data-value` regardless, so switching and
 * a11y always work; the id only governs the no-JS fallback.
 */

const DEFAULT_BASE = "ds-tabs-target";

const TabsElementTargetContext = createContext<{
  base: string;
  defaultValue?: string;
}>({ base: DEFAULT_BASE });

export const Root: React.FC<{
  children?: React.ReactNode;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  id?: string;
}> = ({ children, defaultValue, onValueChange, id }) => {
  const autoId = useId();
  const base = (id ?? autoId).replace(/[^a-zA-Z0-9]/g, "");
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !onValueChange) return;
    const handler = (e: Event) =>
      onValueChange((e as CustomEvent<{ value: string }>).detail.value);
    el.addEventListener("ds-tabs:change", handler as EventListener);
    return () => el.removeEventListener("ds-tabs:change", handler as EventListener);
  }, [onValueChange]);

  return (
    <TabsElementTargetContext.Provider value={{ base, defaultValue }}>
      {React.createElement(
        "ds-tabs-target",
        { ref, className: "tabs-element-target-root", "default-value": defaultValue },
        children,
      )}
    </TabsElementTargetContext.Provider>
  );
};

export const List: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div data-tabs-list="">{children}</div>
);

export const Trigger: React.FC<{
  children?: React.ReactNode;
  value?: string;
  // Optional explicit id (the instance's shared base) for when Context can't
  // reach this part, e.g. composed directly in a .astro file.
  id?: string;
}> = ({ children, value, id }) => {
  const ctx = useContext(TabsElementTargetContext);
  const base = id ?? ctx.base;
  return (
    <a data-tabs-trigger="" data-value={value} href={`#${base}-${value}`}>
      {children}
    </a>
  );
};

export const Content: React.FC<{
  children?: React.ReactNode;
  value?: string;
  id?: string;
  // Marks this as the default panel for the no-JS fallback. In JSX it's derived
  // from Root's defaultValue via Context; in .astro (no Context) pass it
  // explicitly on the default panel.
  default?: boolean;
}> = ({ children, value, id, default: isDefault }) => {
  const ctx = useContext(TabsElementTargetContext);
  const base = id ?? ctx.base;
  const markDefault = isDefault ?? value === ctx.defaultValue;
  return (
    <div
      data-tabs-content=""
      data-value={value}
      data-default={markDefault ? "" : undefined}
      id={`${base}-${value}`}
    >
      {children}
    </div>
  );
};
