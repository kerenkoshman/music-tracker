import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, subtitle, style }) => {
  return (
    <div className={`card ${className}`.trim()} style={style}>
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
