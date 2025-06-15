// frontend/src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Your Axios instance

// Create Context
const AuthContext = createContext(null);

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token')); // Initialize from localStorage
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        setCurrentUser(user);
        // Set the token for all subsequent API requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        // Handle malformed user data in localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
        delete api.defaults.headers.common['Authorization'];
      }
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
    setIsLoadingAuth(false);
  }, [token]);

  const login = async (email, password) => {
    setIsLoadingAuth(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });

      // --- THE FIX FOR THE RACE CONDITION ---
      // 1. Set the authorization header IMMEDIATELY after a successful login.
      // This ensures any API call after the redirect will have the token.
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      // 2. Store user and token in localStorage.
      localStorage.setItem('token', data.token);
      const userToStore = {
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
      };
      localStorage.setItem('user', JSON.stringify(userToStore));

      // 3. Update the state, which will trigger the useEffect.
      setToken(data.token);
      setCurrentUser(userToStore);
      
      setIsLoadingAuth(false);
      return data;
    } catch (error) {
      setIsLoadingAuth(false);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null); // This triggers the useEffect to clear the Axios header
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const value = {
    currentUser,
    token,
    isLoadingAuth,
    login,
    logout,
    isAdmin: currentUser?.isAdmin || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};