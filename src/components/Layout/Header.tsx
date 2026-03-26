import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import './Header.css';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/">📹 DVOR Stream</Link>
      </div>

      <nav className={`header-nav ${isMenuOpen ? 'nav-open' : ''}`}>
        <Link to="/live" onClick={closeMenu}>🔴 Live</Link>
        <Link to="/recordings" onClick={closeMenu}>📼 Записи</Link>
        <a href="https://solowaystudio.ru/" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>🎸 Уроки гитары</a>
        <Link to="/settings" onClick={closeMenu}>⚙️ Настройки</Link>
        {isAuthenticated && (
          <button onClick={() => { handleLogout(); closeMenu(); }} className="mobile-logout">
            Выйти
          </button>
        )}
      </nav>

      {isAuthenticated && (
        <div className="header-user">
          <span className="user-name">👤 {user?.username}</span>
          <button onClick={handleLogout} className="logout-button">
            Выйти
          </button>
        </div>
      )}

      <button className={`burger-menu ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Меню">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
};
