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

export interface PaginationMeta {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  next_page: number | null;
  prev_page: number | null;
}

export interface PaginationFilters {
  date: string | null;
  stream: string | null;
}

export interface PaginationSort {
  by: string;
  order: string;
}

export interface RecordingsResponse {
  data: Recording[];
  pagination: PaginationMeta;
  filters: PaginationFilters;
  sort: PaginationSort;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
  sort?: 'date' | 'name' | 'size';
  order?: 'asc' | 'desc';
  date?: string;
  date_from?: string;
  date_to?: string;
  stream?: string;
}
