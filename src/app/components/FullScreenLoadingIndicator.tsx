import React from 'react';

interface FullScreenLoadingIndicatorProps {
  isOpen: boolean;
}

const FullScreenLoadingIndicator: React.FC<FullScreenLoadingIndicatorProps> = ({ isOpen }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000 // Ensure it's on top of other elements
    }}>
      <p style={{ fontSize: '1.5em', color: '#00bcd4' }}>Loading...</p> {/* Simple loading text */}
    </div>
  );
};

export default FullScreenLoadingIndicator;