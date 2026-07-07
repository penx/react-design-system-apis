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

// Uncontrolled Tabs demo. `id` gives deterministic ids for tests (omit it to
// exercise the useId-derived base). The last onValueChange value is rendered
// so tests can assert notifications.
export default function TabsDemo({
  id,
  defaultValue = "account",
  orientation,
}: {
  id?: string;
  defaultValue?: string;
  orientation?: "horizontal" | "vertical";
}) {
  const [last, setLast] = useState("");
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return (
    <div
      data-testid={id ? `demo-${id}` : "demo"}
      data-hydrated={hydrated ? "true" : "false"}
    >
      <Tabs.Root
        id={id}
        defaultValue={defaultValue}
        orientation={orientation}
        onValueChange={setLast}
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
      <p data-testid={id ? `last-${id}` : "last"}>{last}</p>
    </div>
  );
}
