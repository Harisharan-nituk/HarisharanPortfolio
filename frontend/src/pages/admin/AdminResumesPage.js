// frontend/src/pages/admin/AdminResumesPage.js
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api'; 
import ResumeCard from '../../components/resumes/ResumeCard'; 
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Reusable Form Modal Component for Resumes ---
const ResumeFormModal = ({ show, onClose, onSave, resume, isLoading }) => {
    const isEditing = !!resume;
    const [formData, setFormData] = useState({ field: '' });
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (isEditing) {
            setFormData({ field: resume.field || '' });
        } else {
            setFormData({ field: '' });
        }
        setSelectedFile(null); // Reset file on modal open
    }, [resume, isEditing]);

    if (!show) return null;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = new FormData();
        submissionData.append('field', formData.field);
        if (selectedFile) {
            submissionData.append('resumeFile', selectedFile);
        }
        
        if (!isEditing && !selectedFile) {
            alert('A PDF file is required when adding a new resume.');
            return;
        }

        onSave(submissionData, resume?._id);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-lg"
            >
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">{isEditing ? 'Edit Resume' : 'Add New Resume'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="field" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Field / Category*</label>
                        <input type="text" name="field" id="field" value={formData.field} onChange={handleChange} required className="mt-1 input-style w-full" placeholder="e.g., Software Development" />
                    </div>
                    <div>
                        <label htmlFor="resumeFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Resume PDF*</label>
                        <input type="file" name="resumeFile" id="resumeFile" onChange={handleFileChange} className="mt-1 file-input-style w-full" accept=".pdf" required={!isEditing} />
                        {isEditing && <p className="text-xs text-gray-500 mt-1">Leave blank to keep the current file.</p>}
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

// --- Main Admin Resumes Page Component ---
const AdminResumesPage = () => {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResume, setEditingResume] = useState(null);
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);

  const fetchResumes = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/resumes');
      setResumes(data);
    } catch (err) {
      alert("Failed to load resumes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchResumes(); }, [fetchResumes]);

  const openModal = (resume = null) => { setEditingResume(resume); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);

  const handleSave = async (formData, id) => {
    setIsProcessing(true);
    const apiCall = id ? api.put(`/resumes/${id}`, formData) : api.post('/resumes', formData);
    try {
      await apiCall;
      closeModal();
      fetchResumes();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save resume.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const openDeleteModal = (resume) => { setResumeToDelete(resume); setShowConfirmModal(true); };

  const executeDelete = async () => {
    if (!resumeToDelete) return;
    setIsProcessing(true);
    try {
      await api.delete(`/resumes/${resumeToDelete._id}`);
      setShowConfirmModal(false);
      fetchResumes();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete resume.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <>
      <ConfirmationModal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} onConfirm={executeDelete} title="Delete Resume" message={`Delete resume for "${resumeToDelete?.field}"?`} />
      <AnimatePresence>
        {isModalOpen && <ResumeFormModal show={isModalOpen} onClose={closeModal} onSave={handleSave} resume={editingResume} isLoading={isProcessing} />}
      </AnimatePresence>

      <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 shadow-xl rounded-xl">
        <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-slate-700">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Manage Resumes</h1>
            <button onClick={() => openModal()} className="btn-primary flex items-center gap-2"><PlusCircle size={18} /> Add Resume</button>
        </div>
        {isLoading ? <p className="text-center py-10">Loading Resumes...</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {resumes.map(resume => (
                  <ResumeCard 
                    key={resume._id} 
                    resume={resume} 
                    onUpdate={openModal} 
                    onDelete={openDeleteModal} 
                    isAdminView={true} 
                  />
                ))}
            </div>
        )}
      </div>
    </>
  );
};

export default AdminResumesPage;