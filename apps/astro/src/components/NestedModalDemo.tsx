import { useEffect, useState } from "react";
import { Modal } from "@repo/ds";

export default function NestedModalDemo({ id }: { id: string }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return (
    <div
      data-testid={`nmodal-${id}`}
      data-hydrated={hydrated ? "true" : "false"}
    >
      <Modal.Root id={`${id}-outer`}>
        <Modal.Trigger data-testid={`${id}-outer-open`}>
          Open outer
        </Modal.Trigger>
        <Modal.Content>
          <Modal.Title>Outer</Modal.Title>
          <div style={{ padding: "0 16px 16px" }}>
            <Modal.Root id={`${id}-inner`}>
              <Modal.Trigger data-testid={`${id}-inner-open`}>
                Open inner
              </Modal.Trigger>
              <Modal.Content>
                <Modal.Title>Inner</Modal.Title>
                <div style={{ padding: "0 16px 16px" }}>
                  <Modal.Close data-testid={`${id}-inner-done`}>
                    Close inner
                  </Modal.Close>
                </div>
              </Modal.Content>
            </Modal.Root>
            <Modal.Close data-testid={`${id}-outer-done`}>
              Close outer
            </Modal.Close>
          </div>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}
