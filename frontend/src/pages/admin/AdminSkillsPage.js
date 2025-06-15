// frontend/src/pages/admin/AdminSkillsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import * as skillService from '../../services/skillService';
import { Plus, Trash2 } from 'lucide-react';

const AdminSkillsPage = () => {
  const [skillCategories, setSkillCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSkillCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await skillService.getSkillCategories();
      setSkillCategories(data || []);
    } catch (error) {
      alert('Error: Could not fetch skills. Please check the console.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkillCategories();
  }, [fetchSkillCategories]);

  const handleAddCategory = async () => { 
    console.log("hiii i am rendering ");
    const name = prompt('Enter new category name:');
    if (name && name.trim()) {
      try {
        await skillService.addSkillCategory({ name: name.trim() });
        fetchSkillCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to add category');
      }
    }
  };
   console.log("hiii i am rendering ");
  const handleAddSkill = async (categoryId) => {
    const name = prompt('Enter new skill name:');
    if (name && name.trim()) {
      try {
        await skillService.addSkillToCategory(categoryId, { name: name.trim() });
        fetchSkillCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to add skill');
      }
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (window.confirm(`Delete the category "${categoryName}"? This will also delete all skills within it.`)) {
      try {
        await skillService.deleteSkillCategory(categoryId);
        fetchSkillCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  const handleDeleteSkill = async (categoryId, skillName) => {
    if (window.confirm(`Delete the skill "${skillName}"?`)) {
      try {
        await skillService.deleteSkillFromCategory(categoryId, skillName);
        fetchSkillCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete skill');
      }
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading skill data...</div>;
  }

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-slate-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Skills</h1>
        <button onClick={handleAddCategory} className="btn-primary flex items-center gap-2">
          <Plus /> New Category
        </button>
      </div>
      
      <div className="space-y-6">
        {skillCategories.map(category => (
          <div key={category._id} className="p-4 border rounded-lg dark:border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">{category.name}</h2>
              <div className="flex items-center gap-4">
                <button onClick={() => handleAddSkill(category._id)} className="text-green-500 hover:text-green-600 flex items-center gap-1 text-sm font-medium" title="Add Skill">
                  <Plus size={16} /> Add Skill
                </button>
                <button onClick={() => handleDeleteCategory(category._id, category.name)} className="text-red-500 hover:text-red-600" title="Delete Category">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2 border-t dark:border-slate-600">
              {category.skills.length > 0 ? category.skills.map(skill => (
                <div key={skill} className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 rounded-full px-3 py-1 text-sm">
                  <span className="dark:text-gray-200">{skill}</span>
                  <button onClick={() => handleDeleteSkill(category._id, skill)} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              )) : <p className="text-sm text-gray-400 italic">No skills in this category yet.</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSkillsPage;