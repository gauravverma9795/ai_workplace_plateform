import axiosInstance from '../../utils/axiosConfig';

// Sync/create user in backend
const syncUser = async (userData) => {
  const response = await axiosInstance.post('/users', userData);
  return response.data;
};

// Get current user
const getCurrentUser = async () => {
  const response = await axiosInstance.get('/users/me');
  return response.data;
};

// Update subscription
const updateSubscription = async (subscriptionData) => {
  const response = await axiosInstance.put('/users/subscription', subscriptionData);
  return response.data;
};

const authService = {
  syncUser,
  getCurrentUser,
  updateSubscription,
};

export default authService;