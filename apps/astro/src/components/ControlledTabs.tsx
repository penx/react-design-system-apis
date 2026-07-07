import { useEffect, useState } from "react";
import { Tabs } from "@repo/ds";

const ITEMS = [
  { value: "account", label: "Account", body: "Make changes to your account." },
  {
    value: "documents",
    label: "Documents",
    body: "Access and update your documents.",
  },
  {
    value: "settings",
    label: "Settings",
    body: "Edit your profile or update contact information.",
  },
];

// Controlled Tabs demo. `value` is owned by React state; an external button
// drives it programmatically. `changes` counts onValueChange calls so tests can
// tell user interaction (fires) from a programmatic value change (does not).
export default function ControlledTabs({
  id,
  preHydration,
}: {
  id: string;
  preHydration: "ignore" | "report";
}) {
  const [value, setValue] = useState("account");
  const [changes, setChanges] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return (
    <div data-testid={`ctrl-${id}`} data-hydrated={hydrated ? "true" : "false"}>
      <button
        type="button"
        data-testid={`${id}-ext`}
        onClick={() => setValue("settings")}
      >
        Set settings externally
      </button>
      <p data-testid={`${id}-value`}>{value}</p>
      <p data-testid={`${id}-changes`}>{changes}</p>
      <Tabs.Root
        id={id}
        value={value}
        preHydration={preHydration}
        onValueChange={(next) => {
          setValue(next);
          setChanges((count) => count + 1);
        }}
      >
        <Tabs.List>
          {ITEMS.map((item) => (
            <Tabs.Trigger key={item.value} id={id} value={item.value}>
              {item.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <div>
          {ITEMS.map((item) => (
            <Tabs.Content key={item.value} id={id} value={item.value}>
              {item.body}
            </Tabs.Content>
          ))}
        </div>
      </Tabs.Root>
    </div>
  );
}
