import React, { useEffect, useState } from 'react';
import { streamService } from '../../services/stream.service';
import { StreamInfo } from '../../types/stream.types';
import './StreamSelector.css';

interface StreamSelectorProps {
  selectedStream: string | null;
  onStreamSelect: (streamName: string) => void;
}

export const StreamSelector: React.FC<StreamSelectorProps> = ({
  selectedStream,
  onStreamSelect,
}) => {
  const [streams, setStreams] = useState<StreamInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStreams = async () => {
      try {
        setLoading(true);
        const data = await streamService.getStreams();
        setStreams(data);
        setError(null);
        
        // Если есть потоки и ни один не выбран, выбираем первый онлайн
        if (data.length > 0 && !selectedStream) {
          const onlineStream = data.find(s => s.online) || data[0];
          onStreamSelect(onlineStream.name);
        }
      } catch (err) {
        setError('Не удалось загрузить список потоков');
        console.error('Failed to load streams:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStreams();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStreamSelect(e.target.value);
  };

  if (loading) {
    return (
      <div className="stream-selector">
        <span className="stream-selector-label">Поток:</span>
        <span className="stream-selector-loading">Загрузка...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stream-selector">
        <span className="stream-selector-label">Поток:</span>
        <span className="stream-selector-error">{error}</span>
      </div>
    );
  }

  if (streams.length === 0) {
    return (
      <div className="stream-selector">
        <span className="stream-selector-label">Поток:</span>
        <span className="stream-selector-no-streams">Нет доступных потоков</span>
      </div>
    );
  }

  return (
    <div className="stream-selector">
      <label htmlFor="stream-select" className="stream-selector-label">
        Поток:
      </label>
      <select
        id="stream-select"
        value={selectedStream || ''}
        onChange={handleChange}
        className="stream-selector-dropdown"
      >
        {streams.map((stream) => {
          const isDisabled = !stream.online || !stream.ready;
          const statusText = !stream.ready ? '⚪ Поток недоступен' : !stream.online ? '⚫ Оффлайн' : '🔴 В эфире';
          return (
            <option
              key={stream.name}
              value={stream.name}
              disabled={isDisabled}
              title={!stream.ready ? 'Поток ещё не готов к воспроизведению' : !stream.online ? 'Поток оффлайн' : ''}
            >
              {stream.name} {statusText}
            </option>
          );
        })}
      </select>
    </div>
  );
};
