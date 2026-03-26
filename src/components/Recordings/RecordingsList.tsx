import React, { useEffect, useState } from 'react';
import { recordingsService } from '../../services/recordings.service';
import { Recording, PaginationParams } from '../../types/recordings.types';
import { RecordingItem } from './RecordingItem';
import { RecordingsFilters } from './RecordingsFilters';
import { Loader } from '../UI/Loader';
import { Pagination } from '../UI/Pagination';
import { useRecordingsStore } from '../../store/recordings.store';
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(50);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  
  const { currentRecordingIndex, setCurrentRecordingIndex } = useRecordingsStore();

  // Загружаем список доступных потоков
  useEffect(() => {
    const loadStreams = async () => {
      try {
        // Используем новый endpoint для получения списка потоков
        const streams = await recordingsService.getStreams();
        
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
      const order: 'asc' | 'desc' = sortOrder === 'newest' ? 'desc' : 'asc';

      const params: PaginationParams = {
        page: currentPage,
        per_page: perPage,
        sort: 'date',
        order,
      };

      if (selectedStream) {
        params.stream = selectedStream;
      }

      // Если есть фильтры по датам, конвертируем в UTC и форматируем в формат API: YYYY-MM-DD_HH-MM
      // dateFrom и dateTo - это локальное время (Самара UTC+4) из datetime-local input
      if (dateFrom) {
        const date = new Date(dateFrom);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        params.date_from = `${year}-${month}-${day}_${hours}-${minutes}`;
      }

      if (dateTo) {
        const date = new Date(dateTo);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        params.date_to = `${year}-${month}-${day}_${hours}-${minutes}`;
      }

      const response = await recordingsService.getRecordings(params);

      setRecordings(response.data);
      setTotalItems(response.pagination.total_items);
      setTotalPages(response.pagination.total_pages);
      setHasNext(response.pagination.has_next);
      setHasPrev(response.pagination.has_prev);
    } catch (error) {
      console.error('Failed to load recordings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecordings();
  }, [selectedStream, dateFrom, dateTo, currentPage, sortOrder]);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <Loader />;

  return (
    <div className="recordings-list">
      <RecordingsFilters
        streams={availableStreams}
        selectedStream={selectedStream}
        dateFrom={dateFrom}
        dateTo={dateTo}
        sortOrder={sortOrder}
        onStreamChange={(stream) => {
          setSelectedStream(stream);
          setCurrentPage(1);
        }}
        onDateFromChange={(date) => {
          setDateFrom(date);
          setCurrentPage(1);
        }}
        onDateToChange={(date) => {
          setDateTo(date);
          setCurrentPage(1);
        }}
        onSortOrderChange={(order) => {
          setSortOrder(order);
          setCurrentPage(1);
        }}
        onRefresh={loadRecordings}
      />

      {recordings.length === 0 ? (
        <div className="empty">Записей не найдено</div>
      ) : (
        <ul className="recordings">
          {recordings.map((recording, index) => (
            <RecordingItem
              key={recording.id}
              recording={recording}
              index={index}
              allRecordings={recordings}
              currentIndex={currentRecordingIndex}
              onIndexChange={setCurrentRecordingIndex}
              onModalOpen={() => setIsModalOpen(true)}
              onModalClose={() => setIsModalOpen(false)}
            />
          ))}
        </ul>
      )}

      {/* Пагинация */}
      <Pagination
        meta={{
          page: currentPage,
          per_page: perPage,
          total_items: totalItems,
          total_pages: totalPages,
          has_next: hasNext,
          has_prev: hasPrev,
          next_page: hasNext ? currentPage + 1 : null,
          prev_page: hasPrev ? currentPage - 1 : null,
        }}
        onPageChange={handlePageChange}
      />

      {/* Затемняющий фон под проигрывателем */}
      {isModalOpen && (
        <div className="modal-overlay" />
      )}
    </div>
  );
};
