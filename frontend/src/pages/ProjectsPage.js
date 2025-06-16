// frontend/src/pages/ProjectsPage.js
import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import ProjectCard from '../components/projects/ProjectCard'; 
import { motion } from 'framer-motion';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get('/projects');
        setProjects(data);
      } catch (err) {
        setError("Failed to load projects.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (isLoading) return <div className="text-center py-20">Loading projects...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">My Work & Projects</h1>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.length > 0 ? (
            projects.map((project) => (
              <motion.div key={project._id} variants={itemVariants}>
                {/* The ProjectCard is now view-only */}
                <ProjectCard project={project} />
              </motion.div>
            ))
          ) : (
            <p className="md:col-span-3 text-center text-gray-500 py-10">No projects to display yet.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsPage;