// frontend/src/components/common/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ size = '8', color = 'indigo-600' }) => {
  // Tailwind CSS classes used for styling
  // Ensure your Tailwind setup is complete.
  return (
    <div className="flex justify-center items-center my-10">
      <div
        className={`animate-spin rounded-full h-${size} w-${size} border-t-2 border-b-2 border-${color}`}
        role="status"
        aria-live="polite"
        aria-label="Loading"
      ></div>
      <span className="sr-only">Loading...</span> {/* For screen readers */}
    </div>
  );
};

export default LoadingSpinner;