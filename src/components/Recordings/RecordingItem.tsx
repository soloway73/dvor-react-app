import React, { useState } from 'react';
import { Recording } from '../../types/recordings.types';
import { recordingsService } from '../../services/recordings.service';
import { formatDateTime } from '../../utils/helpers';
import './RecordingItem.css';

interface RecordingItemProps {
  recording: Recording;
  index: number;
  allRecordings: Recording[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onModalOpen?: () => void;
  onModalClose?: () => void;
}

export const RecordingItem: React.FC<RecordingItemProps> = ({
  recording,
  index,
  allRecordings,
  currentIndex,
  onIndexChange,
  onModalOpen,
  onModalClose,
}) => {
  const [playing, setPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [navigationLoading, setNavigationLoading] = useState(false);

  const isCurrentPlaying = currentIndex === index && playing;

  const handlePlay = async () => {
    setLoading(true);
    onIndexChange(index);

    try {
      const token = localStorage.getItem('auth_token');
      const url = recordingsService.getRecordingUrl(recording.path, false);

      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      if (!response.ok) {
        console.error(
          '[RecordingItem] Failed to load video:',
          response.status,
          response.statusText
        );
        return;
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      setVideoUrl(blobUrl);
      setPlaying(true);
      onModalOpen?.();
    } catch (error) {
      console.error('[RecordingItem] Error loading video:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = async (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex < 0 || newIndex >= allRecordings.length) {
      return;
    }

    setNavigationLoading(true);
    onIndexChange(newIndex);

    try {
      const token = localStorage.getItem('auth_token');
      const newRecording = allRecordings[newIndex];
      const url = recordingsService.getRecordingUrl(newRecording.path, false);

      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      if (!response.ok) {
        console.error(
          '[RecordingItem] Failed to load video:',
          response.status,
          response.statusText
        );
        return;
      }

      const blob = await response.blob();
      
      // Revoke old URL to free memory
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      
      const blobUrl = URL.createObjectURL(blob);
      setVideoUrl(blobUrl);
    } catch (error) {
      console.error('[RecordingItem] Navigation error:', error);
    } finally {
      setNavigationLoading(false);
    }
  };

  const handlePrev = () => handleNavigate('prev');
  const handleNext = () => handleNavigate('next');

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const url = recordingsService.getRecordingUrl(recording.path, false);

      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      if (!response.ok) {
        console.error('[RecordingItem] Failed to download:', response.status, response.statusText);
        return;
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = recording.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('[RecordingItem] Download error:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleClose = () => {
    setPlaying(false);
    onIndexChange(-1);
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl('');
    }
    onModalClose?.();
  };

  const hasPrev = currentIndex < allRecordings.length - 1;
  const hasNext = currentIndex > 0;

  return (
    <li className="recording-item">
      <div className="recording-info">
        <div className="recording-icon">📹</div>
        <div className="recording-details">
          <div className="recording-name">{recording.filename}</div>
          <div className="recording-meta">📅 {formatDateTime(recording.createdAt)}</div>
        </div>
      </div>

      <div className="recording-actions">
        <button onClick={handlePlay} className="action-button play" disabled={loading}>
          {loading ? '⏳ Загрузка...' : '▶️ Смотреть'}
        </button>
        <button onClick={handleDownload} className="action-button download" disabled={downloading}>
          {downloading ? '⏳ Скачивание...' : '⬇️ Скачать'}
        </button>
      </div>

      {playing && (
        <div className="recording-player-modal" onClick={handleClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {navigationLoading && (
              <div className="navigation-preloader">
                <div className="preloader-spinner"></div>
                <span>Загрузка видео...</span>
              </div>
            )}
            <video 
              controls 
              autoPlay 
              src={videoUrl} 
              className="modal-video"
              style={{ opacity: navigationLoading ? 0.3 : 1 }}
            />
            <div className="player-controls">
              <button 
                onClick={handlePrev} 
                className="nav-button prev" 
                disabled={!hasPrev || navigationLoading}
                title="Предыдущее видео"
              >
                ◀️ Назад
              </button>
              <button onClick={handleClose} className="close-button">
                Закрыть
              </button>
              <button 
                onClick={handleNext} 
                className="nav-button next" 
                disabled={!hasNext || navigationLoading}
                title="Следующее видео"
              >
                Вперёд ▶️
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};
