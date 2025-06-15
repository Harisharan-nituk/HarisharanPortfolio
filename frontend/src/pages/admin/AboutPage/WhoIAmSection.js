// portfolio_py/frontend/src/pages/admin/AboutPage/WhoIAmSection.js
import React, { useState } from 'react';
import { useSettings } from '../../../contexts/SettingsContext';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import EditWhoIAmModal from './EditWhoIAmModal';

const WhoIAmSection = () => {
  const { siteSettings, isLoading: isLoadingSettings } = useSettings();
  const { isAdmin } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      await api.put('/settings', formData);
      setShowEditModal(false);
      // Force a reload to get the latest context data throughout the app
      window.location.reload();
    } catch (error) {
      console.error("Failed to save 'Who I Am' data", error);
      alert('Failed to save data. Please check the console.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingSettings) return <p>Loading content...</p>;

  return (
    <>
      <section id="who-i-am" className="relative bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-xl shadow-xl transition-colors duration-300">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">A Little About Me </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg">
          {siteSettings?.aboutMeIntroduction?.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          {siteSettings?.aboutMePhilosophy && (
            <p className="mt-6 italic border-l-4 border-indigo-500 dark:border-indigo-400 pl-4 py-3 bg-indigo-50 dark:bg-slate-700/60 rounded-r-md">
              "{siteSettings.aboutMePhilosophy}"
            </p>
          )}
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowEditModal(true)} 
            className="absolute top-4 right-4 text-xs bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-1 px-2.5 rounded shadow">
            Edit
          </button>
        )}
      </section>

      {isAdmin && (
        <EditWhoIAmModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
          currentData={siteSettings}
          isLoading={isSaving}
        />
      )}
    </>
  );
};

export default WhoIAmSection;