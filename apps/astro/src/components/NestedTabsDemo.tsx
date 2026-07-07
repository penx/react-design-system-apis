import { useEffect, useState } from "react";
import { Tabs } from "@repo/ds";

// Tabs within tabs: the "account" panel of the outer set contains an inner
// Tabs.Root. Both are uncontrolled; useId gives each a distinct base so they
// don't collide or cross-talk.
export default function NestedTabsDemo() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return (
    <div data-testid="nested-tabs" data-hydrated={hydrated ? "true" : "false"}>
      <Tabs.Root defaultValue="account">
        <Tabs.List>
          <Tabs.Trigger value="account">Account</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>
        <div>
          <Tabs.Content value="account">
            <p>Outer account panel.</p>
            <div data-testid="inner">
              <Tabs.Root defaultValue="profile">
                <Tabs.List>
                  <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
                  <Tabs.Trigger value="email">Email</Tabs.Trigger>
                </Tabs.List>
                <div>
                  <Tabs.Content value="profile">Inner profile.</Tabs.Content>
                  <Tabs.Content value="email">Inner email.</Tabs.Content>
                </div>
              </Tabs.Root>
            </div>
          </Tabs.Content>
          <Tabs.Content value="settings">Outer settings panel.</Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}
