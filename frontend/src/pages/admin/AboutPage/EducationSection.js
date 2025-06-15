// portfolio_py/frontend/src/pages/admin/AboutPage/EducationSection.js
import React, { useState, useEffect } from 'react';
import api from '../../../services/api'; // Adjusted path
import { useAuth } from '../../../contexts/AuthContext'; // Adjusted path
import EducationFormModal from './EducationFormModal'; // Import from sibling file

const EducationSection = () => {
  const { isAdmin } = useAuth();
  const [educationHistory, setEducationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null); // null for add, object for edit

  const displayMessage = (message, type = 'success') => {
    setActionMessage({ text: message, type });
    setTimeout(() => setActionMessage({ text: '', type: '' }), 3500);
  };

  const fetchEducationHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/education');
      setEducationHistory(data || []);
    } catch (err) {
      console.error("Error fetching education history:", err);
      setError(err.response?.data?.message || "Failed to load education history.");
      setEducationHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEducationHistory();
  }, []);

  const openAddModal = () => {
    setEditingEducation(null);
    setShowFormModal(true);
    setActionMessage({ text: '', type: '' }); // Clear previous messages
  };

  const openEditModal = (eduEntry) => {
    setEditingEducation(eduEntry);
    setShowFormModal(true);
    setActionMessage({ text: '', type: '' }); // Clear previous messages
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setEditingEducation(null);
  };

  const handleSaveEducation = async (formData, idToUpdate) => {
    setIsLoading(true);
    setActionMessage({ text: '', type: '' });
    const method = idToUpdate ? 'put' : 'post';
    const url = idToUpdate ? `/education/${idToUpdate}` : '/education';

    try {
      const { data } = await api[method](url, formData);
      displayMessage(`Education entry "${data.degree}" ${idToUpdate ? 'updated' : 'added'} successfully!`, 'success');
      closeFormModal();
      fetchEducationHistory(); // Refresh list
    } catch (err) {
      console.error(`Error ${idToUpdate ? 'updating' : 'adding'} education:`, err.response || err);
      displayMessage(err.response?.data?.message || `Failed to ${idToUpdate ? 'update' : 'add'} entry.`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEducation = async (id, degree) => {
    const institution = educationHistory.find(edu => edu._id === id)?.institution || '';
    if (window.confirm(`Are you sure you want to delete the entry: "${degree}" at ${institution}? This action is permanent.`)) {
      setIsLoading(true);
      setActionMessage({ text: '', type: '' });
      try {
        await api.delete(`/education/${id}`);
        displayMessage(`Education entry "${degree}" deleted successfully.`, 'success');
        fetchEducationHistory(); // Refresh list
      } catch (err) {
        console.error("Error deleting education:", err.response || err);
        displayMessage(err.response?.data?.message || "Failed to delete education entry.", 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <section id="education" className="bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-xl shadow-xl transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4 sm:mb-0">
          Education
        </h2>
        {isAdmin && (
          <button onClick={openAddModal} className="btn-primary py-2 px-4 text-sm">
            + Add New Entry
          </button>
        )}
      </div>

      {actionMessage.text && (
        <div className={`p-3 mb-4 rounded-md text-sm text-center ${actionMessage.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-800/30 dark:text-red-300'}`} role="alert">
          {actionMessage.text}
        </div>
      )}

      {isLoading && educationHistory.length === 0 && <p className="dark:text-gray-300 text-center py-4">Loading education history...</p>}
      {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md text-center py-4">Error: {error}</p>}
      
      {!isLoading && !error && educationHistory.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-6">
          No education entries have been added yet.
          {isAdmin && ' Click "Add New Entry" to get started!'}
        </p>
      )}

      {!isLoading && !error && educationHistory.length > 0 && (
        <div className="space-y-6">
          {educationHistory.map((edu) => (
            <div key={edu._id} className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm bg-gray-50 dark:bg-slate-700/40 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start">
                <div className="flex-grow mb-3 sm:mb-0">
                  <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">{edu.degree}</h3>
                  <p className="text-md font-medium text-gray-700 dark:text-gray-300">{edu.institution}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {edu.startDate} – {edu.endDate} {edu.location && `| ${edu.location}`}
                  </p>
                  {edu.gpa && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">GPA: {edu.gpa}</p>}
                </div>
                {isAdmin && (
                  <div className="flex space-x-2 flex-shrink-0 self-start sm:self-auto mt-3 sm:mt-0">
                    <button onClick={() => openEditModal(edu)} className="btn-secondary py-1.5 px-3 text-xs">Update</button>
                    <button onClick={() => handleDeleteEducation(edu._id, edu.degree)} disabled={isLoading} className="bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 px-3 rounded-md text-xs shadow-sm dark:bg-red-600 dark:hover:bg-red-700 disabled:opacity-70">Delete</button>
                  </div>
                )}
              </div>
              {edu.description && <p className="mt-3 pt-3 border-t dark:border-slate-600 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}
      {isLoading && educationHistory.length > 0 && <p className="text-sm text-center text-gray-500 dark:text-gray-400 my-4">Refreshing list...</p>}


      {showFormModal && (
        <EducationFormModal
          show={showFormModal}
          onClose={closeFormModal}
          onSave={handleSaveEducation}
          currentEducation={editingEducation}
          isLoading={isLoading} // This is the section-level loading for the save button
        />
      )}
    </section>
  );
};

export default EducationSection;