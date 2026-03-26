import apiClient from '../utils/axios';
import { Recording, RecordingsResponse, PaginationParams } from '../types/recordings.types';

export const recordingsService = {
  async getRecordings(params: PaginationParams = {}): Promise<RecordingsResponse> {
    const url = '/api/recordings/';

    const response = await apiClient.get<RecordingsResponse>(url, {
      params,
      responseType: 'json',
    });

    let data = response.data;
    
    // Если ответ имеет форму {recordings: [...]}, конвертируем в новый формат
    if (data && typeof data === 'object' && Array.isArray((data as any).recordings)) {
      const recordingsData = (data as any).recordings;
      data = {
        data: this.parseJsonRecordings(recordingsData, ''),
        pagination: {
          page: 1,
          per_page: recordingsData.length,
          total_items: recordingsData.length,
          total_pages: 1,
          has_next: false,
          has_prev: false,
          next_page: null,
          prev_page: null,
        },
        filters: { date: null, stream: null },
        sort: { by: 'date', order: 'desc' },
      };
    }
    
    // Если ответ имеет форму {data: [...]}
    if (data && typeof data === 'object' && Array.isArray((data as any).data)) {
      const recordingsData = (data as any).data;
      
      // Парсим записи в правильный формат
      const parsedData = this.parseJsonRecordings(recordingsData, '');
      
      data = {
        ...data,
        data: parsedData,
      } as RecordingsResponse;
    }
    
    return data;
  },

  async getStreams(): Promise<string[]> {
    const response = await apiClient.get<{ streams: string[] }>('/api/recordings/streams');
    return response.data.streams || [];
  },

  filterByDate(recordings: Recording[], date?: string): Recording[] {
    if (!date) return recordings;
    return recordings.filter((rec) => rec.createdAt.startsWith(date));
  },

  parseJsonFolders(data: any): string[] {
    if (!Array.isArray(data)) return [];
    return data
      .filter((item: any) => item.type === 'directory')
      .map((item: any) => item.name);
  },

  parseJsonRecordings(data: any, basePath: string): Recording[] {
    if (!Array.isArray(data)) return [];

    return data
      .filter((item: any) => item.name && item.name.endsWith('.mp4'))
      .map((item: any) => {
        // Извлекаем дату и время из имени файла (формат: 2026-03-26_18-48-35.mp4)
        const dateMatch = item.name.match(/(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})/);
        const createdAt = dateMatch 
          ? `${dateMatch[1]}T${dateMatch[2].replace(/-/g, ':')}` 
          : (item.date ? `${item.date}T00:00:00` : '');
        
        // Извлекаем имя потока из rel_path
        const streamName = item.rel_path 
          ? item.rel_path.split('/')[0] 
          : basePath;

        return {
          id: item.path || item.name,
          path: item.path || (basePath ? `${basePath}/${item.name}` : item.name),
          filename: item.name,
          size: item.size || 0,
          createdAt,
          streamName,
          duration: item.duration,
        };
      });
  },

  async deleteRecording(path: string): Promise<void> {
    await apiClient.delete(`/api/recordings/${path}`);
  },

  getRecordingUrl(path: string, withAuth: boolean = true): string {
    const token = localStorage.getItem('auth_token');
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    
    // Если path уже начинается с /recordings/, используем его напрямую
    if (path.startsWith('/recordings/')) {
      if (withAuth && token) {
        return `${baseUrl}${path}?token=${token}`;
      }
      return `${baseUrl}${path}`;
    }
    
    // Иначе добавляем префикс /api/recordings/
    if (withAuth && token) {
      return `${baseUrl}/api/recordings/${path}?token=${token}`;
    }
    return `${baseUrl}/api/recordings/${path}`;
  },
};
