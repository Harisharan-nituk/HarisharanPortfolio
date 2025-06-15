// frontend/src/pages/ProjectsPage.js
import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { useAuth } from '../contexts/AuthContext'; 
import ProjectCard from '../components/projects/ProjectCard'; 
import { motion } from 'framer-motion';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { PlusCircle } from 'lucide-react';

// Reusable input and label styles for modals
const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 sm:text-sm";
const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

const ProjectsPage = () => {
  const { isAdmin, isLoadingAuth } = useAuth(); 
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  const [projectData, setProjectData] = useState({
    title: '', description: '', projectLink: '', githubUrl: '', technologies: ''
  });
  const [projectImage, setProjectImage] = useState(null);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } };

  const displayMessage = (message, type = 'success') => {
    setActionMessage({ text: message, type });
    setTimeout(() => setActionMessage({ text: '', type: '' }), 4000);
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openModal = (project = null) => {
    setEditingProject(project);
    if (project) {
      setProjectData({
        title: project.title,
        description: project.description,
        projectLink: project.projectLink || '',
        githubUrl: project.githubUrl || '',
        technologies: project.technologies ? project.technologies.join(', ') : ''
      });
    } else {
      setProjectData({ title: '', description: '', projectLink: '', githubUrl: '', technologies: '' });
    }
    setProjectImage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => setProjectData({ ...projectData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setProjectImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectData.title || !projectData.description) {
      return displayMessage("Title and description are required.", 'error');
    }

    const formData = new FormData();
    Object.keys(projectData).forEach(key => formData.append(key, projectData[key]));
    if (projectImage) formData.append('projectImage', projectImage);

    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        displayMessage('Project updated successfully!', 'success');
      } else {
        await api.post('/projects', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        displayMessage('Project added successfully!', 'success');
      }
      closeModal();
      fetchProjects();
    } catch (err) {
      displayMessage(err.response?.data?.message || "Failed to save project.", 'error');
    }
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const openDeleteModal = (project) => {
    setProjectToDelete(project);
    setShowConfirmModal(true);
  };

  const executeDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      await api.delete(`/projects/${projectToDelete._id}`);
      displayMessage(`Project "${projectToDelete.title}" deleted.`, 'success');
      setShowConfirmModal(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (err) {
      displayMessage(err.response?.data?.message || 'Failed to delete project.', 'error');
    }
  };
  
  if (isLoadingAuth || isLoading) {
    return <div className="text-center py-20 text-gray-500 text-lg">Loading...</div>;
  }
  
  if (error) {
    return <div className="text-center py-10 text-red-600 bg-red-50 p-4 rounded-md">{error}</div>;
  }

  return (
    <>
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={executeDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to permanently delete "${projectToDelete?.title}"?`}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className={labelClasses}>Project Name*</label>
                <input type="text" name="title" id="title" value={projectData.title} onChange={handleChange} required className={inputClasses} />
              </div>
              <div>
                <label htmlFor="description" className={labelClasses}>Description*</label>
                <textarea name="description" id="description" rows="4" value={projectData.description} onChange={handleChange} required className={inputClasses}></textarea>
              </div>
              <div>
                <label htmlFor="technologies" className={labelClasses}>Technologies (comma-separated)</label>
                <input type="text" name="technologies" id="technologies" value={projectData.technologies} onChange={handleChange} className={inputClasses} placeholder="React, Node.js, Express"/>
              </div>
              <div>
                <label htmlFor="projectLink" className={labelClasses}>Live Demo Link</label>
                <input type="url" name="projectLink" id="projectLink" value={projectData.projectLink} onChange={handleChange} className={inputClasses} placeholder="https://example.com"/>
              </div>
              <div>
                <label htmlFor="githubUrl" className={labelClasses}>GitHub Repo Link</label>
                <input type="url" name="githubUrl" id="githubUrl" value={projectData.githubUrl} onChange={handleChange} className={inputClasses} placeholder="https://github.com/user/repo"/>
              </div>
              <div>
                <label htmlFor="projectImage" className={labelClasses}>Project Image</label>
                <input type="file" name="projectImage" id="projectImage" onChange={handleFileChange} className="mt-1 file-input-style w-full" accept="image/*" />
                {editingProject && <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Leave blank to keep existing image.</p>}
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editingProject ? 'Save Changes' : 'Add Project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">My Work</h1>
          {isAdmin && (
            <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
              <PlusCircle size={18} /> Add Project
            </button>
          )}
        </div>
        
        {actionMessage.text && (
            <div className={`p-3 my-4 rounded-md text-sm text-center ${actionMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {actionMessage.text}
            </div>
        )}

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.length > 0 ? (
            projects.map((project) => (
              <motion.div key={project._id} variants={itemVariants}>
                <ProjectCard
                  project={project}
                  onUpdate={() => openModal(project)}
                  onDelete={() => openDeleteModal(project)}
                  isAdminView={isAdmin}
                />
              </motion.div>
            ))
          ) : (
            <div className="md:col-span-3 text-center text-gray-500 py-10">
              <p className="text-lg">No projects to display yet.</p>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ProjectsPage;