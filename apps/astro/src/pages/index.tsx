import {
  TabsRadio,
  TabsDetails,
  TabsTarget,
  TabsElement,
  TabsElementTarget,
  TabsElementRadio,
} from "@repo/ds";

export default function Component() {
  return (
    <div>
      <h2>TabsRadio (radio + :has)</h2>
      <TabsRadio.Root
        defaultValue="account"
        onValueChange={(value: string) => console.log(value)}
      >
        <TabsRadio.List>
          <TabsRadio.Trigger value="account">Account</TabsRadio.Trigger>
          <TabsRadio.Trigger value="documents">Documents</TabsRadio.Trigger>
          <TabsRadio.Trigger value="settings">Settings</TabsRadio.Trigger>
        </TabsRadio.List>

        <div>
          <TabsRadio.Content value="account">
            Make changes to your account.
          </TabsRadio.Content>

          <TabsRadio.Content value="documents">
            Access and update your documents.
          </TabsRadio.Content>

          <TabsRadio.Content value="settings">
            Edit your profile or update contact information.
          </TabsRadio.Content>
        </div>
      </TabsRadio.Root>

      <h2>TabsDetails (native &lt;details name&gt;)</h2>
      <TabsDetails.Root
        defaultValue="account"
        onValueChange={(value: string) => console.log(value)}
      >
        <TabsDetails.Content value="account">
          <TabsDetails.Trigger>Account</TabsDetails.Trigger>
          Make changes to your account.
        </TabsDetails.Content>

        <TabsDetails.Content value="documents">
          <TabsDetails.Trigger>Documents</TabsDetails.Trigger>
          Access and update your documents.
        </TabsDetails.Content>

        <TabsDetails.Content value="settings">
          <TabsDetails.Trigger>Settings</TabsDetails.Trigger>
          Edit your profile or update contact information.
        </TabsDetails.Content>
      </TabsDetails.Root>

      <h2>TabsTarget (pure CSS :target, no JS)</h2>
      <TabsTarget.Root defaultValue="account">
        <TabsTarget.List>
          <TabsTarget.Trigger value="account">Account</TabsTarget.Trigger>
          <TabsTarget.Trigger value="documents">Documents</TabsTarget.Trigger>
          <TabsTarget.Trigger value="settings">Settings</TabsTarget.Trigger>
        </TabsTarget.List>

        <TabsTarget.Content value="account">
          Make changes to your account.
        </TabsTarget.Content>

        <TabsTarget.Content value="documents">
          Access and update your documents.
        </TabsTarget.Content>

        <TabsTarget.Content value="settings">
          Edit your profile or update contact information.
        </TabsTarget.Content>
      </TabsTarget.Root>

      <h2>TabsElement (custom element, no no-JS fallback)</h2>
      <TabsElement.Root
        defaultValue="account"
        onValueChange={(value: string) => console.log(value)}
      >
        <TabsElement.List>
          <TabsElement.Trigger value="account">Account</TabsElement.Trigger>
          <TabsElement.Trigger value="documents">Documents</TabsElement.Trigger>
          <TabsElement.Trigger value="settings">Settings</TabsElement.Trigger>
        </TabsElement.List>

        <TabsElement.Content value="account">
          Make changes to your account.
        </TabsElement.Content>

        <TabsElement.Content value="documents">
          Access and update your documents.
        </TabsElement.Content>

        <TabsElement.Content value="settings">
          Edit your profile or update contact information.
        </TabsElement.Content>
      </TabsElement.Root>

      <h2>TabsElementTarget (custom element, :target fallback)</h2>
      <TabsElementTarget.Root
        defaultValue="account"
        onValueChange={(value: string) => console.log(value)}
      >
        <TabsElementTarget.List>
          <TabsElementTarget.Trigger value="account">Account</TabsElementTarget.Trigger>
          <TabsElementTarget.Trigger value="documents">Documents</TabsElementTarget.Trigger>
          <TabsElementTarget.Trigger value="settings">Settings</TabsElementTarget.Trigger>
        </TabsElementTarget.List>

        <TabsElementTarget.Content value="account">
          Make changes to your account.
        </TabsElementTarget.Content>

        <TabsElementTarget.Content value="documents">
          Access and update your documents.
        </TabsElementTarget.Content>

        <TabsElementTarget.Content value="settings">
          Edit your profile or update contact information.
        </TabsElementTarget.Content>
      </TabsElementTarget.Root>

      <h2>TabsElementRadio (custom element, radio no-JS fallback)</h2>
      <TabsElementRadio.Root
        defaultValue="account"
        onValueChange={(value: string) => console.log(value)}
      >
        <TabsElementRadio.List>
          <TabsElementRadio.Trigger value="account">Account</TabsElementRadio.Trigger>
          <TabsElementRadio.Trigger value="documents">Documents</TabsElementRadio.Trigger>
          <TabsElementRadio.Trigger value="settings">Settings</TabsElementRadio.Trigger>
        </TabsElementRadio.List>

        <TabsElementRadio.Content value="account">
          Make changes to your account.
        </TabsElementRadio.Content>

        <TabsElementRadio.Content value="documents">
          Access and update your documents.
        </TabsElementRadio.Content>

        <TabsElementRadio.Content value="settings">
          Edit your profile or update contact information.
        </TabsElementRadio.Content>
      </TabsElementRadio.Root>
    </div>
  );
}
