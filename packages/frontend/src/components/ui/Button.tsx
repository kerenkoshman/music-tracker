import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  children, 
  className = '',
  disabled,
  style,
  ...props 
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline'
  };
  
  const sizeStyles = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.75rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '0.875rem' },
    lg: { padding: '1rem 2rem', fontSize: '1rem' }
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();
  
  return (
    <button 
      className={classes}
      style={{ ...sizeStyles[size], ...style }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="spinner" style={{ 
          width: '1rem', 
          height: '1rem', 
          marginRight: '0.5rem' 
        }}></span>
      )}
      {children}
    </button>
  );
};

export default Button;
