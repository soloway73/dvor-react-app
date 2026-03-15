import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  loading = false,
  disabled,
  className = '',
  ...props
}) => {
  const classes = `button button-${variant} button-${size} ${className}`.trim();

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? 'Загрузка...' : children}
    </button>
  );
};
