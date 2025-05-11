import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('clerkToken');
    const userId = localStorage.getItem('clerkUserId');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (userId) {
      config.headers['x-clerk-user-id'] = userId;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;