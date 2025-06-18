// frontend/src/pages/admin/AboutPage/SkillsSection.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { useAuth } from '../../../contexts/AuthContext';
import * as skillService from '../../../services/skillService';
import { Cpu, Edit } from 'lucide-react';

const SkillsSection = () => {
  const { isAdmin } = useAuth();
  const [skillCategories, setSkillCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      setIsLoading(true);
      try {
        const data = await skillService.getSkillCategories();
        setSkillCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to fetch skills.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
  }, []);

  return (
    <section id="skills" className="bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-xl shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4 sm:mb-0 flex items-center">
          <Cpu className="mr-3 h-8 w-8 text-indigo-500" />
          Technical Skills
        </h2>
        {isAdmin && (
          // This button now links to the new admin page for skills
          <Link to="/admin/skills" className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
            <Edit size={16} /> Manage Skills
          </Link>
        )}
      </div>

      {isLoading && <p className="text-center text-gray-500">Loading skills...</p>}
      {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
      
      {!isLoading && !error && (
        <div className="space-y-8">
          {skillCategories.map((category) => (
            <div key={category._id}>
              <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 pb-2 mb-4 border-b-2 border-gray-200 dark:border-slate-700">
                {category.name}
              </h3>
              {category.skills && category.skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill) => (
                    <span key={skill} className="bg-indigo-100 text-indigo-800 dark:bg-slate-700 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No skills listed in this category.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SkillsSection;