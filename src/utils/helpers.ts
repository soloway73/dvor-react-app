export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatDateTime(dateString: string): string {
  // Время в createdAt - UTC. Добавляем 4 часа для Самары (UTC+4)
  const date = new Date(dateString);
  date.setHours(date.getHours() + 4);
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Конвертирует локальную дату (Самара UTC+4) в UTC для сравнения с createdAt
 */
export function localToUtc(dateString: string): Date {
  // dateString из datetime-local input - это локальное время без timezone
  // Считаем что это время Самары (UTC+4) и конвертируем в UTC
  const date = new Date(dateString);
  // Вычитаем 4 часа чтобы получить UTC
  date.setHours(date.getHours() - 4);
  return date;
}

/**
 * Конвертирует UTC дату в локальное время (Самара UTC+4)
 */
export function utcToLocal(dateString: string): Date {
  // dateString - это UTC время из имени файла
  const date = new Date(dateString);
  // Добавляем 4 часа для Самары
  date.setHours(date.getHours() + 4);
  return date;
}
