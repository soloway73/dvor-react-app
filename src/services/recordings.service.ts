import apiClient from '../utils/axios';
import { Recording } from '../types/recordings.types';

export const recordingsService = {
  async getRecordings(streamName?: string, date?: string): Promise<Recording[]> {
    let url = '/api/recordings/';
    if (streamName) {
      url += `${streamName}/`;
    }

    const response = await apiClient.get(url, {
      responseType: 'json',
    });

    const data = response.data;

    // Если нет streamName, сначала получаем список папок, затем рекурсивно загружаем из каждой
    if (!streamName) {
      const folders = this.parseJsonFolders(data);
      const allRecordings: Recording[] = [];
      for (const folder of folders) {
        try {
          const folderRecordings = await this.getRecordings(folder, date);
          allRecordings.push(...folderRecordings);
        } catch (e) {
          console.error('[RecordingsService] Failed to load folder:', folder, e);
        }
      }
      return this.filterByDate(allRecordings, date);
    }

    const recordings = this.parseJsonRecordings(data, streamName);
    return this.filterByDate(recordings, date);
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
      .filter((item: any) => item.type === 'file' && (item.name.endsWith('.mp4') || item.name.endsWith('.mp4.mp4')))
      .map((item: any) => {
        const dateMatch = item.name.match(/(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})/);
        return {
          id: item.name,
          path: basePath ? `${basePath}/${item.name}` : item.name,
          filename: item.name,
          size: item.size || 0,
          createdAt: dateMatch ? `${dateMatch[1]}T${dateMatch[2].replace(/-/g, ':')}` : (item.mtime || ''),
          streamName: basePath,
        };
      });
  },

  async deleteRecording(path: string): Promise<void> {
    await apiClient.delete(`/api/recordings/${path}`);
  },

  getRecordingUrl(path: string, withAuth: boolean = true): string {
    const token = localStorage.getItem('auth_token');
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    if (withAuth && token) {
      return `${baseUrl}/api/recordings/${path}?token=${token}`;
    }
    return `${baseUrl}/api/recordings/${path}`;
  },
};
