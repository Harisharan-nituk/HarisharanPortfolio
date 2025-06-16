import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext';
import ProjectCard from '../../components/projects/ProjectCard';
import ConfirmationModal from '../../components/common/ConfirmationModal'
import { PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Reusable styles for the form modal
const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 sm:text-sm";
const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

const ProjectFormModal = ({ show, onClose, onSave, project, isLoading }) => {
  const isEditing = !!project;
  const [formData, setFormData] = useState({ title: '', description: '', projectLink: '', githubUrl: '', technologies: '' });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (isEditing && project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        projectLink: project.projectLink || '',
        githubUrl: project.githubUrl || '',
        technologies: project.technologies?.join(', ') || ''
      });
    } else {
      setFormData({ title: '', description: '', projectLink: '', githubUrl: '', technologies: '' });
    }
    setImageFile(null);
  }, [project, isEditing]);

  if (!show) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
    if (imageFile) {
      submissionData.append('projectImage', imageFile);
    }
    onSave(submissionData, project?._id);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-lg"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">{isEditing ? 'Edit Project' : 'Add New Project'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar pr-2">
          <div><label htmlFor="title" className={labelClasses}>Project Name*</label><input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className={inputClasses} /></div>
          <div><label htmlFor="description" className={labelClasses}>Description*</label><textarea name="description" id="description" rows="4" value={formData.description} onChange={handleChange} required className={inputClasses}></textarea></div>
          <div><label htmlFor="technologies" className={labelClasses}>Technologies (comma-separated)</label><input type="text" name="technologies" id="technologies" value={formData.technologies} onChange={handleChange} className={inputClasses} placeholder="React, Node.js"/></div>
          <div><label htmlFor="projectLink" className={labelClasses}>Live Demo Link</label><input type="url" name="projectLink" id="projectLink" value={formData.projectLink} onChange={handleChange} className={inputClasses} placeholder="https://example.com"/></div>
          <div><label htmlFor="githubUrl" className={labelClasses}>GitHub Repo Link</label><input type="url" name="githubUrl" id="githubUrl" value={formData.githubUrl} onChange={handleChange} className={inputClasses} placeholder="https://github.com/user/repo"/></div>
          <div><label htmlFor="projectImage" className={labelClasses}>Project Image</label><input type="file" name="projectImage" id="projectImage" onChange={handleFileChange} className="mt-1 file-input-style w-full" accept="image/*" />{isEditing && <p className="text-xs text-gray-500 mt-1">Leave blank to keep existing image.</p>}</div>
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onClose} className="btn-secondary" disabled={isLoading}>Cancel</button><button type="submit" className="btn-primary" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</button></div>
        </form>
      </motion.div>
    </div>
  );
};

const AdminProjectsPage = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (err) {
      setError("Failed to load projects. Please check the console for errors.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const openModal = (project = null) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSave = async (formData, id) => {
    setIsProcessing(true);
    try {
        if (id) {
            await api.put(`/projects/${id}`, formData);
        } else {
            await api.post('/projects', formData);
        }
        closeModal();
        fetchProjects();
    } catch (err) {
        alert(err.response?.data?.message || "Failed to save project.");
    } finally {
        setIsProcessing(false);
    }
  };

  const openDeleteModal = (project) => {
    setProjectToDelete(project);
    setShowConfirmModal(true);
  };

  const executeDelete = async () => {
    if (!projectToDelete) return;
    setIsProcessing(true);
    try {
      await api.delete(`/projects/${projectToDelete._id}`);
      setShowConfirmModal(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-gray-500 dark:text-gray-400">Loading Projects...</div>;
  }
  
  if (error) {
    return <div className="text-center py-10 text-red-500 bg-red-100 p-4 rounded-md">{error}</div>;
  }

  return (
    <>
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={executeDelete}
        title="Delete Project"
        message={`Are you sure you want to permanently delete the project "${projectToDelete?.title}"?`}
        isLoading={isProcessing}
      />
      <AnimatePresence>
        {isModalOpen && (
          <ProjectFormModal
            show={isModalOpen}
            onClose={closeModal}
            onSave={handleSave}
            project={editingProject}
            isLoading={isProcessing}
          />
        )}
      </AnimatePresence>

      <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 shadow-xl rounded-xl">
        <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-slate-700">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Manage Projects
          </h1>
          {isAdmin && (
            <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
              <PlusCircle size={18} /> Add Project
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(project => (
              <ProjectCard
                key={project._id}
                project={project}
                onUpdate={openModal}
                onDelete={openDeleteModal}
                isAdminView={isAdmin}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default AdminProjectsPage;