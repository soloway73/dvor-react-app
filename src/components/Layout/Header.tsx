import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import './Header.css';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/">📹 DVOR Stream</Link>
      </div>

      <nav className="header-nav">
        <Link to="/live">🔴 Live</Link>
        <Link to="/recordings">📼 Записи</Link>
        <Link to="/settings">⚙️ Настройки</Link>
      </nav>

      {isAuthenticated && (
        <div className="header-user">
          <span className="user-name">👤 {user?.username}</span>
          <button onClick={handleLogout} className="logout-button">
            Выйти
          </button>
        </div>
      )}
    </header>
  );
};
