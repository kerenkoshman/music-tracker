import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  children, 
  className = '',
  disabled,
  ...props 
}) => {
  const baseClasses = 'btn';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-secondary'
  };
  
  const sizeStyles = {
    sm: { fontSize: '0.875rem', padding: '0.375rem 0.75rem' },
    md: { fontSize: '1rem', padding: '0.5rem 1rem' },
    lg: { fontSize: '1.125rem', padding: '0.75rem 1.5rem' }
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();
  
  return (
    <button 
      className={classes}
      style={sizeStyles[size]}
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
