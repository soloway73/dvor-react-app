import React from 'react';
import './RecordingsFilters.css';

interface RecordingsFiltersProps {
  streams: string[];
  selectedStream: string;
  dateFrom: string;
  dateTo: string;
  sortOrder: 'newest' | 'oldest';
  onStreamChange: (stream: string) => void;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onSortOrderChange: (order: 'newest' | 'oldest') => void;
  onRefresh: () => void;
}

export const RecordingsFilters: React.FC<RecordingsFiltersProps> = ({
  streams,
  selectedStream,
  dateFrom,
  dateTo,
  sortOrder,
  onStreamChange,
  onDateFromChange,
  onDateToChange,
  onSortOrderChange,
  onRefresh,
}) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="recordings-filters">
      <div className="filter-group">
        <label>Поток:</label>
        <select
          value={selectedStream}
          onChange={(e) => onStreamChange(e.target.value)}
          className="filter-select"
        >
          <option value="">Все потоки</option>
          {streams.map((stream) => (
            <option key={stream} value={stream}>
              {stream}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Порядок:</label>
        <select
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as 'newest' | 'oldest')}
          className="filter-select"
        >
          <option value="newest">По убыванию</option>
          <option value="oldest">По возрастанию</option>
        </select>
      </div>

      <div className="filter-group filter-group-time">
        <label>Период:</label>
        <div className="time-range-inputs">
          <input
            type="datetime-local"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            max={dateTo || today}
            className="filter-input"
            placeholder="От"
          />
          <span className="time-separator">—</span>
          <input
            type="datetime-local"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            max={today}
            min={dateFrom}
            className="filter-input"
            placeholder="До"
          />
        </div>
      </div>

      <button onClick={onRefresh} className="refresh-button">
        🔄 Обновить
      </button>

      {(selectedStream || dateFrom || dateTo) && (
        <button
          onClick={() => {
            onStreamChange('');
            onDateFromChange('');
            onDateToChange('');
          }}
          className="clear-button"
        >
          ✕ Сбросить
        </button>
      )}
    </div>
  );
};
