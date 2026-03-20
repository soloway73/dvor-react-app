import apiClient from '../utils/axios';
import { StreamStatus } from '../types/stream.types';

export const streamService = {
  async getStreamStatus(streamName: string): Promise<StreamStatus> {
    const response = await apiClient.get('/api/paths/list', {
      headers: { 'Authorization': `Basic ${localStorage.getItem('auth_token')}` },
    });
    
    const stream = response.data.items?.find((item: any) => item.name === streamName);
    
    if (!stream) {
      throw new Error(`Stream "${streamName}" not found`);
    }
    
    return {
      name: stream.name,
      ready: stream.ready,
      online: stream.online,
      tracks: stream.tracks || [],
      readers: stream.readers || [],
    };
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
