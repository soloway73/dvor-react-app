import apiClient from '../utils/axios';
import { StreamStatus } from '../types/stream.types';

export const streamService = {
  async getStreamStatus(streamName: string): Promise<StreamStatus> {
    const response = await apiClient.get(`/v3/paths/get/${streamName}`, {
      headers: { 'Authorization': `Basic ${localStorage.getItem('auth_token')}` },
    });
    return response.data;
  },

  async restartStream(streamName: string): Promise<void> {
    await apiClient.post(`/v3/paths/restart/${streamName}`, null, {
      headers: { 'Authorization': `Basic ${localStorage.getItem('auth_token')}` },
    });
  },

  async listPaths(): Promise<any> {
    const response = await apiClient.get('/api/paths/list');
    return response.data;
  },
};
