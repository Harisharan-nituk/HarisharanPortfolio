// frontend/src/pages/admin/AboutPage/AchievementFormModal.js
import React, { useState, useEffect } from 'react';

const AchievementFormModal = ({ show, onClose, onSave, currentAchievement, isLoading }) => {
  const [description, setDescription] = useState('');
  const isEditing = !!currentAchievement;

  useEffect(() => {
    if (show) {
      setDescription(isEditing ? currentAchievement.description : '');
    }
  }, [currentAchievement, show, isEditing]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Description cannot be empty.');
      return;
    }
    onSave({ description });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">{isEditing ? 'Edit' : 'Add'} Achievement</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Achievement Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" required className="mt-1 input-style w-full"></textarea>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isLoading} className="btn-primary disabled:opacity-70">{isLoading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AchievementFormModal;