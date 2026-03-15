export interface Recording {
  id: string;
  path: string;
  filename: string;
  size: number;
  createdAt: string;
  duration?: number;
  streamName: string;
}

export interface RecordingsListResponse {
  items: Recording[];
  totalCount: number;
}
