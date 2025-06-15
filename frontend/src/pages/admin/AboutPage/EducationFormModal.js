// portfolio_py/frontend/src/pages/admin/AboutPage/EducationFormModal.js
import React, { useState, useEffect } from 'react';

const EducationFormModal = ({ show, onClose, onSave, currentEducation, isLoading }) => {
  const isEditing = !!currentEducation?._id;

  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    gpa: '',
    description: '',
  });

  useEffect(() => {
    if (show) {
      if (isEditing && currentEducation) {
        setFormData({
          degree: currentEducation.degree || '',
          institution: currentEducation.institution || '',
          location: currentEducation.location || '',
          startDate: currentEducation.startDate || '',
          endDate: currentEducation.endDate || '',
          gpa: currentEducation.gpa || '',
          description: currentEducation.description || '',
        });
      } else {
        setFormData({
          degree: '', institution: '', location: '', startDate: '',
          endDate: '', gpa: '', description: '',
        });
      }
    }
  }, [currentEducation, isEditing, show]);

  if (!show) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.degree || !formData.institution || !formData.startDate || !formData.endDate) {
      // Basic validation, can be enhanced
      alert('Degree, Institution, Start Date, and End Date are required.');
      return;
    }
    onSave(formData, currentEducation?._id);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ease-in-out">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalFadeIn">
        <style jsx global>{`@keyframes modalFadeIn { to { opacity: 1; transform: scale(1); } } .animate-modalFadeIn { animation: modalFadeIn 0.2s ease-out forwards; }`}</style>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {isEditing ? 'Edit Education Entry' : 'Add New Education Entry'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white text-2xl leading-none p-1">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="degreeEduModal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Degree <span className="text-red-500">*</span></label>
            <input type="text" name="degree" id="degreeEduModal" value={formData.degree} onChange={handleChange} required className="mt-1 input-style w-full" />
          </div>
          <div>
            <label htmlFor="institutionEduModal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Institution <span className="text-red-500">*</span></label>
            <input type="text" name="institution" id="institutionEduModal" value={formData.institution} onChange={handleChange} required className="mt-1 input-style w-full" />
          </div>
          <div>
            <label htmlFor="locationEduModal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            <input type="text" name="location" id="locationEduModal" value={formData.location} onChange={handleChange} className="mt-1 input-style w-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDateEduModal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date <span className="text-red-500">*</span></label>
              <input type="text" name="startDate" id="startDateEduModal" value={formData.startDate} onChange={handleChange} required placeholder="e.g., Aug 2018" className="mt-1 input-style w-full" />
            </div>
            <div>
              <label htmlFor="endDateEduModal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date <span className="text-red-500">*</span></label>
              <input type="text" name="endDate" id="endDateEduModal" value={formData.endDate} onChange={handleChange} required placeholder="e.g., May 2022 or Present" className="mt-1 input-style w-full" />
            </div>
          </div>
          <div>
            <label htmlFor="gpaEduModal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">GPA (Optional)</label>
            <input type="text" name="gpa" id="gpaEduModal" value={formData.gpa} onChange={handleChange} className="mt-1 input-style w-full" />
          </div>
          <div>
            <label htmlFor="descriptionEduModal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description/Key Courses (Optional)</label>
            <textarea name="description" id="descriptionEduModal" value={formData.description} onChange={handleChange} rows="3" className="mt-1 input-style w-full"></textarea>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isLoading} className="btn-primary disabled:opacity-70">
              {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Entry')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EducationFormModal;