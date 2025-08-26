
import React from 'react';

const Loader = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-600">{message}</p>
    </div>
  );
};

export default Loader;
