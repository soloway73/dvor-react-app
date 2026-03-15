import React from 'react';
import { Header } from '../components/Layout/Header';
import { RecordingsList } from '../components/Recordings/RecordingsList';
import './RecordingsPage.css';

export const RecordingsPage: React.FC = () => {
  return (
    <div className="recordings-page">
      <Header />
      <main className="recordings-content">
        <h1>📼 Записи</h1>
        <RecordingsList />
      </main>
    </div>
  );
};
