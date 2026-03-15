import { create } from 'zustand';
import { StreamStatus } from '../types/stream.types';

interface StreamState {
  streamStatus: StreamStatus | null;
  isOnline: boolean;
  isLoading: boolean;
  error: string | null;
  setStreamStatus: (status: StreamStatus) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useStreamStore = create<StreamState>((set) => ({
  streamStatus: null,
  isOnline: false,
  isLoading: false,
  error: null,

  setStreamStatus: (status) => {
    set({ streamStatus: status, isOnline: status.online || status.ready, error: null });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error, isLoading: false });
  },

  reset: () => {
    set({ streamStatus: null, isOnline: false, isLoading: false, error: null });
  },
}));
