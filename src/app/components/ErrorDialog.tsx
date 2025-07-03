import React from 'react';
import styled from 'styled-components';

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 15px;
`;

const CloseButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;

  &:hover {
    background-color: #d32f2f;
  }
`;

const ERROR_DIALOG_TITLE = '오류 발생';
const CLOSE_BUTTON_TEXT = '닫기';


interface ErrorDialogProps {
  message: string;
  onClose: () => void;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({ message, onClose }) => {
  return (
    <DialogOverlay>
      <DialogContent>
        <h2>{ERROR_DIALOG_TITLE}</h2>
        <ErrorMessage>{message}</ErrorMessage>
        <CloseButton onClick={onClose}>{CLOSE_BUTTON_TEXT}</CloseButton>
      </DialogContent>
    </DialogOverlay>
  );
};

export default ErrorDialog;