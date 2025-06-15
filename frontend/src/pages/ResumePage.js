import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ResumeCard from '../components/resumes/ResumeCard';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { PlusCircle } from 'lucide-react';

const ResumePage = () => {
  const { isAdmin, isLoadingAuth } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

  // State for Add/Edit Modals
  const [showModal, setShowModal] = useState(false);
  const [editingResume, setEditingResume] = useState(null); // null for 'add', object for 'edit'
  const [formData, setFormData] = useState({ field: '' });
  const [selectedFile, setSelectedFile] = useState(null);

  // State for Delete Confirmation
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);

  const displayMessage = (message, type = 'success') => {
    setActionMessage({ text: message, type });
    setTimeout(() => setActionMessage({ text: '', type: '' }), 4000);
  };

  const fetchResumes = async () => {
    setIsLoadingData(true);
    setError(null);
    try {
      const response = await api.get('/resumes');
      setResumes(response.data);
    } catch (err) {
      console.error("Error fetching resumes:", err);
      setError(err.response?.data?.message || "Failed to load resumes.");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleOpenModal = (resume = null) => {
    setEditingResume(resume);
    setFormData({
      field: resume ? resume.field : '',
    });
    setSelectedFile(null);
    const fileInput = document.getElementById('resumeFileInput');
    if(fileInput) fileInput.value = null; // Reset file input
    setShowModal(true);
    setActionMessage({ text: '', type: ''});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingResume(null);
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingData(true);
    
    const submissionData = new FormData();
    submissionData.append('field', formData.field);

    if (selectedFile) {
        submissionData.append('resumeFile', selectedFile);
    }

    if (!editingResume && !selectedFile) {
        displayMessage('A resume file (PDF) is required to add a new entry.', 'error');
        setIsLoadingData(false);
        return;
    }

    const apiCall = editingResume 
        ? api.put(`/resumes/${editingResume._id}`, submissionData, { headers: { 'Content-Type': 'multipart/form-data' } })
        : api.post('/resumes', submissionData, { headers: { 'Content-Type': 'multipart/form-data' } });

    try {
      await apiCall;
      displayMessage(`Resume for "${formData.field}" ${editingResume ? 'updated' : 'added'} successfully!`, 'success');
      handleCloseModal();
      fetchResumes();
    } catch (err) {
      displayMessage(err.response?.data?.message || `Failed to ${editingResume ? 'update' : 'add'} resume.`, 'error');
    } finally {
      setIsLoadingData(false);
    }
  };

  const openDeleteModal = (resume) => {
    setResumeToDelete(resume);
    setShowConfirmModal(true);
  };

  const executeDelete = async () => {
    if (!resumeToDelete) return;
    setIsLoadingData(true);
    try {
      await api.delete(`/resumes/${resumeToDelete._id}`);
      displayMessage(`Resume for "${resumeToDelete.field}" deleted successfully!`, 'success');
      fetchResumes();
    } catch (err) {
      displayMessage(err.response?.data?.message || 'Failed to delete resume.', 'error');
    } finally {
      setIsLoadingData(false);
      setShowConfirmModal(false);
      setResumeToDelete(null);
    }
  };

  if (isLoadingAuth) { 
    return <div className="text-center py-20 text-gray-500 text-lg">Authenticating...</div>;
  }
  if (isLoadingData && resumes.length === 0) {
    return <div className="text-center py-10 text-gray-500">Loading resumes...</div>;
  }
  if (error && resumes.length === 0) {
    return <div className="text-center py-10 text-red-600 bg-red-50 p-4 rounded-md">{error}</div>;
  }

  return (
    <>
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={executeDelete}
        title="Delete Resume"
        message={`Are you sure you want to permanently delete the resume for "${resumeToDelete?.field}"?`}
        isLoading={isLoadingData}
      />
      
      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAdmin && showModal && (
            <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-lg"
                >
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                        {editingResume ? 'Edit' : 'Add'} Resume
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="field" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Field / Category</label>
                            <input type="text" name="field" id="field" value={formData.field} onChange={handleChange} required className="mt-1 input-style w-full" placeholder="e.g., Software Development" />
                        </div>
                        <div>
                            <label htmlFor="resumeFileInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Resume PDF</label>
                            <input type="file" name="resumeFile" id="resumeFileInput" onChange={handleFileChange} className="mt-1 file-input-style w-full" accept=".pdf" />
                            {editingResume && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Leave blank to keep the current file.</p>}
                        </div>
                        <div className="flex justify-end space-x-3 pt-2">
                            <button type="button" onClick={handleCloseModal} className="btn-secondary">Cancel</button>
                            <button type="submit" disabled={isLoadingData} className="btn-primary disabled:opacity-70">{isLoadingData ? 'Saving...' : 'Save'}</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-10 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center sm:text-left">
            {isAdmin ? 'Manage Resumes' : 'My Resumes'}
          </h1>
          {isAdmin && (
            <button
              onClick={() => handleOpenModal(null)}
              className="btn-primary flex items-center gap-2"
            >
              <PlusCircle size={18} /> Add New Resume
            </button>
          )}
        </div>

        {actionMessage.text && (
            <div className={`p-3 my-4 rounded-md text-sm text-center ${actionMessage.type === 'success' ? 'bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-300'}`}>
                {actionMessage.text}
            </div>
        )}
        
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {resumes.length > 0 ? (
            resumes.map((resume, index) => (
                <motion.div 
                    key={resume._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
                >
                    <ResumeCard 
                    resume={resume} 
                    onUpdate={handleOpenModal}
                    onDelete={openDeleteModal}
                    isAdminView={isAdmin} 
                    />
                </motion.div>
            ))
          ) : (
            !isLoadingData && (
              <p className="md:col-span-2 text-center text-gray-500 py-10 text-lg">
                No resumes currently available. 
                {isAdmin && ' Click "Add New Resume" to upload one.'}
              </p>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default ResumePage;