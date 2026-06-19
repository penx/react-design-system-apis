import React, { createContext, useContext, useEffect, useId, useRef } from "react";
import "./ds-tabs-radio"; // registers <ds-tabs-radio> when this module ships
import "./tabs-element-radio.css";

/*
 * Like TabsElementTarget, but the no-JS fallback is a radio group instead of
 * :target: each panel holds a hidden <input type="radio"> and each trigger is a
 * <label> for it, so selecting a tab without JS toggles the radio (no URL
 * change). Under JS the <ds-tabs-radio> element upgrades it to a full tablist.
 *
 * `id` (the shared radio-group base) resolves prop -> Context -> default; pass
 * it per part when composing in a .astro file (no Context across islands).
 */

const DEFAULT_BASE = "ds-tabs-radio";

const TabsElementRadioContext = createContext<{ base: string; defaultValue?: string }>({
  base: DEFAULT_BASE,
});

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
    <TabsElementRadioContext.Provider value={{ base, defaultValue }}>
      {React.createElement(
        "ds-tabs-radio",
        { ref, className: "tabs-element-radio-root", "default-value": defaultValue },
        children,
      )}
    </TabsElementRadioContext.Provider>
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
  const ctx = useContext(TabsElementRadioContext);
  const base = id ?? ctx.base;
  return (
    <label data-tabs-trigger="" data-value={value} htmlFor={`${base}-${value}`}>
      {children}
    </label>
  );
};

export const Content: React.FC<{
  children?: React.ReactNode;
  value?: string;
  id?: string;
  default?: boolean;
}> = ({ children, value, id, default: isDefault }) => {
  const ctx = useContext(TabsElementRadioContext);
  const base = id ?? ctx.base;
  const isDef = isDefault ?? value === ctx.defaultValue;
  return (
    <div data-tabs-content="" data-value={value}>
      {/*
        Hidden radio is the no-JS state; must be a direct child for
        :has(> input:checked). `form` points at an id that is not a <form>, so
        the radio's form owner is null and it is never serialized into a wrapping
        <form> - while still grouping by `name` and driving :checked.
      */}
      <input
        type="radio"
        name={base}
        id={`${base}-${value}`}
        form={`${base}-none`}
        defaultChecked={isDef}
        hidden
      />
      {children}
    </div>
  );
};
