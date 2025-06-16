import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const EducationSection = () => {
  const [educationHistory, setEducationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEducationHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/education');
        setEducationHistory(data || []);
      } catch (err) {
        console.error("Error fetching education history:", err);
        setError(err.response?.data?.message || "Failed to load education history.");
        setEducationHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEducationHistory();
  }, []);

  return (
    <section id="education" className="bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-xl shadow-xl transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4 sm:mb-0">
          Education
        </h2>
      </div>

      {isLoading && educationHistory.length === 0 && <p className="dark:text-gray-300 text-center py-4">Loading education history...</p>}
      {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md text-center py-4">Error: {error}</p>}
      
      {!isLoading && !error && educationHistory.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-6">
          No education entries have been added yet.
        </p>
      )}

      {!isLoading && !error && educationHistory.length > 0 && (
        <div className="space-y-6">
          {educationHistory.map((edu) => (
            <div key={edu._id} className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm bg-gray-50 dark:bg-slate-700/40 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start">
                <div className="flex-grow mb-3 sm:mb-0">
                  <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">{edu.degree}</h3>
                  <p className="text-md font-medium text-gray-700 dark:text-gray-300">{edu.institution}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {edu.startDate} – {edu.endDate} {edu.location && `| ${edu.location}`}
                  </p>
                  {edu.gpa && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">GPA: {edu.gpa}</p>}
                </div>
              </div>
              {edu.description && <p className="mt-3 pt-3 border-t dark:border-slate-600 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}
      {isLoading && educationHistory.length > 0 && <p className="text-sm text-center text-gray-500 dark:text-gray-400 my-4">Refreshing list...</p>}
    </section>
  );
};

export default EducationSection;