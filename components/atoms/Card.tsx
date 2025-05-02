import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full max-w-xs sm:max-w-md p-4 sm:p-6 rounded-md sm:rounded-lg shadow-lg bg-white ${className}`}>
      {children}
    </div>
  );
};

export default Card; 