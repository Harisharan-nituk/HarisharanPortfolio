import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ResumeCard from '../components/resumes/ResumeCard';
import { motion } from 'framer-motion';

const ResumePage = () => {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResumes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/resumes');
        setResumes(response.data);
      } catch (err) {
        console.error("Error fetching resumes:", err);
        setError(err.response?.data?.message || "Failed to load resumes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumes();
  }, []);

  if (isLoading) {
    return <div className="text-center py-20 text-gray-500 text-lg">Loading resumes...</div>;
  }
  
  if (error) {
    return <div className="text-center py-10 text-red-600 bg-red-50 p-4 rounded-md">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="flex flex-col sm:flex-row justify-center items-center mb-6 sm:mb-10 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center">
          My Resumes
        </h1>
      </div>

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
                isAdminView={false} // Ensures no admin buttons are shown
              />
            </motion.div>
          ))
        ) : (
          <p className="md:col-span-2 text-center text-gray-500 py-10 text-lg">
            No resumes currently available.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResumePage;