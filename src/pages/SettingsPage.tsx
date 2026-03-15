import React from 'react';
import { Header } from '../components/Layout/Header';
import { useAuthStore } from '../store/auth.store';
import './SettingsPage.css';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="settings-page">
      <Header />
      <main className="settings-content">
        <h1>⚙️ Настройки</h1>

        <div className="settings-section">
          <h2>Информация о пользователе</h2>
          <div className="setting-item">
            <label>Имя пользователя:</label>
            <span>{user?.username}</span>
          </div>
          <div className="setting-item">
            <label>Роль:</label>
            <span>{user?.role === 'admin' ? 'Администратор' : 'Пользователь'}</span>
          </div>
        </div>

        <div className="settings-section">
          <h2>Сервер</h2>
          <div className="setting-item">
            <label>URL сервера:</label>
            <span>{import.meta.env.VITE_API_BASE_URL}</span>
          </div>
          <div className="setting-item">
            <label>Версия API:</label>
            <span>{import.meta.env.VITE_API_VERSION}</span>
          </div>
        </div>

        <div className="settings-section">
          <h2>Действия</h2>
          <button onClick={handleLogout} className="logout-button">
            Выйти из системы
          </button>
        </div>

        {user?.role !== 'admin' && (
          <div className="admin-notice">
            <p>⚠️ Некоторые настройки доступны только администраторам</p>
          </div>
        )}
      </main>
    </div>
  );
};
