import { useState } from "react";
import { createRoot } from "react-dom/client";
import "@repo/ds/style.css";
import { Tabs } from "@repo/ds";

const Uncontrolled = () => {
  const [last, setLast] = useState("");
  return (
    <div data-testid="uncontrolled">
      <Tabs.Root defaultValue="account" onValueChange={setLast}>
        <Tabs.List>
          <Tabs.Trigger value="account">Account</Tabs.Trigger>
          <Tabs.Trigger value="documents">Documents</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>

        <div>
          <Tabs.Content value="account">
            Make changes to your account.
          </Tabs.Content>
          <Tabs.Content value="documents">
            Access and update your documents.
          </Tabs.Content>
          <Tabs.Content value="settings">
            Edit your profile or update contact information.
          </Tabs.Content>
        </div>
      </Tabs.Root>
      <p data-testid="last">{last}</p>
    </div>
  );
};

const Controlled = () => {
  const [value, setValue] = useState("account");
  const [changes, setChanges] = useState(0);
  return (
    <div data-testid="controlled">
      <p>
        Selected: <strong data-testid="value">{value}</strong>{" "}
        <span data-testid="changes">{changes}</span>{" "}
        <button
          type="button"
          data-testid="ext"
          onClick={() => setValue("settings")}
        >
          Jump to Settings
        </button>
      </p>
      <Tabs.Root
        value={value}
        onValueChange={(next) => {
          setValue(next);
          setChanges((count) => count + 1);
        }}
      >
        <Tabs.List>
          <Tabs.Trigger value="account">Account</Tabs.Trigger>
          <Tabs.Trigger value="documents">Documents</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>

        <div>
          <Tabs.Content value="account">
            Make changes to your account.
          </Tabs.Content>
          <Tabs.Content value="documents">
            Access and update your documents.
          </Tabs.Content>
          <Tabs.Content value="settings">
            Edit your profile or update contact information.
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
};

const App = () => (
  <div>
    <h2>Uncontrolled</h2>
    <Uncontrolled />

    <h2>Controlled</h2>
    <Controlled />
  </div>
);

createRoot(document.getElementById("app")!).render(<App />);
