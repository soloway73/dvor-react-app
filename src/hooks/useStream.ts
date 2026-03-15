import { useState, useEffect, useCallback } from 'react';
import { streamService } from '../services/stream.service';
import { StreamStatus } from '../types/stream.types';

export const useStream = (streamName: string) => {
  const [streamStatus, setStreamStatus] = useState<StreamStatus | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await streamService.getStreamStatus(streamName);
      setStreamStatus(response);
      setIsOnline(response.online || response.ready);
      setError(null);
    } catch {
      setError('Не удалось получить статус потока');
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, [streamName]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const restartStream = async () => {
    try {
      await streamService.restartStream(streamName);
      await fetchStatus();
    } catch {
      throw new Error('Не удалось перезапустить поток');
    }
  };

  return { streamStatus, isOnline, isLoading, error, restartStream, refetch: fetchStatus };
};
