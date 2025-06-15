// frontend/src/services/achievementService.js
import api from './api';

export const getAchievements = async () => {
  const { data } = await api.get('/achievements');
  return data;
};

export const addAchievement = async (achievementData) => {
  const { data } = await api.post('/achievements', achievementData);
  return data;
};

export const updateAchievement = async (id, achievementData) => {
  const { data } = await api.put(`/achievements/${id}`, achievementData);
  return data;
};

export const deleteAchievement = async (id) => {
  const { data } = await api.delete(`/achievements/${id}`);
  return data;
};