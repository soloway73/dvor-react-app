import { useState, useEffect, useCallback } from 'react';
import { recordingsService } from '../services/recordings.service';
import { Recording } from '../types/recordings.types';

interface UseRecordingsOptions {
  streamName?: string;
  date?: string;
  autoFetch?: boolean;
}

export const useRecordings = (options: UseRecordingsOptions = {}) => {
  const { streamName, date, autoFetch = true } = options;
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchRecordings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await recordingsService.getRecordings(streamName, date);
      setRecordings(data);
    } catch (err) {
      setError('Не удалось загрузить записи');
      console.error('Failed to fetch recordings:', err);
    } finally {
      setIsLoading(false);
    }
  }, [streamName, date]);

  useEffect(() => {
    if (autoFetch) {
      fetchRecordings();
    }
  }, [autoFetch, fetchRecordings]);

  const deleteRecording = async (path: string) => {
    try {
      await recordingsService.deleteRecording(path);
      setRecordings((prev) => prev.filter((r) => r.path !== path));
    } catch {
      throw new Error('Не удалось удалить запись');
    }
  };

  return {
    recordings,
    isLoading,
    error,
    refetch: fetchRecordings,
    deleteRecording,
  };
};
