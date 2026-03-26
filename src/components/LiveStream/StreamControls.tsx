import React from 'react';
import './StreamControls.css';

interface StreamControlsProps {
  onRefresh?: () => void;
}

export const StreamControls: React.FC<StreamControlsProps> = ({ onRefresh }) => {
  return (
    <div className="stream-controls">
      <button onClick={onRefresh} className="control-button">
        🔄 Обновить
      </button>
    </div>
  );
};
