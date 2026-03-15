# DVOR React App

React приложение для авторизации, просмотра прямой трансляции и управления записями с камеры видеонаблюдения.

## 🚀 Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:5173

### Сборка для production

```bash
npm run build
```

### Предпросмотр production сборки

```bash
npm run preview
```

## 📁 Структура проекта

```
dvor-react-app/
├── public/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   ├── LiveStream/
│   │   ├── Recordings/
│   │   ├── Layout/
│   │   └── UI/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── types/
│   ├── utils/
│   ├── pages/
│   ├── styles/
│   ├── App.tsx
│   ├── App.routes.tsx
│   └── main.tsx
├── .env
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔧 Технологии

- **React 19** - UI библиотека
- **TypeScript** - Типизация
- **Vite** - Сборщик
- **React Router** - Роутинг
- **Zustand** - Управление состоянием
- **Axios** - HTTP клиент
- **Hls.js** - HLS плеер

## 📋 Функционал

### Авторизация
- Форма входа с проверкой учетных данных
- Basic Auth аутентификация
- Защищенные маршруты
- Сохранение сессии

### Live Трансляция
- Просмотр HLS потока
- Индикатор статуса потока
- Управление потоком (перезапуск)
- Отображение количества зрителей

### Записи
- Список записей с фильтрацией
- Просмотр записей в модальном окне
- Скачивание записей
- Фильтрация по потоку и дате

### Настройки
- Информация о пользователе
- Информация о сервере
- Выход из системы

## 🔐 Учетные данные

**По умолчанию:**
- Admin: `admin` / `admin123`
- User: `user` / `user123`

## ⚙️ Переменные окружения

```env
VITE_API_BASE_URL=http://87.76.15.163:8081
VITE_HLS_STREAM_URL=http://87.76.15.163:8081/hls/stream.m3u8
VITE_RECORDINGS_URL=http://87.76.15.163:8081/recordings/
VITE_API_VERSION=v3
```

## 📦 API Endpoints

- `/api/v3/paths/list` - Список путей
- `/api/v3/paths/get?name=stream` - Статус пути
- `/hls/stream.m3u8` - HLS поток
- `/recordings/` - Записи

## 🎨 Стилизация

Приложение использует CSS переменные для темизации:

```css
:root {
  --color-primary: #00d9ff;
  --color-primary-hover: #00b8d4;
  --color-success: #3fb950;
  --color-error: #da3633;
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --bg-tertiary: #0d1117;
  --text-primary: #eeeeee;
  --text-secondary: #8b949e;
}
```

## 📝 Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск сервера разработки |
| `npm run build` | Сборка для production |
| `npm run preview` | Предпросмотр production сборки |
| `npm run lint` | Проверка ESLint |

## 📄 Лицензия

MIT
