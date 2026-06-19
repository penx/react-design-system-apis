import { useState } from "react";
import { createRoot } from "react-dom/client";
import "@repo/ds/style.css";
import { Tabs } from "@repo/ds";

const Uncontrolled = () => (
  <Tabs.Root
    defaultValue="account"
    onValueChange={(value: string) => console.log(value)}
  >
    <Tabs.List>
      <Tabs.Trigger value="account">Account</Tabs.Trigger>
      <Tabs.Trigger value="documents">Documents</Tabs.Trigger>
      <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
    </Tabs.List>

    <div>
      <Tabs.Content value="account">Make changes to your account.</Tabs.Content>
      <Tabs.Content value="documents">
        Access and update your documents.
      </Tabs.Content>
      <Tabs.Content value="settings">
        Edit your profile or update contact information.
      </Tabs.Content>
    </div>
  </Tabs.Root>
);

const Controlled = () => {
  const [value, setValue] = useState("account");
  return (
    <div>
      <p>
        Selected: <strong>{value}</strong>{" "}
        {/* Drives the tab from outside the component to show it is controlled. */}
        <button type="button" onClick={() => setValue("settings")}>
          Jump to Settings
        </button>
      </p>
      <Tabs.Root value={value} onValueChange={setValue}>
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
