import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-[#9ACBD0] rounded-md ${className}`} />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md w-full space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
};

export const ButtonSkeleton = () => {
  return (
    <Skeleton className="h-8 w-24 rounded-md" />
  );
}; 