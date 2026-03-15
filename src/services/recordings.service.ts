import apiClient from '../utils/axios';
import { Recording } from '../types/recordings.types';

export const recordingsService = {
  async getRecordings(streamName?: string, date?: string): Promise<Recording[]> {
    let url = '/recordings/';
    if (streamName) {
      url += `${streamName}/`;
    }

    const response = await apiClient.get(url, {
      params: date ? { date } : {},
      responseType: 'text',
    });

    // Если нет streamName, сначала получаем список папок, затем рекурсивно загружаем из каждой
    if (!streamName) {
      const folders = this.parseNginxFolders(response.data);
      const allRecordings: Recording[] = [];
      for (const folder of folders) {
        try {
          const folderRecordings = await this.getRecordings(folder, date);
          allRecordings.push(...folderRecordings);
        } catch (e) {
          console.error('[RecordingsService] Failed to load folder:', folder, e);
        }
      }
      return allRecordings;
    }

    return this.parseNginxIndex(response.data, streamName || '');
  },

  parseNginxFolders(html: string): string[] {
    const folders: string[] = [];
    const regex = /<a href="([^/]+\/)">[^<]+\/<\/a>/gi;
    let match;

    while ((match = regex.exec(html)) !== null) {
      const folderName = match[1].slice(0, -1); // remove trailing /
      if (folderName !== '..' && folderName !== '') {
        folders.push(folderName);
      }
    }

    return folders;
  },

  parseNginxIndex(html: string, basePath: string): Recording[] {
    const recordings: Recording[] = [];
    const regex = /<a href="([^"]+\.mp4[^"]*)">([^<]+\.mp4)<\/a>/gi;
    let match;

    while ((match = regex.exec(html)) !== null) {
      const [, href, name] = match;
      const dateMatch = name.match(/(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})/);

      recordings.push({
        id: href,
        path: basePath ? `${basePath}/${href}` : href,
        filename: name,
        size: 0,
        createdAt: dateMatch ? `${dateMatch[1]}T${dateMatch[2].replace(/-/g, ':')}` : '',
        streamName: basePath,
      });
    }

    return recordings;
  },

  async deleteRecording(path: string): Promise<void> {
    await apiClient.delete(`/recordings/${path}`);
  },

  getRecordingUrl(path: string, withAuth: boolean = true): string {
    const token = localStorage.getItem('auth_token');
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    // Добавляем токен авторизации как query параметр (для скачивания)
    if (withAuth && token) {
      return `${baseUrl}/recordings/${path}?auth=${token}`;
    }
    return `${baseUrl}/recordings/${path}`;
  },
};
