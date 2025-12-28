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
          setProjects(Array.isArray(data) ? data : []); // Use this line

        // setProjects(data);
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
    <div className="bg-gradient-to-br from-slate-50 via-white to-sky-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 dark:text-white mb-4">
            My <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">Work</span> & Projects
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore my portfolio of innovative projects and creative solutions
          </p>
        </motion.div>
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
            <motion.div 
              className="md:col-span-3 text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-gray-500 dark:text-gray-400 text-lg">No projects to display yet.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsPage;