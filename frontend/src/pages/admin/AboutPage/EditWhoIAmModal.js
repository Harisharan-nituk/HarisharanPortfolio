// frontend/src/pages/admin/AboutPage/EditWhoIAmModal.js
import React, { useState, useEffect } from 'react';

const EditWhoIAmModal = ({ show, onClose, onSave, currentData, isLoading }) => {
  const [intro, setIntro] = useState('');
  const [philosophy, setPhilosophy] = useState('');

  useEffect(() => {
    if (currentData) {
      setIntro(Array.isArray(currentData.aboutMeIntroduction) ? currentData.aboutMeIntroduction.join('\n\n') : '');
      setPhilosophy(currentData.aboutMePhilosophy || '');
    }
  }, [currentData]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ aboutMeIntroduction: intro, aboutMePhilosophy: philosophy });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Edit 'Who I Am' Section</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="intro" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Introduction Paragraphs (separate with a blank line)</label>
            <textarea id="intro" value={intro} onChange={(e) => setIntro(e.target.value)} rows="5" className="mt-1 input-style w-full"></textarea>
          </div>
          <div>
            <label htmlFor="philosophy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Philosophy</label>
            <textarea id="philosophy" value={philosophy} onChange={(e) => setPhilosophy(e.target.value)} rows="3" className="mt-1 input-style w-full"></textarea>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isLoading} className="btn-primary disabled:opacity-70">{isLoading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWhoIAmModal;