// frontend/src/contexts/SettingsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const SettingsContext = createContext();

export const useSettings = () => {
  return useContext(SettingsContext);
};

export const SettingsProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState({
    ownerName: 'Your Name', // Default value
    jobTitle: 'Your Profession',
    specialization: 'Your Specialization',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data) {
          setSiteSettings(data);
        }
      } catch (err) {
        console.error("Could not fetch site settings, using default values.", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteSettings();
  }, []);

  const value = {
    siteSettings,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};