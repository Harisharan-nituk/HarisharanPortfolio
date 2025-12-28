// frontend/src/pages/ExperiencePage.js
import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import ExperienceCard from '../components/experience/ExperienceCard'; 
import { motion } from 'framer-motion';

const ExperiencePage = () => {
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  useEffect(() => {
    const fetchExperiences = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get('/experiences');
        setExperiences(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load experiences.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  if (isLoading) return <div className="text-center py-20">Loading experiences...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">My Experience</h1>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {experiences.length > 0 ? (
            experiences.map((experience) => (
              <motion.div key={experience._id} variants={itemVariants}>
                <ExperienceCard experience={experience} />
              </motion.div>
            ))
          ) : (
            <p className="md:col-span-3 text-center text-gray-500 py-10">No experiences to display yet.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ExperiencePage;

