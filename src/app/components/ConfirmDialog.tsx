import React from 'react';
import styled from 'styled-components';

// Styled Components for the dialog
const Overlay = styled.div<{ isOpen: boolean }>`
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
  z-index: 1000; // Ensure the dialog is on top
`;

const DialogBox = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%; // Make it responsive
  text-align: center;
`;

const Message = styled.p`
  margin-bottom: 20px;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center; // Center buttons
  gap: 10px; // Space between buttons
`;

const DialogButton = styled.button`
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.2s ease;

  &.confirm {
    background-color: #4CAF50; // Green for confirm
    color: white;
    &:hover {
      background-color: #388E3C; // Darker green
    }
  }

  &.cancel {
    background-color: #f44336; // Red for cancel/close
    color: white;
    &:hover {
      background-color: #D32F2F; // Darker red
    }
  }
`;

const CONFIRM_BUTTON_TEXT = 'Confirm';
const CANCEL_BUTTON_TEXT = 'Cancel';

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, message, onClose, onConfirm }) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <Overlay isOpen={isOpen}>
      <DialogBox>
        <Message>{message}</Message>
        <ButtonContainer>
          <DialogButton className="confirm" onClick={onConfirm}>{CONFIRM_BUTTON_TEXT}</DialogButton>
          <DialogButton className="cancel" onClick={onClose}>{CANCEL_BUTTON_TEXT}</DialogButton>
        </ButtonContainer>
      </DialogBox>
    </Overlay>
  );
};

export default ConfirmDialog;