import React, { useState, useEffect, useCallback } from 'react';
import * as skillService from '../../services/skillService';
import { Plus, Trash2, X } from 'lucide-react';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';

// --- Reusable Form Modal for Adding Categories or Skills ---
const SkillFormModal = ({ isOpen, onClose, onSubmit, mode, isLoading }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name);
    setName(''); // Reset after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          {mode === 'category' ? 'Add New Category' : 'Add New Skill'}
        </h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="skill-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === 'category' ? 'Category Name' : 'Skill Name'}
          </label>
          <input
            id="skill-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 sm:text-sm"
          />
          <div className="flex justify-end gap-3 pt-4 mt-2">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isLoading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// --- Main Admin Skills Page Component ---
const AdminSkillsPage = () => {
  const [skillCategories, setSkillCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('category'); // 'category' or 'skill'
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const displayMessage = (message, type = 'success') => {
    setActionMessage({ text: message, type });
    setTimeout(() => setActionMessage({ text: '', type: '' }), 4000);
  };

  const fetchSkillCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await skillService.getSkillCategories();
      setSkillCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      displayMessage('Error: Could not fetch skills.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchSkillCategories(); }, [fetchSkillCategories]);
  
  const openFormModal = (mode, categoryId = null) => {
    setModalMode(mode);
    setCurrentCategoryId(categoryId);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (name) => {
    setIsProcessing(true);
    try {
      if (modalMode === 'category') {
        await skillService.addSkillCategory({ name });
        displayMessage(`Category "${name}" added successfully.`);
      } else {
        await skillService.addSkillToCategory(currentCategoryId, { name });
        displayMessage(`Skill "${name}" added successfully.`);
      }
      fetchSkillCategories();
      setIsFormModalOpen(false);
    } catch (error) {
      displayMessage(error.message || 'An error occurred.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const openDeleteModal = (type, item) => {
    setItemToDelete({ type, ...item });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsProcessing(true);
    try {
      if (itemToDelete.type === 'category') {
        await skillService.deleteSkillCategory(itemToDelete._id);
        displayMessage(`Category "${itemToDelete.name}" deleted.`);
      } else {
        await skillService.deleteSkillFromCategory(itemToDelete.categoryId, itemToDelete.name);
        displayMessage(`Skill "${itemToDelete.name}" deleted.`);
      }
      fetchSkillCategories();
    } catch (error) {
      displayMessage(error.message || 'Failed to delete item.', 'error');
    } finally {
      setIsProcessing(false);
      setIsConfirmModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isFormModalOpen && (
          <SkillFormModal
            isOpen={isFormModalOpen}
            onClose={() => setIsFormModalOpen(false)}
            onSubmit={handleFormSubmit}
            mode={modalMode}
            isLoading={isProcessing}
          />
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${itemToDelete?.type}`}
        message={`Are you sure you want to delete "${itemToDelete?.name}"?`}
        isLoading={isProcessing}
      />
      
      <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4 pb-4 border-b dark:border-slate-700">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Skills</h1>
          <button onClick={() => openFormModal('category')} className="btn-primary flex items-center gap-2"><Plus /> New Category</button>
        </div>

        {actionMessage.text && (
            <div className={`p-3 my-4 rounded-md text-sm text-center ${actionMessage.type === 'success' ? 'bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-300'}`}>
                {actionMessage.text}
            </div>
        )}

        {isLoading ? <p className="text-center py-10">Loading...</p> : (
          <div className="space-y-6">
            {skillCategories.map(category => (
              <div key={category._id} className="p-4 border rounded-lg dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">{category.name}</h2>
                  <div className="flex items-center gap-3">
                    <button onClick={() => openFormModal('skill', category._id)} className="text-green-500 hover:text-green-400" title="Add Skill"><Plus size={20} /></button>
                    <button onClick={() => openDeleteModal('category', { _id: category._id, name: category.name })} className="text-red-500 hover:text-red-400" title="Delete Category"><Trash2 size={18} /></button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.length > 0 ? category.skills.map(skill => (
                    <div key={skill} className="flex items-center gap-2 bg-gray-200 dark:bg-slate-700 rounded-full px-3 py-1.5 text-sm">
                      <span className="dark:text-gray-200">{skill}</span>
                      <button onClick={() => openDeleteModal('skill', { name: skill, categoryId: category._id })} className="text-gray-500 hover:text-red-500 dark:text-gray-400"><X size={14} /></button>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">No skills in this category yet. Click the '+' to add one.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminSkillsPage;