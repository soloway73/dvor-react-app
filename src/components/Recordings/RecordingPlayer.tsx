import React, { useEffect, useRef } from 'react';
import './RecordingPlayer.css';

interface RecordingPlayerProps {
  src: string;
  onClose: () => void;
}

export const RecordingPlayer: React.FC<RecordingPlayerProps> = ({ src, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="recording-player-overlay" onClick={onClose}>
      <div className="recording-player-container" onClick={(e) => e.stopPropagation()}>
        <video
          ref={videoRef}
          controls
          autoPlay
          src={src}
          className="recording-player-video"
        />
        <button onClick={onClose} className="recording-player-close">
          ✕ Закрыть
        </button>
      </div>
    </div>
  );
};
