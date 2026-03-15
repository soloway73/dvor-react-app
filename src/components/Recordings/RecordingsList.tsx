import React, { useEffect, useState } from 'react';
import { recordingsService } from '../../services/recordings.service';
import { Recording } from '../../types/recordings.types';
import { RecordingItem } from './RecordingItem';
import { RecordingsFilters } from './RecordingsFilters';
import { Loader } from '../UI/Loader';
import './RecordingsList.css';

const AVAILABLE_STREAMS = ['stream', 'react-stream'];

export const RecordingsList: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadRecordings = async () => {
    setLoading(true);
    try {
      const data = await recordingsService.getRecordings(
        selectedStream || undefined,
        selectedDate || undefined
      );
      setRecordings(data);
    } catch (error) {
      console.error('Failed to load recordings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecordings();
  }, [selectedStream, selectedDate]);

  // Блокируем прокрутку и наведение фона когда проигрыватель открыт
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('modal-is-open');
    } else {
      document.body.style.overflow = '';
      document.documentElement.classList.remove('modal-is-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.classList.remove('modal-is-open');
    };
  }, [isModalOpen]);

  if (loading) return <Loader />;

  return (
    <div className="recordings-list">
      <RecordingsFilters
        streams={AVAILABLE_STREAMS}
        selectedStream={selectedStream}
        selectedDate={selectedDate}
        onStreamChange={setSelectedStream}
        onDateChange={setSelectedDate}
        onRefresh={loadRecordings}
      />

      {recordings.length === 0 ? (
        <div className="empty">Записей не найдено</div>
      ) : (
        <ul className="recordings">
          {recordings.map((recording) => (
            <RecordingItem 
              key={recording.id} 
              recording={recording}
              onModalOpen={() => setIsModalOpen(true)}
              onModalClose={() => setIsModalOpen(false)}
            />
          ))}
        </ul>
      )}

      {/* Затемняющий фон под проигрывателем */}
      {isModalOpen && (
        <div className="modal-overlay" />
      )}
    </div>
  );
};
