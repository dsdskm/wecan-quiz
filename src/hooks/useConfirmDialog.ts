import { useState } from 'react';

interface ConfirmDialogState {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
}

const useConfirmDialog = () => {
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);

  const openConfirmDialog = (message: string, onConfirm: () => void) => {
    setConfirmDialog({ isOpen: true, message, onConfirm });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(null);
  };

  return {
    confirmDialog,
    openConfirmDialog,
    closeConfirmDialog,
  };
};

export default useConfirmDialog;