import React, { createContext, useContext, useId } from "react";
import "./tabs-details.css";

const TabsDetailsRootContext = createContext<{
  name?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}>({});

export const Root: React.FC<{
  children?: React.ReactNode;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  // Optional explicit id. useId() collides across separate Astro islands, so
  // pass a distinct id per instance to keep each <details name> group separate
  // (otherwise two instances share one exclusive-accordion group).
  id?: string;
}> = ({ children, defaultValue, onValueChange, id }) => {
  const autoId = useId();
  const name = id ?? autoId;
  return (
    <TabsDetailsRootContext.Provider value={{ name, defaultValue, onValueChange }}>
      <div className="tabs-details-root">{children}</div>
    </TabsDetailsRootContext.Provider>
  );
};

export const Trigger: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  // Renders as the <details>'s <summary> - must be a direct child of <details>,
  // so Content places this element directly and wraps everything else.
  return <summary>{children}</summary>;
};

export const Content: React.FC<{
  children?: React.ReactNode;
  value?: string;
}> = ({ children, value }) => {
  const { name, defaultValue, onValueChange } = useContext(TabsDetailsRootContext);

  // Split children: the Trigger becomes the native <summary>; the rest is the panel.
  // Splitting by element type keeps authoring order-independent.
  const childArray = React.Children.toArray(children);
  const trigger = childArray.find(
    (child) => React.isValidElement(child) && child.type === Trigger,
  );
  const panel = childArray.filter((child) => child !== trigger);

  // The panel is a *sibling* of a summary-only <details>, not a child of it.
  // That avoids `display: contents` on <details> (which breaks flex `order` /
  // grid `fr`), letting the flex layout in tabs-details.css keep the triggers
  // tight while the open panel takes its own full-width row. The panel is the
  // immediate next sibling, so CSS links open state via `details[open] + panel`.
  return (
    <>
      <details
        className="tabs-details-content"
        name={name}
        open={defaultValue === value}
        onToggle={
          onValueChange
            ? (e) => {
                if (e.currentTarget.open) {
                  onValueChange(value ?? "");
                }
              }
            : undefined
        }
      >
        {trigger}
      </details>
      <div className="tabs-details-panel">{panel}</div>
    </>
  );
};
