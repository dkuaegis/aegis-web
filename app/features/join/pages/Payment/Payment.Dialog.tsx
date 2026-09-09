import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}

export default function PaymentDialog({
  open,
  onOpenChange,
  title,
  children,
}: PaymentDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="join-payment-overlay" />
        <Dialog.Content
          className="join-payment-dialog"
          aria-describedby={undefined}
        >
          <header className="join-payment-dialog-header">
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close
              className="join-payment-dialog-close"
              aria-label="닫기"
            >
              <X aria-hidden="true" />
            </Dialog.Close>
          </header>
          <div className="join-payment-dialog-content">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
