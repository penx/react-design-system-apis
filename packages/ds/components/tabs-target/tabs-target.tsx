import React, { createContext, useContext, useId } from "react";
import "./tabs-target.css";

/*
 * Pure-CSS :target tabs - no JavaScript at all (not even a custom element).
 * Each trigger is an anchor to its panel's id; CSS `:target` shows the matching
 * panel, falling back to the `data-default` panel when nothing is targeted.
 *
 * Trade-offs: selecting a tab updates the URL hash (history entry + scroll), and
 * the active *trigger* can't be styled without per-value CSS, so there is no
 * active-tab indicator.
 *
 * `id` resolves prop -> Context -> default, so it composes in JSX, a single
 * .astro island (default base), or many (distinct per-part `id`).
 */

const DEFAULT_BASE = "tabs-target";

const TabsTargetContext = createContext<{ base: string; defaultValue?: string }>({
  base: DEFAULT_BASE,
});

export const Root: React.FC<{
  children?: React.ReactNode;
  defaultValue?: string;
  id?: string;
}> = ({ children, defaultValue, id }) => {
  const autoId = useId();
  const base = (id ?? autoId).replace(/[^a-zA-Z0-9]/g, "");
  return (
    <TabsTargetContext.Provider value={{ base, defaultValue }}>
      <div className="tabs-target-root">{children}</div>
    </TabsTargetContext.Provider>
  );
};

export const List: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div data-tabs-list="">{children}</div>
);

export const Trigger: React.FC<{
  children?: React.ReactNode;
  value?: string;
  id?: string;
}> = ({ children, value, id }) => {
  const ctx = useContext(TabsTargetContext);
  const base = id ?? ctx.base;
  return (
    <a className="tabs-target-trigger" data-value={value} href={`#${base}-${value}`}>
      {children}
    </a>
  );
};

export const Content: React.FC<{
  children?: React.ReactNode;
  value?: string;
  id?: string;
  default?: boolean;
}> = ({ children, value, id, default: isDefault }) => {
  const ctx = useContext(TabsTargetContext);
  const base = id ?? ctx.base;
  const markDefault = isDefault ?? value === ctx.defaultValue;
  return (
    <div
      className="tabs-target-content"
      data-default={markDefault ? "" : undefined}
      id={`${base}-${value}`}
    >
      {children}
    </div>
  );
};
