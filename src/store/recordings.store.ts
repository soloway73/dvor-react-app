import { create } from 'zustand';
import { Recording } from '../types/recordings.types';

interface RecordingsState {
  recordings: Recording[];
  isLoading: boolean;
  error: string | null;
  selectedStream: string;
  selectedDate: string;
  currentRecordingIndex: number;
  setRecordings: (recordings: Recording[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedStream: (stream: string) => void;
  setSelectedDate: (date: string) => void;
  addRecording: (recording: Recording) => void;
  removeRecording: (id: string) => void;
  setCurrentRecordingIndex: (index: number) => void;
  reset: () => void;
}

export const useRecordingsStore = create<RecordingsState>((set) => ({
  recordings: [],
  isLoading: false,
  error: null,
  selectedStream: '',
  selectedDate: '',
  currentRecordingIndex: -1,

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

  setCurrentRecordingIndex: (index) => {
    set({ currentRecordingIndex: index });
  },

  reset: () => {
    set({
      recordings: [],
      isLoading: false,
      error: null,
      selectedStream: '',
      selectedDate: '',
      currentRecordingIndex: -1,
    });
  },
}));
