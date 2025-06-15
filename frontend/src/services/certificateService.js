// portfolio_py/frontend/src/services/certificateService.js
import api from './api';

export const getCertificates = async () => {
  try {
    const response = await api.get('/certificates');
    return response.data;
  } catch (error) {
    console.error('Error fetching certificates:', error.response?.data?.message || error.message);
    throw error.response?.data || new Error('Failed to fetch certificates');
  }
};

export const addCertificate = async (formData) => {
  // formData should be a FormData object
  try {
    const response = await api.post('/certificates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding certificate:', error.response?.data?.message || error.message);
    throw error.response?.data || new Error('Failed to add certificate');
  }
};

export const deleteCertificate = async (id) => {
  try {
    const response = await api.delete(`/certificates/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting certificate:', error.response?.data?.message || error.message);
    throw error.response?.data || new Error('Failed to delete certificate');
  }
};

// TODO: 
export const updateCertificate = async (id, formData) => {
  // formData should be a FormData object
  try {
    const response = await api.put(`/certificates/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating certificate:', error.response?.data?.message || error.message);
    throw error.response?.data || new Error('Failed to update certificate');
  }
};// export const updateCertificate = async (id, formData) => { ... }