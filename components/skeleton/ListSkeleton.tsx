import React from 'react';
import Card from '../atoms/Card';

const ListSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F2EFE7] p-2 sm:p-6">
      <div className="max-w-full sm:max-w-4xl mx-auto relative">
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
          <div className="h-8 w-20 bg-[#9ACBD0] rounded-md animate-pulse" />
        </div>
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
          <div className="h-8 w-20 bg-[#9ACBD0] rounded-md animate-pulse" />
        </div>
        <div className="flex flex-col items-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <div className="h-6 w-1/2 bg-[#9ACBD0] rounded-md animate-pulse mx-auto mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i}>
                  <div className="space-y-3">
                    <div className="h-4 w-3/4 bg-[#9ACBD0] rounded-md animate-pulse" />
                    <div className="h-4 w-1/2 bg-[#9ACBD0] rounded-md animate-pulse" />
                    <div className="h-8 w-24 bg-[#9ACBD0] rounded-md animate-pulse" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListSkeleton; 