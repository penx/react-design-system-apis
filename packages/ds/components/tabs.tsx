import React, { createContext, useContext, useId } from "react";
import "./tabs.css";

const TabsRootContext = createContext<{
  id?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}>({});

export const Root: React.FC<{
  children?: React.ReactNode;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}> = ({ children, defaultValue, onValueChange }) => {
  const id = useId();
  return (
    <TabsRootContext.Provider value={{ id, defaultValue, onValueChange }}>
      <div className="tabs-root">{children}</div>
    </TabsRootContext.Provider>
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
  const { id } = useContext(TabsRootContext);
  const inputId = `${id}-${value}`;

  return (
    <>
      <style>{`.tabs-root:has(input[id="${inputId}"]:checked) label[for="${inputId}"] { text-decoration: underline }`}</style>
      <label htmlFor={inputId}>{children}</label>
    </>
  );
};

export const Content: React.FC<{
  children?: React.ReactNode;
  value?: string;
}> = ({ children, value }) => {
  const { id, defaultValue, onValueChange } = useContext(TabsRootContext);
  return (
    <div className="tabs-content">
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
