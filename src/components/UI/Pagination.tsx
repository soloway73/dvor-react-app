import React from 'react';
import { PaginationMeta } from '../../types/recordings.types';
import './Pagination.css';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  if (meta.total_pages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={!meta.has_prev}
        onClick={() => meta.prev_page !== null && onPageChange(meta.prev_page)}
      >
        ← Пред.
      </button>

      <div className="pagination-info">
        <span className="pagination-current">
          Страница {meta.page} из {meta.total_pages}
        </span>
        <span className="pagination-total">
          ({meta.total_items} записей)
        </span>
      </div>

      <button
        className="pagination-btn"
        disabled={!meta.has_next}
        onClick={() => meta.next_page !== null && onPageChange(meta.next_page)}
      >
        След. →
      </button>
    </div>
  );
};
