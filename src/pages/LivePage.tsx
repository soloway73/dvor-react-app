import React, { useState } from 'react';
import { Header } from '../components/Layout/Header';
import { StreamPlayer } from '../components/LiveStream/StreamPlayer';
import { StreamStatus } from '../components/LiveStream/StreamStatus';
import { StreamControls } from '../components/LiveStream/StreamControls';
import './LivePage.css';

export const LivePage: React.FC = () => {
  const authToken = localStorage.getItem('auth_token');
  const [key, setKey] = useState(0);

  const streamUrl = import.meta.env.VITE_HLS_STREAM_URL;

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="live-page">
      <Header />
      <main className="live-content">
        <div className="live-header">
          <h1>🔴 Live Трансляция</h1>
          <StreamStatus />
        </div>

        <div className="live-player-wrapper">
          <StreamPlayer
            key={key}
            streamUrl={streamUrl}
            authToken={authToken}
            autoPlay={true}
          />
        </div>

        <StreamControls onRefresh={handleRefresh} />
      </main>
    </div>
  );
};
