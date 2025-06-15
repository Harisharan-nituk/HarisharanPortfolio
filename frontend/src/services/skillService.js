// portfolio_py/frontend/src/services/skillService.js
import api from './api'; // This imports your configured Axios instance from api.js in the same folder

export const getSkillCategories = async () => {
  try {
    const response = await api.get('/skillcategories');
    return response.data;
  } catch (error) {
    console.error('Error fetching skill categories:', error.response ? error.response.data : error.message);
    throw error.response?.data || new Error('Failed to fetch skill categories');
  }
};

export const addSkillCategory = async (categoryData) => {
  // categoryData will now be just { name: "New Category Name" }
  try {
    const response = await api.post('/skillcategories', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error adding skill category:', error.response ? error.response.data : error.message);
    throw error.response?.data || new Error('Failed to add skill category');
  }
};

export const updateSkillCategory = async (categoryId, categoryData) => {
  // categoryData will now be just { name: "Updated Category Name" }
  try {
    const response = await api.put(`/skillcategories/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error updating skill category:', error.response ? error.response.data : error.message);
    throw error.response?.data || new Error('Failed to update skill category');
  }
};
// NEWLY ADDED based on backend capabilities
export const deleteSkillCategory = async (categoryId) => {
  try {
    const response = await api.delete(`/skillcategories/${categoryId}`);
    return response.data; // Or handle based on what your backend returns (e.g., status code)
  } catch (error) {
    console.error(`Error deleting skill category ${categoryId}:`, error.response ? error.response.data : error.message);
    throw error.response?.data || new Error('Failed to delete skill category');
  }
};

export const addSkillToCategory = async (categoryId, skillData) => {
  // skillData should be an object like { name: "Skill Name" }
  // The backend controller for addSkillToCategory expects 'name' in the body.
  try {
    const response = await api.post(`/skillcategories/${categoryId}/skills`, skillData); 
    return response.data; // This might be the new skill object or the whole updated category
  } catch (error) {
    console.error(`Error adding skill to category ${categoryId}:`, error.response ? error.response.data : error.message);
    throw error.response?.data || new Error('Failed to add skill to category');
  }
};

// Corrected to pass skillName, which will be used as skillId in the URL path (URL encoded)
export const deleteSkillFromCategory = async (categoryId, skillName) => {
  // Backend route: DELETE /api/skillcategories/:categoryId/skills/:skillId
  // Backend controller uses req.params.skillName, so skillId in path is treated as skillName
  try {
    const response = await api.delete(`/skillcategories/${categoryId}/skills/${encodeURIComponent(skillName)}`);
    return response.data; 
  } catch (error) {
    console.error(`Error deleting skill '${skillName}' from category ${categoryId}:`, error.response ? error.response.data : error.message);
    throw error.response?.data || new Error('Failed to delete skill from category');
  }
};

// The old updateSkill function is intentionally omitted as it's not for the category-based structure.