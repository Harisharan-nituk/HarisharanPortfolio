// frontend/src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const messageFromRedirect = location.state?.message;
  const [displayMessage, setDisplayMessage] = useState('');

  useEffect(() => {
    if (messageFromRedirect) {
      // Use setDisplayMessage to show the redirect message
      // Differentiate it from login errors if needed by styling or separate state
      setDisplayMessage(messageFromRedirect);
      // Clear the location state so message doesn't reappear on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [messageFromRedirect, navigate, location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Clear previous login errors
    setDisplayMessage(''); // Clear previous redirect messages

    if (!email || !password) {
      setError('Please enter both email and password.');
      setIsLoading(false);
      return;
    }

    try {
      const userData = await login(email, password);
      console.log('Login successful via LoginPage, userData from context:', userData);
      
      if (userData && userData.isAdmin) {
        // Navigate to where user intended to go if 'from' exists and was an admin action, else dashboard
        const fromLocation = location.state?.from?.pathname || '/admin';
        navigate(fromLocation, { replace: true });
      } else if (userData) {
        navigate(location.state?.from?.pathname || '/', { replace: true });
      } else {
        setError('Login processed, but user data not fully available for redirection.');
      }

    } catch (err) {
      console.error('LoginPage handleSubmit caught an error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Main page container for login - ADDED DARK MODE STYLES
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] py-12 px-4 sm:px-6 lg:px-8 
                   bg-gray-50 dark:bg-slate-800 transition-colors duration-300"> 
                   {/* Adjusted min-height to be less than full viewport if navbar/footer are present */}
      <div className="max-w-md w-full space-y-8 
                     bg-white dark:bg-slate-700  // <-- ADDED DARK MODE FOR FORM CARD
                     p-8 sm:p-10 rounded-xl shadow-2xl transition-colors duration-300">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100"> {/* Dark mode text for title */}
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400"> {/* Dark mode text */}
            Or{' '}
            <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              go back to homepage
            </Link>
          </p>
        </div>

        {/* Display message from redirect (e.g., "Admin login required...") */}
        {displayMessage && !error && ( 
            <div className="p-3 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-md text-sm text-center">
              {displayMessage}
            </div>
          )}
        
        {/* Display login errors */}
        {error && ( 
            <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-md text-sm">
              {error}
            </div>
          )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input 
                id="email-address" name="email" type="email" autoComplete="email" required 
                value={email} onChange={(e) => setEmail(e.target.value)} 
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md 
                           focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm
                           dark:bg-slate-800 dark:border-slate-600 dark:placeholder-gray-400 dark:text-gray-50 dark:focus:ring-indigo-600 dark:focus:border-indigo-600" // Dark mode for input
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input 
                id="password" name="password" type="password" autoComplete="current-password" required 
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md 
                           focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm
                           dark:bg-slate-800 dark:border-slate-600 dark:placeholder-gray-400 dark:text-gray-50 dark:focus:ring-indigo-600 dark:focus:border-indigo-600" // Dark mode for input
                placeholder="Password"
              />
            </div>
          </div>

  {/* --- NEW LINK ADDED HERE --- */}
          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link to="/forgotpassword" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Forgot your password?
              </Link>
            </div>
          </div>



          <div>
          
            <button 
              type="submit" 
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white 
                         bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                         dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400 dark:focus:ring-offset-slate-900
                         disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;