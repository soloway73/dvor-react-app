import { create } from 'zustand';
import { Recording } from '../types/recordings.types';

interface RecordingsState {
  recordings: Recording[];
  isLoading: boolean;
  error: string | null;
  selectedStream: string;
  selectedDate: string;
  setRecordings: (recordings: Recording[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedStream: (stream: string) => void;
  setSelectedDate: (date: string) => void;
  addRecording: (recording: Recording) => void;
  removeRecording: (id: string) => void;
  reset: () => void;
}

export const useRecordingsStore = create<RecordingsState>((set) => ({
  recordings: [],
  isLoading: false,
  error: null,
  selectedStream: '',
  selectedDate: '',

  setRecordings: (recordings) => {
    set({ recordings, error: null });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error, isLoading: false });
  },

  setSelectedStream: (stream) => {
    set({ selectedStream: stream });
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date });
  },

  addRecording: (recording) => {
    set((state) => ({ recordings: [recording, ...state.recordings] }));
  },

  removeRecording: (id) => {
    set((state) => ({ recordings: state.recordings.filter((r) => r.id !== id) }));
  },

  reset: () => {
    set({
      recordings: [],
      isLoading: false,
      error: null,
      selectedStream: '',
      selectedDate: '',
    });
  },
}));
