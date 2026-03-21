import React, { useEffect, useState } from 'react';
import { recordingsService } from '../../services/recordings.service';
import { Recording } from '../../types/recordings.types';
import { RecordingItem } from './RecordingItem';
import { RecordingsFilters } from './RecordingsFilters';
import { Loader } from '../UI/Loader';
import { localToUtc } from '../../utils/helpers';
import './RecordingsList.css';

export const RecordingsList: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableStreams, setAvailableStreams] = useState<string[]>([]);
  const [selectedStream, setSelectedStream] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Загружаем список доступных потоков
  useEffect(() => {
    const loadStreams = async () => {
      try {
        const data = await recordingsService.getRecordings();
        // Используем Set для получения уникальных имён потоков
        const streams = [...new Set(data.map(r => r.streamName).filter(Boolean))];
        setAvailableStreams(streams);
        if (streams.length > 0 && !selectedStream) {
          setSelectedStream(streams[0]);
        }
      } catch (e) {
        console.error('[RecordingsList] Failed to load streams:', e);
      }
    };
    loadStreams();
  }, []);

  const loadRecordings = async () => {
    setLoading(true);
    try {
      const data = await recordingsService.getRecordings(selectedStream || undefined);

      // Фильтрация по временному диапазону
      // dateFrom и dateTo - локальное время (Самара), конвертируем в UTC для сравнения
      let filtered = data;
      if (dateFrom) {
        const fromDateUtc = localToUtc(dateFrom);
        filtered = filtered.filter(rec => {
          const recDate = new Date(rec.createdAt);
          return recDate >= fromDateUtc;
        });
      }
      if (dateTo) {
        const toDateUtc = localToUtc(dateTo);
        filtered = filtered.filter(rec => {
          const recDate = new Date(rec.createdAt);
          return recDate <= toDateUtc;
        });
      }

      // Сортировка
      const sorted = [...filtered].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });

      setRecordings(sorted);
    } catch (error) {
      console.error('Failed to load recordings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStream) {
      loadRecordings();
    }
  }, [selectedStream, dateFrom, dateTo, sortOrder]);

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
        streams={availableStreams}
        selectedStream={selectedStream}
        dateFrom={dateFrom}
        dateTo={dateTo}
        sortOrder={sortOrder}
        onStreamChange={setSelectedStream}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onSortOrderChange={setSortOrder}
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
