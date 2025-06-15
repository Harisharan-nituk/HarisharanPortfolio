// portfolio_py/frontend/src/components/about/EducationSection.js
import React, { useState, useEffect } from 'react';
import api from '../../../services/api'; // Or your specific education service if created

const EducationSection = () => {
  const [educationHistory, setEducationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/education'); // Public endpoint
        setEducationHistory(data || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch education history.');
        setEducationHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEducation();
  }, []);

  return (
    <section id="education" className="bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-xl shadow-xl transition-colors duration-300">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-8">Education</h2>
      {loading && <p className="dark:text-gray-300">Loading education...</p>}
      {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">Error: {error}</p>}
      {!loading && !error && educationHistory.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No education history to display.</p>
      )}
      {!loading && !error && educationHistory.length > 0 && (
        <div className="space-y-6">
          {educationHistory.map((edu) => (
            <div key={edu._id} className="border-l-4 border-indigo-500 dark:border-indigo-400 pl-4 py-2">
              <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">{edu.degree}</h3>
              <p className="text-md font-medium text-gray-700 dark:text-gray-300">{edu.institution}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {edu.startDate} – {edu.endDate} {edu.location && `| ${edu.location}`}
              </p>
              {edu.gpa && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">GPA: {edu.gpa}</p>}
              {edu.description && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default EducationSection;