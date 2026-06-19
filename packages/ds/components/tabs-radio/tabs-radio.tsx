import React, { createContext, useContext, useId } from "react";
import "./tabs-radio.css";

const TabsRadioContext = createContext<{
  id?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}>({});

export const Root: React.FC<{
  children?: React.ReactNode;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  // Optional explicit id. useId() is unique within a React root but COLLIDES
  // across separate Astro islands, so pass a distinct id when the same tabs are
  // rendered as multiple islands on one page (the radio `name` must be unique).
  id?: string;
}> = ({ children, defaultValue, onValueChange, id }) => {
  const autoId = useId();
  const resolvedId = id ?? autoId;
  return (
    <TabsRadioContext.Provider value={{ id: resolvedId, defaultValue, onValueChange }}>
      <div className="tabs-radio-root">{children}</div>
    </TabsRadioContext.Provider>
  );
};

export const List: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return <div style={{ display: "flex", gap: "10px" }}>{children}</div>;
};

export const Trigger: React.FC<{
  children?: React.ReactNode;
  value?: string;
}> = ({ children, value }) => {
  const { id } = useContext(TabsRadioContext);
  const inputId = `${id}-${value}`;

  return (
    <>
      <style>{`.tabs-radio-root:has(input[id="${inputId}"]:checked) label[for="${inputId}"] { text-decoration: underline }`}</style>
      <label htmlFor={inputId}>{children}</label>
    </>
  );
};

export const Content: React.FC<{
  children?: React.ReactNode;
  value?: string;
}> = ({ children, value }) => {
  const { id, defaultValue, onValueChange } = useContext(TabsRadioContext);
  return (
    <div className="tabs-radio-content">
      <input
        type="radio"
        name={id}
        value={value}
        id={`${id}-${value}`}
        style={{ display: "none" }}
        defaultChecked={defaultValue === value}
        onChange={
          onValueChange
            ? (e) => {
                if (e.currentTarget.value === value) {
                  onValueChange(value);
                }
              }
            : undefined
        }
      />
      {children}
    </div>
  );
};
