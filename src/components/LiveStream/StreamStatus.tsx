import React, { useEffect, useState } from 'react';
import { streamService } from '../../services/stream.service';
import { STREAM_NAME } from '../../utils/constants';
import './StreamStatus.css';

interface StreamStatusData {
  ready: boolean;
  online: boolean;
  viewers: number;
}

export const StreamStatus: React.FC = () => {
  const [status, setStatus] = useState<StreamStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await streamService.getStreamStatus(STREAM_NAME);
        setStatus({
          ready: response.ready,
          online: response.online,
          viewers: response.readers?.length || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stream status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="stream-status loading">Загрузка статуса...</div>;

  return (
    <div className="stream-status">
      <span className={`status-indicator ${status?.online ? 'online' : 'offline'}`}>
        {status?.online ? '● В эфире' : '● Оффлайн'}
      </span>
    </div>
  );
};
