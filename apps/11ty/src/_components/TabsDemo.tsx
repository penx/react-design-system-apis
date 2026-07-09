import * as React from "react";
import { Tabs } from "@repo/ds";

// `id` is required when more than one instance renders on a page: each carries a
// hidden radio group keyed by name, so without distinct ids two instances would
// group together and emit duplicate DOM ids.
//
// There is no React on the client in this app, so event props like
// onValueChange would never fire - the demo is intentionally structural. The
// tab switching that works without JS comes from the radio fallback; the richer
// tablist behaviour comes from the <ds-tabs> upgrade.
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
