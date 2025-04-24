import { createRoot } from "react-dom/client";
import "@repo/ds/style.css";
import { Tabs } from "@repo/ds";

const App = () => (
  <div>
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

createRoot(document.getElementById("app")!).render(<App />);
