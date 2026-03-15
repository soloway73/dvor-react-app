import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">🏠</span>
          <span>Главная</span>
        </NavLink>
        
        <NavLink to="/live" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">🔴</span>
          <span>Live трансляция</span>
        </NavLink>
        
        <NavLink to="/recordings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">📼</span>
          <span>Записи</span>
        </NavLink>
        
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">⚙️</span>
          <span>Настройки</span>
        </NavLink>
      </nav>
    </aside>
  );
};
