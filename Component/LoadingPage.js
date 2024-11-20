import React from 'react';

function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        {/* Logo or Icon */}
       

        {/* Spinner */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        </div>

        {/* Loading Text */}
        <h1 className="text-xl font-semibold text-gray-800">
          Please wait, loading...
        </h1>
        <p className="text-gray-600 mt-2">
          We're preparing everything for you. This won't take long.
        </p>
      </div>
    </div>
  );
}

export default LoadingPage;
