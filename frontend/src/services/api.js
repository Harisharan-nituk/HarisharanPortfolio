// frontend/src/services/api.js
import axios from 'axios';

// Get the API URL from environment variables, with a fallback for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  // CONFIRMED: This 'headers' block should NOT contain 'Content-Type'.
  // Axios will automatically set the correct Content-Type (e.g., multipart/form-data for FormData,
  // or application/json for plain objects) based on the data you send.
});

/**
 * IMPORTANT: The Authorization token is now typically added to api.defaults.headers.common
 * by the AuthContext.js when a user logs in or when the app initializes with a stored token.
 * * Example from AuthContext.js:
 * * useEffect(() => {
 * if (token) {
 * api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
 * // ...
 * } else {
 * delete api.defaults.headers.common['Authorization'];
 * }
 * }, [token]);
 * * So, you usually don't need an explicit request interceptor here just for the token
 * if AuthContext is handling it globally for this 'api' instance.
 * If you needed more complex request logic, an interceptor could be added:
 * * api.interceptors.request.use(
 * async (config) => {
 * // const token = localStorage.getItem('token'); // Or get from AuthContext
 * // if (token && !config.headers.Authorization) { // Add only if not already set by AuthContext default
 * //   config.headers.Authorization = `Bearer ${token}`;
 * // }
 * return config;
 * },
 * (error) => {
 * return Promise.reject(error);
 * }
 * );
 */

export default api;