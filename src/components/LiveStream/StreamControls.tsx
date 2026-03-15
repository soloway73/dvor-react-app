import React from 'react';
import { streamService } from '../../services/stream.service';
import { STREAM_NAME } from '../../utils/constants';
import './StreamControls.css';

interface StreamControlsProps {
  onRefresh?: () => void;
}

export const StreamControls: React.FC<StreamControlsProps> = ({ onRefresh }) => {
  const [restarting, setRestarting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleRestart = async () => {
    setRestarting(true);
    setError(null);
    try {
      await streamService.restartStream(STREAM_NAME);
      onRefresh?.();
    } catch {
      setError('Не удалось перезапустить поток');
    } finally {
      setRestarting(false);
    }
  };

  return (
    <div className="stream-controls">
      <button 
        onClick={handleRestart} 
        disabled={restarting}
        className="control-button"
      >
        {restarting ? 'Перезапуск...' : '🔄 Перезапустить поток'}
      </button>
      
      <button onClick={onRefresh} className="control-button">
        🔄 Обновить
      </button>
      
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};
