import { useEffect, useState } from "react";
import { Modal } from "@repo/ds";

export default function ModalDemo({ id }: { id?: string }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return (
    <div
      data-testid={id ? `modal-${id}` : "modal"}
      data-hydrated={hydrated ? "true" : "false"}
    >
      <Modal.Root id={id}>
        <Modal.Trigger data-testid={id ? `${id}-open` : "open"}>
          Open
        </Modal.Trigger>
        <Modal.Content>
          <Modal.Title>Account settings</Modal.Title>
          <Modal.Description>
            Make changes to your account here.
          </Modal.Description>
          <div style={{ padding: "0 16px 16px" }}>
            <Modal.Close aria-label="Close" data-testid={id ? `${id}-x` : "x"}>
              X
            </Modal.Close>{" "}
            <Modal.Close data-testid={id ? `${id}-done` : "done"}>
              Done
            </Modal.Close>
          </div>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}
