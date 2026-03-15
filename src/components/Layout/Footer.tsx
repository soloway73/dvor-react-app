import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} DVOR Stream Server. Все права защищены.</p>
    </footer>
  );
};
