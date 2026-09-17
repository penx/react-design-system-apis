import { useState } from "react";
import { createRoot } from "react-dom/client";
import "@repo/ds/style.css";
import "@repo/ds/components/modal.css";
import { Modal, Tabs } from "@repo/ds";

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

const ModalDemo = () => (
  <div data-testid="modal">
    <Modal.Root>
      <Modal.Trigger data-testid="open">Open</Modal.Trigger>
      <Modal.Content>
        <Modal.Title>Account settings</Modal.Title>
        <Modal.Description>
          Make changes to your account here.
        </Modal.Description>
        <div style={{ padding: "0 16px 16px" }}>
          <Modal.Close data-testid="done">Done</Modal.Close>
        </div>
      </Modal.Content>
    </Modal.Root>
  </div>
);

const ControlledModal = () => {
  const [open, setOpen] = useState(false);
  return (
    <div data-testid="cmodal">
      <p>
        Open: <strong data-testid="cmodal-state">{String(open)}</strong>{" "}
        {/* Drives the modal from outside, programmatically. */}
        <button
          type="button"
          data-testid="cmodal-ext-open"
          onClick={() => setOpen(true)}
        >
          Open externally
        </button>
      </p>
      <Modal.Root open={open} onOpenChange={setOpen}>
        <Modal.Trigger data-testid="cmodal-trigger">Open</Modal.Trigger>
        <Modal.Content>
          <Modal.Title>Controlled</Modal.Title>
          <Modal.Description>Driven by React state.</Modal.Description>
          <div style={{ padding: "0 16px 16px" }}>
            <Modal.Close data-testid="cmodal-done">Done</Modal.Close>
          </div>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};

const App = () => (
  <div>
    <h2>Uncontrolled</h2>
    <Uncontrolled />

    <h2>Controlled</h2>
    <Controlled />

    <h2>Modal</h2>
    <ModalDemo />

    <h2>Controlled Modal</h2>
    <ControlledModal />
  </div>
);

createRoot(document.getElementById("app")!).render(<App />);
