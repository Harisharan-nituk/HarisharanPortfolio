import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext';
import ExperienceCard from '../../components/experience/ExperienceCard';
import ConfirmationModal from '../../components/common/ConfirmationModal'
import { PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Reusable styles for the form modal
const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 sm:text-sm";
const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

const ExperienceFormModal = ({ show, onClose, onSave, experience, isLoading }) => {
  const isEditing = !!experience;
  const [formData, setFormData] = useState({ 
    company: '', 
    position: '', 
    description: '', 
    startDate: '', 
    endDate: '', 
    isCurrent: false, 
    location: '', 
    technologies: '' 
  });
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    if (isEditing && experience) {
      setFormData({
        company: experience.company || '',
        position: experience.position || '',
        description: experience.description || '',
        startDate: experience.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : '',
        endDate: experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : '',
        isCurrent: experience.isCurrent || false,
        location: experience.location || '',
        technologies: experience.technologies?.join(', ') || ''
      });
    } else {
      setFormData({ 
        company: '', 
        position: '', 
        description: '', 
        startDate: '', 
        endDate: '', 
        isCurrent: false, 
        location: '', 
        technologies: '' 
      });
    }
    setLogoFile(null);
  }, [experience, isEditing]);

  if (!show) return null;

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };
  const handleFileChange = (e) => setLogoFile(e.target.files[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'isCurrent') {
        submissionData.append(key, formData[key]);
      } else {
        submissionData.append(key, formData[key].toString());
      }
    });
    if (logoFile) {
      submissionData.append('companyLogo', logoFile);
    }
    onSave(submissionData, experience?._id);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          {isEditing ? 'Edit Experience' : 'Add New Experience'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="company" className={labelClasses}>Company Name*</label>
            <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} required className={inputClasses} />
          </div>
          <div>
            <label htmlFor="position" className={labelClasses}>Position/Title*</label>
            <input type="text" name="position" id="position" value={formData.position} onChange={handleChange} required className={inputClasses} />
          </div>
          <div>
            <label htmlFor="description" className={labelClasses}>Description*</label>
            <textarea name="description" id="description" rows="4" value={formData.description} onChange={handleChange} required className={inputClasses}></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className={labelClasses}>Start Date*</label>
              <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} required className={inputClasses} />
            </div>
            <div>
              <label htmlFor="endDate" className={labelClasses}>End Date</label>
              <input 
                type="date" 
                name="endDate" 
                id="endDate" 
                value={formData.endDate} 
                onChange={handleChange} 
                disabled={formData.isCurrent}
                className={inputClasses} 
              />
            </div>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              name="isCurrent" 
              id="isCurrent" 
              checked={formData.isCurrent} 
              onChange={handleChange} 
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isCurrent" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              This is my current position
            </label>
          </div>
          <div>
            <label htmlFor="location" className={labelClasses}>Location</label>
            <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className={inputClasses} placeholder="City, Country" />
          </div>
          <div>
            <label htmlFor="technologies" className={labelClasses}>Technologies (comma-separated)</label>
            <input type="text" name="technologies" id="technologies" value={formData.technologies} onChange={handleChange} className={inputClasses} placeholder="React, Node.js, MongoDB"/>
          </div>
          <div>
            <label htmlFor="companyLogo" className={labelClasses}>Company Logo</label>
            <input type="file" name="companyLogo" id="companyLogo" onChange={handleFileChange} className="mt-1 file-input-style w-full" accept="image/*" />
            {isEditing && <p className="text-xs text-gray-500 mt-1">Leave blank to keep existing logo.</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isLoading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AdminExperiencePage = () => {
  const { isAdmin } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState(null);

  const fetchExperiences = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/experiences');
      setExperiences(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load experiences. Please check the console for errors.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const openModal = (experience = null) => {
    setEditingExperience(experience);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
  };

  const handleSave = async (formData, id) => {
    setIsProcessing(true);
    try {
      if (id) {
        await api.put(`/experiences/${id}`, formData);
      } else {
        await api.post('/experiences', formData);
      }
      closeModal();
      fetchExperiences();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save experience.");
    } finally {
      setIsProcessing(false);
    }
  };

  const openDeleteModal = (experience) => {
    setExperienceToDelete(experience);
    setShowConfirmModal(true);
  };

  const executeDelete = async () => {
    if (!experienceToDelete) return;
    setIsProcessing(true);
    try {
      await api.delete(`/experiences/${experienceToDelete._id}`);
      setShowConfirmModal(false);
      setExperienceToDelete(null);
      fetchExperiences();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete experience.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="text-center py-20">Loading experiences...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <>
      <AnimatePresence>
        {isModalOpen && (
          <ExperienceFormModal
            show={isModalOpen}
            onClose={closeModal}
            onSave={handleSave}
            experience={editingExperience}
            isLoading={isProcessing}
          />
        )}
        {showConfirmModal && (
          <ConfirmationModal
            show={showConfirmModal}
            onClose={() => {
              setShowConfirmModal(false);
              setExperienceToDelete(null);
            }}
            onConfirm={executeDelete}
            title="Delete Experience"
            message={`Are you sure you want to delete the experience at ${experienceToDelete?.company}? This action cannot be undone.`}
            isLoading={isProcessing}
          />
        )}
      </AnimatePresence>

      <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 shadow-xl rounded-xl">
        <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-slate-700">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Manage Experience
          </h1>
          {isAdmin && (
            <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
              <PlusCircle size={18} /> Add Experience
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map(experience => (
            <ExperienceCard
              key={experience._id}
              experience={experience}
              onUpdate={openModal}
              onDelete={openDeleteModal}
              isAdminView={isAdmin}
            />
          ))}
        </div>
        {experiences.length === 0 && (
          <p className="text-center text-gray-500 py-10">No experiences added yet.</p>
        )}
      </div>
    </>
  );
};

export default AdminExperiencePage;

