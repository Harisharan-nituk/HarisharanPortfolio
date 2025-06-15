// frontend/src/services/index.js

// Re-export the default export from api.js (which is the axios instance)
export { default as api } from './api';

// If you had other specific API functions in api.js or other service files,
// you could export them here too. For example:
// export const fetchProjects = () => api.get('/projects');
// export const createProject = (projectData) => api.post('/projects', projectData);