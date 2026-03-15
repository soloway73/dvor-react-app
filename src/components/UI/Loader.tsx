import React from 'react';
import './Loader.css';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  text,
}) => {
  return (
    <div className={`loader-container loader-${size}`}>
      <div className="loader"></div>
      {text && <span className="loader-text">{text}</span>}
    </div>
  );
};
