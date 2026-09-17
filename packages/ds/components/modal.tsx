import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
} from "react";
import "./modal.css";

const ModalContext = createContext<{
  id: string;
  titleId: string;
  descriptionId: string;
  onOpenChange?: (open: boolean) => void;
}>({
  id: "ds-modal",
  titleId: "ds-modal-title",
  descriptionId: "ds-modal-desc",
});

// Separate from the ids context so that stays ref-free (a ref beside the ids
// makes react-hooks/refs flag every ctx read as a render-time ref access).
const ModalDialogRefContext =
  createContext<React.RefObject<HTMLDialogElement | null> | null>(null);

function useControlledPopover(
  ref: React.RefObject<HTMLDialogElement | null>,
  open: boolean | undefined,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || open === undefined) return;
    const isOpen = el.matches(":popover-open");
    if (open && !isOpen) el.showPopover();
    else if (!open && isOpen) el.hidePopover();
  }, [ref, open]);
}

export const Root: React.FC<{
  children?: React.ReactNode;
  id?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}> = ({ children, id, open, onOpenChange }) => {
  const autoId = useId().replace(/:/g, "-");
  const base = id ?? autoId;
  const dialogRef = useRef<HTMLDialogElement>(null);
  useControlledPopover(dialogRef, open);

  return (
    <ModalContext.Provider
      value={{
        id: base,
        titleId: `${base}-title`,
        descriptionId: `${base}-desc`,
        onOpenChange,
      }}
    >
      <ModalDialogRefContext.Provider value={dialogRef}>
        {children}
      </ModalDialogRefContext.Provider>
    </ModalContext.Provider>
  );
};

export const Trigger: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { id?: string }
> = ({ children, id, ...rest }) => {
  const ctx = useContext(ModalContext);
  return (
    <button type="button" popoverTarget={id ?? ctx.id} {...rest}>
      {children}
    </button>
  );
};

export const Content: React.FC<{
  children?: React.ReactNode;
  id?: string;
  className?: string;
}> = ({ children, id, className }) => {
  const ctx = useContext(ModalContext);
  const dialogRef = useContext(ModalDialogRefContext);
  return (
    <dialog
      ref={dialogRef}
      id={id ?? ctx.id}
      popover="auto"
      aria-labelledby={ctx.titleId}
      aria-describedby={ctx.descriptionId}
      className={className ? `ds-modal ${className}` : "ds-modal"}
      onToggle={(e) =>
        ctx.onOpenChange?.(e.currentTarget.matches(":popover-open"))
      }
    >
      {children}
    </dialog>
  );
};

export const Title: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const ctx = useContext(ModalContext);
  return (
    <h2 id={ctx.titleId} className="ds-modal-title">
      {children}
    </h2>
  );
};

export const Description: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const ctx = useContext(ModalContext);
  return (
    <p id={ctx.descriptionId} className="ds-modal-description">
      {children}
    </p>
  );
};

export const Close: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { id?: string }
> = ({ children, id, ...rest }) => {
  const ctx = useContext(ModalContext);
  return (
    <button
      type="button"
      popoverTarget={id ?? ctx.id}
      popoverTargetAction="hide"
      {...rest}
    >
      {children}
    </button>
  );
};
