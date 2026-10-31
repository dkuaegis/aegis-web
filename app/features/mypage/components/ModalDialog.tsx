import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

interface ModalDialogProps {
  /** Class of the full-screen overlay element the modal already styles. */
  className: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Gives the mypage overlays dialog behaviour: Escape closes them, focus moves
 * in and stays inside, and returns to the trigger afterwards. Rendered in
 * place rather than in a portal so the feature-scoped styles still apply.
 * Children must include a `ModalDialog.Title`.
 */
function ModalDialog({ className, onClose, children }: ModalDialogProps) {
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Content className={className} aria-describedby={undefined}>
        {children}
      </Dialog.Content>
    </Dialog.Root>
  );
}

ModalDialog.Title = Dialog.Title;

export default ModalDialog;
