import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
} from "react";
import "./ds-tabs"; // registers <ds-tabs> when this module ships
import "./tabs.css";

/*
 * Tabs: a compound API (Root/List/Trigger/Content) over a light-DOM custom
 * element (<ds-tabs>). The no-JS fallback is a radio group - each panel holds a
 * hidden <input type="radio"> and each trigger is a <label> for it, so
 * selecting a tab without JS toggles the radio (panels switch via
 * `:has(> input:checked)`, no URL change). Once <ds-tabs> upgrades it becomes a
 * full WAI-ARIA tablist (roles, roving tabindex, arrow keys, `data-state`).
 *
 * `id` (the shared radio-group base) resolves prop -> Context -> default. In a
 * single React tree useId() makes each instance unique; pass `id` per part only
 * when composing directly in a .astro file (no Context across islands) with
 * more than one instance on the page.
 *
 * Uncontrolled by default (`defaultValue`); pass `value` to control it after
 * hydration - the consumer's value then drives the active tab and user
 * interaction is reported through `onValueChange`. When controlled,
 * `preHydration` chooses how a selection made before hydration (e.g. via the
 * no-JS fallback) is reconciled: "ignore" (default) lets the controlled
 * `value` override it; "report" reports it via `onValueChange` so the consumer
 * can adopt it.
 */

const DEFAULT_BASE = "ds-tabs";

const TabsContext = createContext<{
  base: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}>({
  base: DEFAULT_BASE,
});

// The live selection: the checked radio (set before the element upgrades, e.g.
// by the no-JS fallback) or the upgraded element's data-value.
function selectedValue(el: HTMLElement): string | undefined {
  const input = el.querySelector<HTMLInputElement>(
    '[data-tabs-content] > input[type="radio"]:checked',
  );
  return (
    input?.closest<HTMLElement>("[data-tabs-content]")?.dataset.value ??
    el.dataset.value
  );
}

// A selection the user made before React hydrated fired no onChange we could
// catch, so report it once on mount. It reports when uncontrolled, or when
// controlled with preHydration="report"; under "ignore" the controlled `value`
// (rendered as an attribute, with no `preserve-checked`) overrides the pick at
// the element's init, so there's nothing to report. The controlled value itself
// is mirrored declaratively (see Root) - no sync effect needed.
function useHandleInteractionBeforeHydration(
  ref: React.RefObject<HTMLElement | null>,
  {
    value,
    defaultValue,
    preHydration,
    onValueChange,
  }: {
    value?: string;
    defaultValue?: string;
    preHydration: "ignore" | "report";
    onValueChange?: (value: string) => void;
  },
) {
  const ranRef = useRef(false);
  useEffect(() => {
    if (ranRef.current) return;
    const el = ref.current;
    if (!el) return;
    ranRef.current = true;
    const reports = value === undefined || preHydration === "report";
    if (!reports) return;
    const current = selectedValue(el);
    if (current && current !== (value ?? defaultValue))
      onValueChange?.(current);
  }, [ref, value, defaultValue, preHydration, onValueChange]);
}

export const Root: React.FC<{
  children?: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  preHydration?: "ignore" | "report";
  orientation?: "horizontal" | "vertical";
  id?: string;
}> = ({
  children,
  defaultValue,
  value,
  onValueChange,
  preHydration = "ignore",
  orientation,
  id,
}) => {
  const autoId = useId();
  // Trust an explicit id verbatim; only normalise useId()'s colons (":r0:") to
  // dashes so the generated base is valid in id/name/for and CSS selectors.
  const base = id ?? autoId.replace(/:/g, "-");
  const ref = useRef<HTMLElement>(null);

  useHandleInteractionBeforeHydration(ref, {
    value,
    defaultValue,
    preHydration,
    onValueChange,
  });

  return (
    <TabsContext.Provider value={{ base, defaultValue, value, onValueChange }}>
      {React.createElement(
        "ds-tabs",
        {
          ref,
          className: "tabs-root",
          "default-value": defaultValue,
          orientation,
          // Controlled value, rendered declaratively (React owns the attribute;
          // undefined -> omitted). No imperative sync effect needed.
          value,
          // Tell the element to keep a pre-hydration radio pick over `value` at
          // init, so "report" can surface it before the consumer adopts it.
          // Under "ignore" it's omitted, so `value` wins and the pick is dropped.
          "preserve-checked": preHydration === "report" ? "" : undefined,
          // suppressHydrationWarning here and on every part the element mutates
          // (List/Trigger/Content + the radio). This is intentional and follows
          // directly from a design principle: "add a role only once it can be
          // backed". The SSR markup deliberately ships NO tablist roles - only
          // the honest radio-group fallback - and <ds-tabs> grafts on the roles,
          // aria, tabindex, data-state and ids at the same moment it adds the
          // keyboard/focus behaviour that backs them (on upgrade). That makes
          // the upgraded DOM legitimately differ from SSR, which is exactly the
          // divergence React's hydration check flags. We are NOT papering over a
          // bug: emitting those roles in SSR to silence the warning would ship
          // Bad ARIA (a tablist with no behaviour until JS), violating the
          // principle. So we suppress the check on these element-owned nodes
          // only - never on the children passed into Trigger/Content, which the
          // element never touches and React still fully hydrates.
          suppressHydrationWarning: true,
        },
        children,
      )}
    </TabsContext.Provider>
  );
};

export const List: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  // suppressHydrationWarning: element-owned attributes added on upgrade (see Root).
  <div data-tabs-list="" suppressHydrationWarning>
    {children}
  </div>
);

export const Trigger: React.FC<{
  children?: React.ReactNode;
  value?: string;
  id?: string;
}> = ({ children, value, id }) => {
  const ctx = useContext(TabsContext);
  const base = id ?? ctx.base;
  return (
    <label
      data-tabs-trigger=""
      data-value={value}
      htmlFor={`${base}-${value}`}
      // element-owned attributes added on upgrade (see Root).
      suppressHydrationWarning
    >
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
  const ctx = useContext(TabsContext);
  const base = id ?? ctx.base;
  const isDef = isDefault ?? value === (ctx.value ?? ctx.defaultValue);
  return (
    // suppressHydrationWarning on the panel and its radio: element-owned state
    // added on upgrade / driven post-mount (see Root).
    <div data-tabs-content="" data-value={value} suppressHydrationWarning>
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
        suppressHydrationWarning
        // The radio's native change is the source of truth; report selection
        // here instead of bridging the element's event through a useEffect.
        onChange={() => value !== undefined && ctx.onValueChange?.(value)}
      />
      {children}
    </div>
  );
};
