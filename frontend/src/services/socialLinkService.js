// portfolio_py/frontend/src/services/socialLinkService.js
import api from './api';

// For public view (gets only enabled links)
export const getPublicSocialLinks = async () => {
  try {
    const response = await api.get('/sociallinks');
    return response.data;
  } catch (error) {
    console.error('Error fetching public social links:', error.response?.data?.message || error.message);
    throw error.response?.data || new Error('Failed to fetch social links');
  }
};

// For admin view (gets all links)
export const getAdminSocialLinks = async () => {
  try {
    const response = await api.get('/sociallinks/admin');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin social links:', error.response?.data?.message || error.message);
    throw error.response?.data || new Error('Failed to fetch admin social links');
  }
};

export const addSocialLink = async (linkData) => {
  try {
    const response = await api.post('/sociallinks', linkData);
    return response.data;
  } catch (error) {
    console.error('Error adding social link:', error.response?.data?.message || error.message);
    throw error.response?.data || new Error('Failed to add social link');
  }
};

export const updateSocialLink = async (id, linkData) => {
  try {
    const response = await api.put(`/sociallinks/${id}`, linkData);
    return response.data;
  } catch (error) {
    console.error('Error updating social link:', error.response?.data?.message || error.message);
    throw error.response?.data || new Error('Failed to update social link');
  }
};

export const deleteSocialLink = async (id) => {
  try {
    const response = await api.delete(`/sociallinks/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting social link:', error.response?.data?.message || error.message);
    throw error.response?.data || new Error('Failed to delete social link');
  }
};