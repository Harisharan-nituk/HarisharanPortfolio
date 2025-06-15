// portfolio_py/frontend/src/pages/admin/AboutPage/AchievementsSection.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import * as achievementService from '../../../services/achievementService';
import AchievementFormModal from './AchievementFormModal';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const AchievementsSection = () => {
  const { isAdmin } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);

  const fetchAchievements = async () => {
    setIsLoading(true);
    try {
      const data = await achievementService.getAchievements();
      setAchievements(data || []);
    } catch (err) {
      setError('Failed to fetch achievements.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleOpenModal = (achievement = null) => {
    setEditingAchievement(achievement);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    setIsLoading(true);
    try {
      if (editingAchievement) {
        await achievementService.updateAchievement(editingAchievement._id, formData);
      } else {
        await achievementService.addAchievement(formData);
      }
      setShowModal(false);
      fetchAchievements(); // Refetch data
    } catch (err) {
      console.error('Failed to save achievement:', err);
      alert('Could not save achievement. Check console for details.');
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, description) => {
    if (window.confirm(`Are you sure you want to delete this achievement?\n"${description}"`)) {
      setIsLoading(true);
      try {
        await achievementService.deleteAchievement(id);
        fetchAchievements();
      } catch (err) {
        console.error('Failed to delete achievement:', err);
        alert('Could not delete achievement. Check console for details.');
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <section id="achievements" className="bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-xl shadow-xl transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4 sm:mb-0">
            Achievements
          </h2>
          {isAdmin && (
            <button onClick={() => handleOpenModal()} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
              <PlusCircle size={16} /> Add Achievement
            </button>
          )}
        </div>

        {isLoading && <p>Loading achievements...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        {!isLoading && !error && achievements.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">No achievements listed yet. {isAdmin && 'Click "Add Achievement" to add one.'}</p>
        )}

        {achievements.length > 0 && (
          <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
            {achievements.map((achievement) => (
              <li key={achievement._id} className="relative group pl-2 flex justify-between items-center">
                <span>{achievement.description}</span>
                {isAdmin && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex gap-2">
                    <button onClick={() => handleOpenModal(achievement)} className="p-1 text-blue-500 hover:text-blue-400" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(achievement._id, achievement.description)} className="p-1 text-red-500 hover:text-red-400" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {isAdmin && showModal && (
        <AchievementFormModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          currentAchievement={editingAchievement}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default AchievementsSection;