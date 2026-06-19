import { Tabs } from "@repo/ds";

// `id` is required when more than one instance renders on a page: each Astro
// render restarts useId(), so without a distinct id both instances would share
// a radio-group `name` (grouping them into one) and emit duplicate DOM ids.
export default function Component({ id }: { id: string }) {
  return (
    <div>
      <Tabs.Root
        id={id}
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
}
