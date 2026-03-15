import React from 'react';
import './RecordingsFilters.css';

interface RecordingsFiltersProps {
  streams: string[];
  selectedStream: string;
  selectedDate: string;
  onStreamChange: (stream: string) => void;
  onDateChange: (date: string) => void;
  onRefresh: () => void;
}

export const RecordingsFilters: React.FC<RecordingsFiltersProps> = ({
  streams,
  selectedStream,
  selectedDate,
  onStreamChange,
  onDateChange,
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
        <label>Дата:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          max={today}
          className="filter-input"
        />
      </div>

      <button onClick={onRefresh} className="refresh-button">
        🔄 Обновить
      </button>

      {(selectedStream || selectedDate) && (
        <button
          onClick={() => {
            onStreamChange('');
            onDateChange('');
          }}
          className="clear-button"
        >
          ✕ Сбросить
        </button>
      )}
    </div>
  );
};
