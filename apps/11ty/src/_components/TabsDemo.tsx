import * as React from "react";
import { Tabs } from "@repo/ds";

// `id` scopes the radio-group name/ids; distinct per instance on a page.
export function TabsDemo({ id }: { id: string }) {
  return (
    <Tabs.Root id={id} defaultValue="account">
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
  );
}
