import React from 'react';

const LoadingSpinner = () => {
  // By using the full class names directly, we ensure Tailwind CSS includes them in the final stylesheet.
  // The props have been removed as the spinner has a consistent style throughout the app.
  return (
    <div className="flex justify-center items-center my-10">
      <div
        className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"
        role="status"
        aria-live="polite"
        aria-label="Loading"
      ></div>
      <span className="sr-only">Loading...</span> {/* For screen readers */}
    </div>
  );
};

export default LoadingSpinner;