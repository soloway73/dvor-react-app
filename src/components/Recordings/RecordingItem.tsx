import React, { useState } from 'react';
import { Recording } from '../../types/recordings.types';
import { recordingsService } from '../../services/recordings.service';
import { formatDateTime } from '../../utils/helpers';
import './RecordingItem.css';

interface RecordingItemProps {
  recording: Recording;
  onModalOpen?: () => void;
  onModalClose?: () => void;
}

export const RecordingItem: React.FC<RecordingItemProps> = ({
  recording,
  onModalOpen,
  onModalClose,
}) => {
  const [playing, setPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handlePlay = async () => {
    setLoading(true);

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
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl('');
    }
    onModalClose?.();
  };

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
            <video controls autoPlay src={videoUrl} className="modal-video" />
            <button onClick={handleClose} className="close-button">
              Закрыть
            </button>
          </div>
        </div>
      )}
    </li>
  );
};
