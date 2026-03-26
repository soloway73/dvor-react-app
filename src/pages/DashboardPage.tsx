import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Layout/Header';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-page">
      <Header />
      <main className="dashboard-content">
        <h1 className="dashboard-title">Панель управления</h1>
        
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">🔴</div>
            <h2>Live Трансляция</h2>
            <p>Просмотр прямой трансляции с камеры</p>
            <Link to="/live" className="card-button">
              Перейти к трансляции
            </Link>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📼</div>
            <h2>Записи</h2>
            <p>Просмотр и управление записями</p>
            <Link to="/recordings" className="card-button">
              Просмотр записей
            </Link>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🎸</div>
            <h2>Уроки гитары</h2>
            <p>для взрослых и детей</p>
            <a href="https://solowaystudio.ru/" target="_blank" rel="noopener noreferrer" className="card-button">
              Перейти на сайт
            </a>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">⚙️</div>
            <h2>Настройки</h2>
            <p>Управление настройками системы</p>
            <Link to="/settings" className="card-button">
              Открыть настройки
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
