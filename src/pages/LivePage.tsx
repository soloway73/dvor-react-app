import React, { useState, useEffect } from 'react';
import { Header } from '../components/Layout/Header';
import { StreamPlayer } from '../components/LiveStream/StreamPlayer';
import { StreamControls } from '../components/LiveStream/StreamControls';
import { StreamSelector } from '../components/LiveStream/StreamSelector';
import { streamService } from '../services/stream.service';
import './LivePage.css';

export const LivePage: React.FC = () => {
  const authToken = localStorage.getItem('auth_token');
  const [key, setKey] = useState(0);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [streamReady, setStreamReady] = useState(true);
  const [streamLoading, setStreamLoading] = useState(false);

  const streamUrl = selectedStream
    ? `${import.meta.env.VITE_API_BASE_URL}/hls/${selectedStream}/index.m3u8`
    : import.meta.env.VITE_HLS_STREAM_URL;

  // Получаем статус выбранного потока
  useEffect(() => {
    if (!selectedStream) {
      setStreamReady(true);
      return;
    }

    setStreamLoading(true);
    
    const fetchStreamStatus = async () => {
      try {
        const status = await streamService.getStreamStatus(selectedStream);
        setStreamReady(status.ready && status.online);
      } catch (error) {
        console.error('Failed to fetch stream status:', error);
        setStreamReady(false);
      } finally {
        setStreamLoading(false);
      }
    };

    fetchStreamStatus();
    
    // Обновляем статус каждые 5 секунд
    const interval = setInterval(fetchStreamStatus, 5000);
    return () => clearInterval(interval);
  }, [selectedStream]);

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  const handleStreamSelect = (streamName: string) => {
    setSelectedStream(streamName);
    setKey((prev) => prev + 1);
  };

  return (
    <div className="live-page">
      <Header />
      <main className="live-content">
        <div className="live-header">
          <h1>🔴 Live Трансляция</h1>
          <div className="live-header-controls">
            <StreamSelector
              selectedStream={selectedStream}
              onStreamSelect={handleStreamSelect}
            />
          </div>
        </div>

        <div className="live-player-wrapper">
          {streamLoading ? (
            <div className="stream-loading">Загрузка статуса потока...</div>
          ) : (
            <StreamPlayer
              key={key}
              streamUrl={streamUrl}
              authToken={authToken}
              autoPlay={true}
              isReady={streamReady}
            />
          )}
        </div>

        <StreamControls onRefresh={handleRefresh} />
      </main>
    </div>
  );
};
