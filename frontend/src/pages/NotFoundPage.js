// frontend/src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 min-h-[60vh]">
      {/* You can add a relevant image or icon here if you like */}
      {/* <img src="/path-to-404-image.svg" alt="Page not found" className="w-64 h-64 mb-8" /> */}
      <h1 className="text-6xl md:text-8xl font-bold text-indigo-600 mb-4">404</h1>
      <h2 className="text-2xl md:text-4xl font-semibold text-gray-700 mb-6">
        Oops! Page Not Found.
      </h2>
      <p className="text-gray-500 mb-8 max-w-md px-4">
        It seems like the page you're looking for doesn't exist or has been moved.
        Don't worry, let's get you back on track.
      </p>
      <Link
        to="/"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 shadow-md hover:shadow-lg"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;